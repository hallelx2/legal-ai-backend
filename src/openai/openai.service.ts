import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

interface LegalContext {
  jurisdiction?: string;
  documentType?: string;
  industry?: string;
  parties?: string[];
  specialRequirements?: string[];
}

interface PromptConfig {
  style?: 'formal' | 'plain-english';
  format?: 'structured' | 'narrative';
  length?: 'concise' | 'detailed';
}

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private gemini: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI(this.configService.get('OPENAI_API_KEY'));
    this.gemini = new GoogleGenerativeAI(
      this.configService.get('GOOGLE_API_KEY'),
    );
  }

  private buildSystemPrompt(context: LegalContext): string {
    return `You are an expert legal document assistant with deep knowledge of ${context.jurisdiction || 'various'} jurisdictions.
Your task is to generate precise, legally sound content with the following characteristics:

1. EXPERTISE: You have extensive experience in ${context.industry || 'various industries'} and ${context.documentType || 'legal documents'}.
2. ACCURACY: All content must be legally accurate and current with latest regulations.
3. CLARITY: Use clear, unambiguous language while maintaining legal precision.
4. CONSISTENCY: Maintain consistent terminology throughout the document.
5. COMPLIANCE: Ensure all content adheres to relevant legal standards and requirements.

Specific Context:
- Document Type: ${context.documentType || 'Not specified'}
- Jurisdiction: ${context.jurisdiction || 'Not specified'}
- Industry Context: ${context.industry || 'Not specified'}
${context.specialRequirements ? `- Special Requirements: ${context.specialRequirements.join(', ')}` : ''}

Please generate content that:
- Uses precise legal terminology
- Includes necessary legal disclaimers
- Maintains internal consistency
- Follows standard legal document structure
- Addresses all specified requirements`;
  }

  private buildPromptWithFormat(
    basePrompt: string,
    config: PromptConfig
  ): string {
    const styleGuide = config.style === 'plain-english'
      ? 'Use clear, plain English while maintaining legal accuracy.'
      : 'Use formal legal language and terminology.';

    const formatGuide = config.format === 'structured'
      ? 'Structure the content with clear sections, numbered paragraphs, and defined terms.'
      : 'Present the content in a flowing, narrative format.';

    const lengthGuide = config.length === 'concise'
      ? 'Be concise while including all necessary legal elements.'
      : 'Provide detailed explanations and comprehensive coverage.';

    return `${basePrompt}

FORMAT REQUIREMENTS:
${styleGuide}
${formatGuide}
${lengthGuide}

Please structure your response as follows:
1. Main legal provisions
2. Definitions (if needed)
3. Obligations and rights
4. Conditions and limitations
5. Additional relevant clauses`;
  }

  async generateSectionContentOpenai(
    prompt: string,
    context: LegalContext = {},
    config: PromptConfig = {}
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context);
    const formattedPrompt = this.buildPromptWithFormat(prompt, config);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: formattedPrompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent legal content
    });
    return response.choices[0].message.content;
  }

  async generateSectionContentGemini(
    prompt: string,
    context: LegalContext = {},
    config: PromptConfig = {}
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context);
    const formattedPrompt = this.buildPromptWithFormat(prompt, config);

    const model = this.gemini.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: formattedPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1, // Even lower temperature for Gemini to ensure consistency
      },
    });
    return result.response.text();
  }
}
