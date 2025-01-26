import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UsePipes,
    ValidationPipe,
    UseGuards,
  } from '@nestjs/common';
  import { AgreementsService } from './agreements.service';
  import { AgreementGenerationDto } from './dto/create-agreement.dto';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guards';

  @ApiTags('Agreements')
  @Controller('agreements')
  export class AgreementsController {
    constructor(private readonly agreementsService: AgreementsService) {}

    @Post('generate')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Generate a new agreement' })
    @ApiResponse({ status: 201, description: 'Agreement successfully generated' })
    async generateAgreement(@Body() dto: AgreementGenerationDto) {
      return this.agreementsService.generateAgreement(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Retrieve all agreements' })
    async findAll(@Query() query?) {
      return this.agreementsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retrieve a specific agreement by ID' })
    async findById(@Param('id') id: string) {
      return this.agreementsService.findById(id);
    }

    @Put(':id/status')
    @ApiOperation({ summary: 'Update agreement status' })
    async updateStatus(
      @Param('id') id: string,
      @Body('status') status: string
    ) {
      return this.agreementsService.updateAgreementStatus(id, status);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an agreement' })
    async deleteAgreement(@Param('id') id: string) {
      return this.agreementsService.deleteAgreement(id);
    }
  }
