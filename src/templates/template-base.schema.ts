import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  TemplateSection,
  SignatureLocation,
  TemplateVariable,
} from 'src/agreements/schemas/agreement-templates.types.ts';
import { TemplateCategory } from './template.enum';

@Schema({ timestamps: true })
export class TemplateBase extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  version: string;

  @Prop({ type: String, emum: TemplateCategory, required: true })
  category: TemplateCategory;

  @Prop({ type: [{ type: Object }], required: true })
  sections: TemplateSection[];

  @Prop({ type: [{ type: Object }], required: true })
  defaultSignatureLocations: SignatureLocation[];

  @Prop({ type: Object, required: true })
  metadata: {
    industry?: string;
    jurisdiction?: string;
    lastUpdated: Date;
    reviewedBy?: string;
    isCustom: boolean;
    parentTemplateId?: string;
    tags: string[];
    status: 'draft' | 'published' | 'archived';
  };

  @Prop({ type: Object })
  customization?: {
    allowedSections?: string[];
    requiredSections?: string[];
    variableOverrides?: Record<string, Partial<TemplateVariable>>;
    additionalSections?: TemplateSection[];
  };
}

export const TemplateBaseSchema = SchemaFactory.createForClass(TemplateBase);
