import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as CryptoJS from 'crypto-js';

@Schema({ timestamps: true })
export class AuthToken extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({
    required: true,
    set: (token: string) => encryptToken(token),
    get: (encryptedToken: string) => decryptToken(encryptedToken),
  })
  accessToken: string;

  @Prop({
    required: true,
    set: (token: string) => encryptToken(token),
    get: (encryptedToken: string) => decryptToken(encryptedToken),
  })
  refreshToken: string;

  @Prop({ required: true })
  expiresAt: Date;
}

function getEncryptionKey(): string {
  // Retrieve encryption key from environment variable
  const key = process.env.TOKEN_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('Encryption key is not defined');
  }
  return key;
}

export function encryptToken(token: string): string {
  try {
    const key = getEncryptionKey();
    return CryptoJS.AES.encrypt(token, key).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Token encryption failed');
  }
}

export function decryptToken(encryptedToken: string): string {
  try {
    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(encryptedToken, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Token decryption failed');
  }
}

export const AuthTokenSchema = SchemaFactory.createForClass(AuthToken);
