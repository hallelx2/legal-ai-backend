// src/templates/template.engine.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class TemplateEngine implements OnModuleInit {
  private templates: Map<string, Handlebars.TemplateDelegate> = new Map();
  private readonly templatesPath = path.join(process.cwd(), 'src', 'docusign', 'templates');

  // Initialize when the module starts
  async onModuleInit() {
    await this.loadTemplates();
    this.registerHelpers();
  }

  private registerHelpers() {
    // Add helpful Handlebars helpers
    Handlebars.registerHelper('formatDate', function(date) {
      return new Date(date).toLocaleDateString();
    });

    Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    });
  }

  private async loadTemplates() {
    try {
      // Load partial templates first
      const headerContent = await fs.readFile(
        path.join(this.templatesPath, 'header.hbs'),
        'utf-8'
      );
      Handlebars.registerPartial('header', headerContent);

      const metadataContent = await fs.readFile(
        path.join(this.templatesPath, 'metadata.hbs'),
        'utf-8'
      );
      Handlebars.registerPartial('metadata', metadataContent);

      // Load the main template
      const modernTemplate = await fs.readFile(
        path.join(this.templatesPath, 'modern.hbs'),
        'utf-8'
      );
      this.templates.set('modern', Handlebars.compile(modernTemplate));

    } catch (error) {
      console.error('Error loading templates:', error);
      throw new Error('Failed to load templates');
    }
  }

  async renderTemplate(templateName: string, data: any): Promise<string> {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    // Add current date to the data context
    const enrichedData = {
      ...data,
      currentDate: new Date(),
    };

    return template(enrichedData);
  }
}
