import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { AgreementDocument, Agreement } from './schemas/agreement.schemas';
import { AgreementGenerationDto } from './dto/create-agreement.dto';
import { AiGeneratorService } from 'src/ai-generator/ai-generator.service';
import { TemplatesService } from 'src/templates/templates.service';


@Injectable()
export class AgreementsService {
  constructor(
    @InjectModel(Agreement.name)
    private agreementModel: Model<AgreementDocument>,
    private readonly aiGenerationService: AiGeneratorService,
    private readonly templatesService: TemplatesService,
  ) {}

  async generateAgreement(dto: AgreementGenerationDto) {
    // Fetch and validate template
    const template = await this.templatesService.getTemplateById(
      dto.templateId,
    );

    // Validate input against template
    this.validateInputAgainstTemplate(template, dto);

    // Generate sections content
    const generatedSections = await Promise.all(
      template.sections.map(async (section) => {
        const sectionVariables =
          dto.sections.find((s) => s.sectionId === section.id)?.variables || [];

        const variablesMap = sectionVariables.reduce((acc, variable) => {
          acc[variable.id] = variable.value;
          return acc;
        }, {});

        const generatedContent =
          await this.aiGenerationService.generateSectionContent(
            template.id,
            section.id,
            variablesMap,
          );

        return {
          id: section.id,
          title: section.title,
          content: generatedContent,
          variables: sectionVariables,
        };
      }),
    );

    // Generate HTML content
    const htmlContent = this.generateAgreementHtml(
      template,
      generatedSections,
      dto.signatureLocations,
    );

    // Create and save agreement
    const agreementDocument = new this.agreementModel({
      userId: dto.userId,
      templateId: template.id,
      name: template.name,
      version: template.version,
      metadata: {
        jurisdiction: template.metadata.jurisdiction,
        status: 'generated',
      },
      sections: generatedSections,
      signatureLocations: dto.signatureLocations.map((loc) => ({
        ...loc,
        status: 'pending',
      })),
      htmlContent,
    });

    await agreementDocument.save();

    return {
      id: agreementDocument._id,
      ...agreementDocument.toObject(),
    };
  }

  async findAll(query?: any): Promise<Agreement[]> {
    return this.agreementModel.find(query || {}).exec();
  }

  async findById(id: string): Promise<Agreement> {
    const agreement = await this.agreementModel.findById(id);
    if (!agreement) {
      throw new NotFoundException(`Agreement with ID ${id} not found`);
    }
    return agreement;
  }

  async updateAgreementStatus(id: string, status: string) {
    return this.agreementModel.findByIdAndUpdate(
      id,
      { 'metadata.status': status },
      { new: true },
    );
  }

  async deleteAgreement(id: string) {
    const result = await this.agreementModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Agreement with ID ${id} not found`);
    }
    return result;
  }

  private validateInputAgainstTemplate(template, dto: AgreementGenerationDto) {
    const requiredSections = template.sections.filter((s) => s.required);

    requiredSections.forEach((section) => {
      const providedSection = dto.sections.find(
        (s) => s.sectionId === section.id,
      );

      if (!providedSection) {
        throw new BadRequestException(
          `Required section ${section.id} is missing`,
        );
      }

      section.variables.forEach((templateVariable) => {
        if (templateVariable.required) {
          const providedVariable = providedSection.variables.find(
            (v) => v.id === templateVariable.id,
          );

          if (!providedVariable || !providedVariable.value) {
            throw new BadRequestException(
              `Required variable ${templateVariable.id} is missing in section ${section.id}`,
            );
          }
        }
      });
    });
  }

  private generateAgreementHtml(template, sections, signatureLocations) {
    // HTML generation logic from previous implementation
    const agreementCSS = 'AgreementCss'; // CSS remains the same

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head> 
      ${agreementCSS}
      </head> 
      <body>
      
      <div class="agreement-container">
        <h1>${template.name}</h1>
        <p>Version: ${template.version}</p>
        <p>Jurisdiction: ${template.metadata.jurisdiction}</p>

        ${sections
          .map(
            (section) => `
          <div class="section" data-section-id="${section.id}">
            <h2>${section.title}</h2>
            <div class="section-content">
              ${section.content}
            </div>
          </div>
        `,
          )
          .join('')}

        <div class="signature-section">
          ${signatureLocations
            .map(
              (loc) => `
            <div class="signature-container"
                 style="left: ${loc.x}px; top: ${loc.y}px;">
              <div class="signature-line"></div>
              <div class="signature-details">
                ${loc.role} (${loc.email})
                ${loc.required ? '(Required)' : '(Optional)'}
              </div>
            </div>
          `,
            )
            .join('')}
        </div>
      </div>
      </body>
      </html>
    `;

    return htmlContent;
  }
  async findAgreementByUserId(userId: string) {
    return this.agreementModel.find({ userId }).exec();
  }
}
