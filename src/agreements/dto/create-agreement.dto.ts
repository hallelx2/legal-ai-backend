import { Type } from "class-transformer";
import { IsString, IsArray, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VariableGenerationDto {
    @ApiProperty({
      description: "The ID of the variable.",
      example: "variable789",
    })
    @IsString()
    id: string;

    @ApiProperty({
      description: "The value assigned to the variable.",
      example: "This is a sample value.",
    })
    @IsString()
    value: string;
  }

export class SectionGenerationDto {
    @ApiProperty({
      description: "The ID of the section to include in the agreement.",
      example: "section456",
    })
    @IsString()
    sectionId: string;

    @ApiProperty({
      description: "Array of variables specific to this section.",
      type: [VariableGenerationDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VariableGenerationDto)
    variables: VariableGenerationDto[];
  }




export class AgreementGenerationDto {
  @ApiProperty({
    description: "The ID of the template to use for generating the agreement.",
    example: "template123",
  })
  @IsString()
  templateId: string;

  @ApiProperty({
    description: "Array of sections to include in the agreement, with their respective variables.",
    type: [SectionGenerationDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionGenerationDto)
  sections: SectionGenerationDto[];
}
