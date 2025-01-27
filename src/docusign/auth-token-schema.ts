import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as CryptoJS from 'crypto-js';

// First, let's create an interface to represent the document
export interface IAuthToken extends Document {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

@Schema({
  timestamps: true,
  // This is crucial - tell Mongoose to apply getters when converting to JSON/objects
  toJSON: { getters: true },
  toObject: { getters: true },
})
export class AuthToken extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({
    required: true,
    // We'll keep the encryption in the setter
    set: function (token: string) {
      // Store the original token in a temporary field for comparison
      this._accessToken = token;
      return encryptToken(token);
    },
    // Improve the getter to handle the encrypted token
    get: function (encryptedToken: string) {
      if (!encryptedToken) return encryptedToken;
      try {
        return decryptToken(encryptedToken);
      } catch (error) {
        console.error('Error decrypting access token:', error);
        // Return the encrypted version if decryption fails
        return encryptedToken;
      }
    },
  })
  accessToken: string;

  @Prop({
    required: true,
    set: function (token: string) {
      this._refreshToken = token;
      return encryptToken(token);
    },
    get: function (encryptedToken: string) {
      if (!encryptedToken) return encryptedToken;
      try {
        return decryptToken(encryptedToken);
      } catch (error) {
        console.error('Error decrypting refresh token:', error);
        return encryptedToken;
      }
    },
  })
  refreshToken: string;

  @Prop({ required: true })
  expiresAt: Date;
}

// Improve encryption key handling
function getEncryptionKey(): string {
  const key = process.env.TOKEN_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('TOKEN_ENCRYPTION_KEY environment variable is not defined');
  }
  return key;
}

// Enhanced encryption function with better error handling
export function encryptToken(token: string): string {
  if (!token) return token;
  try {
    const key = getEncryptionKey();
    return CryptoJS.AES.encrypt(token, key).toString();
  } catch (error) {
    console.error('Token encryption failed:', error);
    throw new Error('Failed to encrypt token');
  }
}

// Enhanced decryption function with better error handling
export function decryptToken(encryptedToken: string): string {
  if (!encryptedToken) return encryptedToken;
  try {
    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(encryptedToken, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error('Decryption resulted in empty string');
    }
    return decrypted;
  } catch (error) {
    console.error('Token decryption failed:', error);
    throw new Error('Failed to decrypt token');
  }
}

export const AuthTokenSchema = SchemaFactory.createForClass(AuthToken);

// Add this middleware to ensure proper handling of the document
AuthTokenSchema.pre('save', function (next) {
  // Any pre-save validation or transformation can go here
  next();
});
