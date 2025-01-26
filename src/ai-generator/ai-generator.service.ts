import { Injectable } from '@nestjs/common';
import { TemplatesService } from 'src/templates/templates.service';
import { OpenaiService } from 'src/openai/openai.service';

@Injectable()
export class AiGeneratorService {
  constructor(
    private readonly templatesService: TemplatesService,
    private readonly openaiService: OpenaiService,
  ) {}

  async generateSectionContent(
    templateId: string,
    sectionId: string,
    variables: Record<string, string>,
  ): Promise<string> {
    const template = await this.templatesService.getTemplateById(templateId);
    const section = template.sections.find((s) => s.id === sectionId);

    if (!section || !section.aiPrompt) {
      throw new Error('Section not found or missing AI prompt');
    }

    const dynamicPrompt = this.constructDynamicPrompt(
      section.aiPrompt,
      variables,
    );
    console.log('Dynamic Prompt:', dynamicPrompt);
    return this.openaiService.generateSectionContentGemini(dynamicPrompt);
  }

  private constructDynamicPrompt(
    prompt: string,
    variables: Record<string, string>,
  ): string {
    let dynamicPrompt = prompt;
    console.log('Variables:', variables);
    for (const [key, value] of Object.entries(variables)) {
      dynamicPrompt =
        dynamicPrompt +
        `\n
            Here are the information you need for this section:
            ${key}: ${value}
            `;
    }
    console.log('Dynamic Prompt:', dynamicPrompt);
    return dynamicPrompt;
  }
}
