import { Module } from '@nestjs/common';
import { AgreementsService } from './agreements.service';
import { AgreementsController } from './agreements.controller';
import { AiGeneratorService } from 'src/ai-generator/ai-generator.service';
import { TemplatesService } from 'src/templates/templates.service';
import { OpenaiService } from 'src/openai/openai.service';
import { ConfigModule } from '@nestjs/config';
import { TemplatesModule } from 'src/templates/templates.module';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import {
  TemplateBase,
  TemplateBaseSchema,
} from 'src/templates/template-base.schema';
import { Agreement, AgreementSchema } from './schemas/agreement.schemas';
import { JwtService } from '@nestjs/jwt';
import { DocusignService } from 'src/docusign/docusign.service';
import { AuthToken, AuthTokenSchema } from 'src/docusign/auth-token-schema';

@Module({
  imports: [
    // Import any modules that provide TemplateBaseModel
    TemplatesModule, // If TemplateBaseModel is defined in a separate module
    ConfigModule.forRoot(), // Ensure ConfigService is imported
    MongooseModule.forFeature([
      { name: TemplateBase.name, schema: TemplateBaseSchema },
    ]),
    MongooseModule.forFeature([
      { name: Agreement.name, schema: AgreementSchema },
    ]),
    MongooseModule.forFeature([
      { name: AuthToken.name, schema: AuthTokenSchema },
    ]),
  ],
  controllers: [AgreementsController],
  providers: [
    AgreementsService,
    AiGeneratorService,
    TemplatesService,
    OpenaiService,
    JwtService,
    DocusignService,
  ],
  exports: [TemplatesService],
})
export class AgreementsModule {}
