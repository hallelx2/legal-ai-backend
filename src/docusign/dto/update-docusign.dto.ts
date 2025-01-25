import { PartialType } from '@nestjs/swagger';
import { CreateDocusignDto } from './create-docusign.dto';

export class UpdateDocusignDto extends PartialType(CreateDocusignDto) {}
