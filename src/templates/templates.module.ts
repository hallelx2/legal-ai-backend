import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { TemplateBase, TemplateBaseSchema } from './template-base.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TemplateBase.name, schema: TemplateBaseSchema },
    ]),
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService, ConfigService],
})
export class TemplatesModule {}
