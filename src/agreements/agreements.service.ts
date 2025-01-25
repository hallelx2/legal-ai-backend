import { BadRequestException, Injectable } from '@nestjs/common';
import { AgreementGenerationDto } from './dto/create-agreement.dto';
import { UpdateAgreementDto } from './dto/update-agreement.dto';
import { AiGeneratorService } from 'src/ai-generator/ai-generator.service';
import { TemplatesService } from 'src/templates/templates.service';
import { TemplateType } from './schemas/agreement-templates.types.ts';

@Injectable()
export class AgreementsService {
    constructor(
        private readonly aiGenerationSercice: AiGeneratorService,
        private readonly templatesService: TemplatesService,
    ) {}

    async generateAgreement(dto: AgreementGenerationDto) {
        const template = await this.templatesService.getTemplateById(dto.templateId);

        this.validateInputAgainstTemplate(template, dto);

        // Then I have to generate all the content for each of the sections
        const generatedSections = await Promise.all(
            template.sections.map(async (section) => {
                const sectionVariables = dto.sections
                    .find((s) => s.sectionId === section.id)?.variables || [];
                const variablesMap = sectionVariables.reduce((acc, variable) => {
                    acc[variable.id] = variable.value;
                    return acc;
                }, {})

                const generatedContent = await this.aiGenerationSercice.generateSectionContent(
                    template.id,
                    section.id,
                    variablesMap,
                );
                return {
                    id: section.id,
                    title: section.title,
                    content: generatedContent,
                    variables: sectionVariables,
                }
            })
        )
        return this.assembleAgreement(template, generatedSections);
    }

    private validateInputAgainstTemplate(template, dto: AgreementGenerationDto) {
        const requiredSections = template.sections.filter(s => s.required)
        requiredSections.forEach(section=> {
            const providedSection = dto.sections.find(s => s.sectionId === section.id);
            if (!providedSection) {
                throw new BadRequestException(`Required section ${section.id} is missing `)
            }
            section.variables.forEach(templateVariable => {
                if (templateVariable.required) {
                    const providedVariable = providedSection.variables.find(v => v.id === templateVariable.id);
                    if (!providedVariable) {
                        throw new BadRequestException(`Required variable ${templateVariable.id} is missing in section ${section.id}`)
                    }
                }
            })
        })
    }

    private assembleAgreement(template, generatedSections: any[]) {
        // Create the CSS as a template literal
        const agreementCSS = `
        <style>
        :root {
            /* Color Palette */
            --primary-background: #f4f7f6;
            --document-background: #ffffff;
            --text-primary: #2c3e50;
            --text-secondary: #34495e;
            --accent-color: #3498db;
            --border-color: #e0e6ed;

            /* Typography */
            --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            --font-size-base: 16px;
            --font-size-small: 0.875rem;
            --font-size-large: 1.25rem;
        }

        .agreement-container {
            max-width: 800px;
            margin: 2rem auto;
            background-color: var(--document-background);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            border-radius: 12px;
            overflow: hidden;
            font-family: var(--font-primary);
            color: var(--text-primary);
            line-height: 1.6;
        }

        .agreement-container h1 {
            text-align: center;
            background-color: var(--accent-color);
            color: white;
            padding: 1.5rem;
            margin: 0;
            font-size: 2rem;
            font-weight: 700;
            letter-spacing: -0.5px;
        }

        .agreement-container > p {
            text-align: center;
            color: var(--text-secondary);
            padding: 0.5rem;
            background-color: var(--primary-background);
            margin: 0;
            font-size: var(--font-size-small);
        }

        .section {
            padding: 1.5rem;
            border-bottom: 1px solid var(--border-color);
            transition: background-color 0.3s ease;
        }

        .section:hover {
            background-color: rgba(52, 152, 219, 0.02);
        }

        .section h2 {
            color: var(--accent-color);
            border-bottom: 2px solid var(--accent-color);
            padding-bottom: 0.5rem;
            margin-bottom: 1rem;
            font-size: 1.5rem;
            font-weight: 600;
        }

        .section-content {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .section-content strong {
            color: var(--text-primary);
            font-weight: 700;
        }

        .section-content ul,
        .section-content ol {
            padding-left: 2rem;
            margin-bottom: 1rem;
        }

        .section-content ul li,
        .section-content ol li {
            margin-bottom: 0.5rem;
            line-height: 1.5;
        }

        .section-content ul li::marker {
            color: var(--accent-color);
        }

        .section-content ol li::marker {
            color: var(--text-secondary);
            font-weight: bold;
        }

        @media screen and (max-width: 768px) {
            .agreement-container {
                margin: 1rem;
                border-radius: 8px;
            }

            .section {
                padding: 1rem;
            }

            .agreement-container h1 {
                font-size: 1.5rem;
                padding: 1rem;
            }
        }

        .agreement-container {
            scroll-behavior: smooth;
        }

        .agreement-container ::selection {
            background-color: var(--accent-color);
            color: white;
        }
        </style>`;

        const htmlContent = `
          ${agreementCSS}
          <div class="agreement-container">
            <h1>${template.name}</h1>
            <p>Version: ${template.version}</p>
            <p>Jurisdiction: ${template.metadata.jurisdiction}</p>

            ${generatedSections.map(section => `
              <div class="section" data-section-id="${section.id}">
                <h2>${section.title}</h2>
                <div class="section-content">
                  ${section.content}
                </div>
              </div>
            `).join('')}
          </div>
        `;

        return {
            id: template.id,
            name: template.name,
            version: template.version,
            html: htmlContent,
            sections: generatedSections,
        }
    }
}
