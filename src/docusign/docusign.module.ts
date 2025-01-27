import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocusignService } from './docusign.service';
import { AuthToken, AuthTokenSchema } from './auth-token-schema';
import { DocusignController } from './docusign.controller';
import { AgreementsService } from 'src/agreements/agreements.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuthToken.name, schema: AuthTokenSchema },
    ]),
  ],
  controllers: [DocusignController],
  providers: [DocusignService, AgreementsService],
  exports: [DocusignService],
})
export class DocusignModule {}
