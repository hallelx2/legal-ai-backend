import { PartialType } from '@nestjs/swagger';
import { AgreementGenerationDto } from './create-agreement.dto';

export class UpdateAgreementDto extends PartialType(AgreementGenerationDto) {}
