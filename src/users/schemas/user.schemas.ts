import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  tokenVersion: number;

  @Prop({ default: () => Date.now() })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
