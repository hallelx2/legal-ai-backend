import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AgreementDocument = Agreement & Document;

@Schema({ timestamps: true })
export class Agreement {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  templateId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  version: string;

  @Prop({ type: Object })
  metadata: {
    jurisdiction?: string;
    status?: 'draft' | 'generated' | 'sent' | 'signed';
  };

  @Prop({ type: [Object] })
  sections: Array<{
    id: string;
    title: string;
    content: string;
    variables: Array<{ id: string; value: string }>;
  }>;

  @Prop({ type: [Object] })
  signatureLocations: Array<{
    role: string;
    email: string;
    page: number;
    x: number;
    y: number;
    required: boolean;
    status: 'pending' | 'signed' | 'rejected';
    signedAt?: Date;
  }>;

  @Prop({ required: true })
  htmlContent: string;
}

export const AgreementSchema = SchemaFactory.createForClass(Agreement);
