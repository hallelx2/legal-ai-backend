import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocusignService } from './docusign.service';
import { AuthToken, AuthTokenSchema } from './auth-token-schema';
import { DocusignController } from './docusign.controller';
import { AgreementsService } from 'src/agreements/agreements.service';
import { Agreement, AgreementSchema } from 'src/agreements/schemas/agreement.schemas';
import { AiGeneratorService } from 'src/ai-generator/ai-generator.service';
import { TemplatesService } from 'src/templates/templates.service';
import { OpenaiService } from 'src/openai/openai.service';
import { TemplateBase, TemplateBaseSchema } from 'src/templates/template-base.schema';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuthToken.name, schema: AuthTokenSchema },
    ]),
     MongooseModule.forFeature([
          { name: Agreement.name, schema: AgreementSchema },
        ]),
     MongooseModule.forFeature([
          { name: TemplateBase.name, schema: TemplateBaseSchema },
        ]),
  ],
  controllers: [DocusignController],
  providers: [DocusignService, AgreementsService, AiGeneratorService, TemplatesService, OpenaiService, ConfigService],
  exports: [DocusignService],
})
export class DocusignModule {}
