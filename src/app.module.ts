import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';
import { AgreementsModule } from './agreements/agreements.module';
import { TemplatesModule } from './templates/templates.module';

import { AiGeneratorService } from './ai-generator/ai-generator.service';
import { OpenaiService } from './openai/openai.service';
import { DocusignModule } from './docusign/docusign.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        // Add these options for better stability
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    ContactModule,
    AgreementsModule,
    TemplatesModule,
    DocusignModule,
  ],
  controllers: [AppController],
  providers: [AppService, AiGeneratorService, OpenaiService],
})
export class AppModule {}
