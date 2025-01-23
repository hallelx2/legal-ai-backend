import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TemplateCategory } from '../template.enum';
import {
  TemplateSection,
  SignatureLocation,
  TemplateVariable,
} from 'src/agreements/schemas/agreement-templates.types.ts';
import { ApiProperty } from '@nestjs/swagger';

// DTO for Creating Custom Template
export class CreateCustomTemplateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  baseTemplateId?: string;

  @ApiProperty()
  @IsEnum(TemplateCategory)
  @IsOptional()
  category?: TemplateCategory;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  customSections?: TemplateSection[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  defaultSignatureLocations?: SignatureLocation[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  industry?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  jurisdiction?: string;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  allowedSections?: string[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  requiredSections?: string[];

  @ApiProperty()
  @IsOptional()
  variableOverrides?: Record<string, Partial<TemplateVariable>>;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  additionalSections?: TemplateSection[];
}

// DTO for Searching Templates
export class TemplateSearchQuery {
  @ApiProperty()
  @IsEnum(TemplateCategory)
  @IsOptional()
  category?: TemplateCategory;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: 'draft' | 'published' | 'archived';

  @ApiProperty()
  @IsString()
  @IsOptional()
  searchText?: string;

  @ApiProperty()
  @IsOptional()
  limit?: number;

  @ApiProperty()
  @IsOptional()
  offset?: number;
}
