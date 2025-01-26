import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

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

  async generateSectionContentOpenai(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are a legal document assistant helping to generate precise legal sections.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });
    return response.choices[0].message.content;
  }

  async generateSectionContentGemini(prompt: string): Promise<string> {
    const model = this.gemini.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction:
        'You are a legal document assistant helping to generate precise legal sections.',
    });
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
      },
    });
    return result.response.text();
  }
}
