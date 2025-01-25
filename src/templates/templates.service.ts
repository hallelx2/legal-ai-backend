import { Injectable, NotFoundException } from '@nestjs/common';
import { TemplateBase } from './template-base.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { PREDEFINED_TEMPLATES } from './templates.predefined';
import {
  CreateCustomTemplateDto,
  TemplateSearchQuery,
} from './dto/create-template.dto';
import { TemplateCategory } from './template.enum';
import { TemplateSection } from 'src/agreements/schemas/agreement-templates.types.ts';
import {
  TemplateVersionChangesDto,
  VersionChangeType,
  SectionChangeDto,
} from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  private readonly predefinedTemplates = new Map<
    string,
    Partial<TemplateBase>
  >();

  constructor(
    @InjectModel(TemplateBase.name)
    private templateModel: Model<TemplateBase>,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.initializePredefinedTemplates();
  }

  private async initializePredefinedTemplates() {
    // Iterate through predefined templates and add only if not already present
    for (const template of PREDEFINED_TEMPLATES) {
      const existingTemplate = await this.templateModel.findOne({
        $or: [
          { id: template.id },
          {
            name: template.name,
            category: template.category,
          },
        ],
      });

      if (!existingTemplate) {
        // Retain the sections and signature locations from the predefined template
        const predefinedTemplate: Partial<TemplateBase> = {
          ...template,
          version: template.version || '1.0.0', // Preserve the version if defined
          sections: template.sections || [], // Ensure sections are preserved
          defaultSignatureLocations: template.defaultSignatureLocations || [], // Preserve signature locations
          metadata: {
            ...template.metadata,
            lastUpdated: new Date(),
            isCustom: false,
            status: 'published',
          },
        };

        // Create the new template in the database
        await this.templateModel.create(predefinedTemplate); 
      }
    }
  }


  private mergeCustomSections(
    baseSections: TemplateSection[],
    customSections: TemplateSection[],
  ): TemplateSection[] {
    if (!customSections) return baseSections;

    const merged = [...baseSections];

    customSections.forEach((customSection) => {
      const existingIndex = merged.findIndex((s) => s.id === customSection.id);
      if (existingIndex >= 0) {
        merged[existingIndex] = {
          ...merged[existingIndex],
          ...customSection,
          variables: [
            ...merged[existingIndex].variables,
            ...customSection.variables,
          ],
        };
      } else {
        merged.push(customSection);
      }
    });
    return merged;
  }

  private mergeSectionChanges(
    currentSections: TemplateSection[],
    sectionChanges: SectionChangeDto[],
  ): TemplateSection[] {
    // Create a copy of current sections to avoid mutation
    const updatedSections = [...currentSections];

    // Apply changes to existing sections
    sectionChanges.forEach((change) => {
      const sectionIndex = updatedSections.findIndex(
        (section) => section.id === change.sectionId,
      );

      if (sectionIndex !== -1) {
        // Merge changes, preserving existing data
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          ...(change.title && { title: change.title }),
          ...(change.description && { description: change.description }),
          ...(change.variables && {
            variables: [
              ...updatedSections[sectionIndex].variables,
              ...change.variables,
            ],
          }),
          ...(change.content && { content: change.content }),
        };
      }
    });

    return updatedSections;
  }

  async createCustomTemplate(
    data: CreateCustomTemplateDto,
    userId: string,
  ): Promise<TemplateBase> {
    const baseTemplate = data.baseTemplateId
      ? await this.templateModel.findById(data.baseTemplateId)
      : null;
    const customTemplate: Partial<TemplateBase> = {
      id: `custom-${uuidv4()}`,
      name: data.name,
      description: data.description,
      version: '1.0.0',
      category: TemplateCategory.CUSTOM,
      sections: baseTemplate
        ? this.mergeCustomSections(baseTemplate.sections, data.customSections)
        : data.customSections,

      defaultSignatureLocations:
        data.defaultSignatureLocations ||
        baseTemplate?.defaultSignatureLocations ||
        [],
      metadata: {
        industry: data.industry,
        jurisdiction: data.jurisdiction,
        lastUpdated: new Date(),
        reviewedBy: userId,
        isCustom: true,
        parentTemplateId: baseTemplate?.id,
        tags: data.tags || [],
        status: 'published',
      },
      customization: {
        allowedSections: data.allowedSections,
        requiredSections: data.requiredSections,
        variableOverrides: data.variableOverrides,
        additionalSections: data.additionalSections,
      },
    };
    return await this.templateModel.create(customTemplate);
  }
  async getTemplateByCategory(
    category: TemplateCategory,
  ): Promise<TemplateBase[]> {
    return await this.templateModel.find({ category });
  }
  async searchTemplates(query: TemplateSearchQuery): Promise<TemplateBase[]> {
    const filter: any = {};

    if (query.category) {
      filter.category = query.category;
    }

    if (query.tags?.length) {
      filter['metadata.tags'] = { $all: query.tags };
    }
    if (query.status) {
      filter['metadata.status'] = query.status;
    }
    if (query.searchText) {
      filter.$or = [
        { name: { $regex: query.searchText, $options: 'i' } },
        { description: { $regex: query.searchText, $options: 'i' } },
      ];
    }
    return await this.templateModel
      .find(filter)
      .sort({ 'metadata.lastUpdated': -1 })
      .limit(query.limit || 10)
      .skip(query.offset || 0);
  }

  async versionTemplate(
    templateId: string,
    changes: TemplateVersionChangesDto,
  ): Promise<TemplateBase> {
    const currentTemplate = await this.templateModel.findOne({
      id: templateId,
    });

    if (!currentTemplate) {
      throw new NotFoundException('Template not found');
    }

    // Version incrementing logic
    const [major, minor, patch] = currentTemplate.version
      .split('.')
      .map(Number);
    const newVersion =
      changes.type === VersionChangeType.MAJOR
        ? `${major + 1}.0.0`
        : changes.type === VersionChangeType.MINOR
          ? `${major}.${minor + 1}.0`
          : `${major}.${minor}.${patch + 1}`;

    // Merge section changes
    const updatedSections = this.mergeSectionChanges(
      currentTemplate.sections,
      changes.sectionChanges || [],
    );

    const versionedTemplate: Partial<TemplateBase> = {
      ...currentTemplate.toObject(),
      version: newVersion,
      sections: updatedSections,
      metadata: {
        ...currentTemplate.metadata,
        lastUpdated: new Date(),
        reviewedBy: changes.userId,
        status: 'draft', // New version starts as draft
      },
    };

    // Remove MongoDB internal ID to create a new document
    delete versionedTemplate._id;

    // Mark previous version as archived
    await this.templateModel.updateOne(
      { id: templateId },
      { $set: { 'metadata.status': 'archived' } },
    );

    // Create and return new template version
    return await this.templateModel.create(versionedTemplate);
  }

  async getTemplateById(id: string): Promise<TemplateBase> {
    return await this.templateModel.findOne({ id });
  }

  async getUserTemplates(userId: string): Promise<TemplateBase[]> {
    return await this.templateModel.find({
      'metadata.reviewedBy': userId,
    });
  }

  async getPredefinedTemplates(): Promise<TemplateBase[]> {
    return this.templateModel.find({
      'metadata.isCustom': false, // This is the most direct way to filter non-custom templates
    });
  }

  async getAllTemplatesForUser(userId: string): Promise<TemplateBase[]> {
    return await this.templateModel.find({
      $or: [{ 'metadata.reviewedBy': userId }, { 'metadata.isCustom': false }],
    });
  }

  async getTemplatesForUser(userId: string): Promise<TemplateBase[]> {
    return await this.templateModel.find({
      $or: [{ 'metadata.reviewedBy': userId }, { 'metadata.isCustom': true }],
    });
  }
}
