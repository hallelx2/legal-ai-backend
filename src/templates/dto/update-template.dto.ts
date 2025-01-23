import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TemplateVariable } from 'src/agreements/schemas/agreement-templates.types.ts';

// Enum for version change type
export enum VersionChangeType {
  MAJOR = 'major',
  MINOR = 'minor',
  PATCH = 'patch',
}

// DTO for individual section changes
export class SectionChangeDto {
  @IsString()
  sectionId: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  variables?: TemplateVariable[];

  @IsOptional()
  content?: any; // Flexible content type
}

// Main DTO for template versioning
export class TemplateVersionChangesDto {
  @IsEnum(VersionChangeType)
  type: VersionChangeType;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionChangeDto)
  sectionChanges?: SectionChangeDto[];

  // Optional: track who is making the changes
  @IsOptional()
  @IsString()
  userId?: string;
}
