import {
    IsString,
    IsNumber,
    IsBoolean,
    ValidateNested,
    IsArray,
    IsEmail,
    IsOptional,
    IsIn
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

  /**
   * Represents a signature location within an agreement
   * Defines where and how a specific party should sign the document
   */
  export class SignatureLocationDto {
    @ApiProperty({
      description: 'Role of the signatory in the agreement',
      example: 'Disclosing Party',
    })
    @IsString()
    role: string;

    @ApiProperty({
      description: 'Email address of the signatory',
      example: 'johndoe@company.com',
    })
    @IsEmail()
    email: string;

    @ApiPropertyOptional({
      description: 'Page location for the signature',
      enum: ['first', 'last'],
      default: 'last',
    })
    @IsOptional()
    @IsIn(['first', 'last'])
    page?: string;

    @ApiProperty({
      description: 'Horizontal position (x-coordinate) of the signature line',
      example: 100,
    })
    @IsNumber()
    @Type(() => Number)
    x: number;

    @ApiProperty({
      description: 'Vertical position (y-coordinate) of the signature line',
      example: 500,
    })
    @IsNumber()
    @Type(() => Number)
    y: number;

    @ApiProperty({
      description: 'Indicates whether the signature is mandatory',
      default: false,
    })
    @IsBoolean()
    required: boolean;
  }

  /**
   * Represents a variable within a document section
   * Allows dynamic content insertion into agreement templates
   */
  export class SectionVariableDto {
    @ApiProperty({
      description: 'Unique identifier for the variable',
      example: 'company_name',
    })
    @IsString()
    id: string;

    @ApiPropertyOptional({
      description: 'Value to be inserted for the variable',
      example: 'Acme Corporation',
    })
    @IsString()
    @IsOptional()
    value?: string;
  }

  /**
   * Represents a section of the agreement with its associated variables
   * Allows granular control over different parts of the document
   */
  export class SectionDto {
    @ApiProperty({
      description: 'Unique identifier for the section',
      example: 'parties_section',
    })
    @IsString()
    sectionId: string;

    @ApiProperty({
      description: 'Array of variables specific to this section',
      type: [SectionVariableDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SectionVariableDto)
    variables: SectionVariableDto[];
  }

  /**
   * Primary DTO for generating an agreement
   * Combines template selection, section definitions, and signature requirements
   */
  export class AgreementGenerationDto {
    @ApiProperty({
      description: 'Unique identifier of the template to be used',
      example: 'nda-template-v1',
    })
    @IsString()
    templateId: string;

    @ApiProperty({
      description: 'Sections of the agreement with their specific variables',
      type: [SectionDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SectionDto)
    sections: SectionDto[];

    @ApiProperty({
      description: 'Locations and requirements for signatures',
      type: [SignatureLocationDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SignatureLocationDto)
    signatureLocations: SignatureLocationDto[];
  }
