import {
    Controller,
    Post,
    Body,
    Req,
    UsePipes,
    ValidationPipe,
  } from '@nestjs/common';
  import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
  import { AgreementsService } from './agreements.service';
  import { AgreementGenerationDto } from './dto/create-agreement.dto';

  @ApiTags('Agreements') // Tags the endpoint for grouping in Swagger
  @Controller('agreements')
  export class AgreementsController {
    constructor(private readonly agreementsService: AgreementsService) {}

    @Post('generate')
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({
      summary: 'Generate a new agreement',
      description: 'This endpoint generates a new agreement based on the provided data.',
    })
    @ApiBody({
      type: AgreementGenerationDto,
      description: 'The data required to generate an agreement.',
    })
    @ApiResponse({
      status: 201,
      description: 'The agreement was successfully generated.',
    })
    @ApiResponse({
      status: 400,
      description: 'Invalid input data. Validation failed.',
    })
    @ApiResponse({
      status: 500,
      description: 'Internal server error.',
    })
    async generateAgreement(
      @Body() generateDto: AgreementGenerationDto,
      @Req() req,
    ) {
      return this.agreementsService.generateAgreement(generateDto);
    }
  }
