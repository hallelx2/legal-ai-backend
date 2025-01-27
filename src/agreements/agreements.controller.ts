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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { DocusignService } from 'src/docusign/docusign.service';

@ApiTags('Agreements')
@ApiBearerAuth() // Add this if you're using JWT tokens
@Controller('agreements')
export class AgreementsController {
  constructor(
    private readonly agreementsService: AgreementsService,
    private readonly docusignService: DocusignService,
  ) {}

  @Post('generate')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Generate a new agreement',
    description:
      'Creates a new agreement based on the provided template and variables.',
  })
  @ApiBody({
    type: AgreementGenerationDto,
    description:
      'Agreement generation data including template ID and section variables',
    examples: {
      example1: {
        value: {
          userId: 'user123',
          templateId: 'template456',
          sections: [
            {
              sectionId: 'section1',
              variables: [{ id: 'var1', value: 'Value 1' }],
            },
          ],
          signatureLocations: [
            {
              x: 100,
              y: 200,
              role: 'Signer',
              email: 'signer@example.com',
              required: true,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Agreement successfully generated',
    schema: {
      example: {
        id: 'agreement123',
        name: 'Sample Agreement',
        sections: [],
        status: 'generated',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateAgreement(@Body() dto: AgreementGenerationDto) {
    return this.agreementsService.generateAgreement(dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Retrieve all agreements',
    description: 'Gets a list of all agreements with optional filtering.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter agreements by status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of agreements retrieved successfully',
    schema: {
      type: 'array',
      items: {
        example: {
          id: 'agreement123',
          name: 'Sample Agreement',
          status: 'generated',
        },
      },
    },
  })
  async findAll(@Query() query?) {
    return this.agreementsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Retrieve a specific agreement by ID',
    description: 'Gets the full details of a specific agreement.',
  })
  @ApiParam({
    name: 'id',
    description: 'Agreement ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Agreement found',
    schema: {
      example: {
        id: 'agreement123',
        name: 'Sample Agreement',
        sections: [],
        status: 'generated',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Agreement not found' })
  async findById(@Param('id') id: string) {
    return this.agreementsService.findById(id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Retrieve all agreements for a user',
    description: 'Gets all agreements associated with a specific user ID.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID to fetch agreements for',
  })
  @ApiResponse({
    status: 200,
    description: "List of user's agreements retrieved successfully",
  })
  async findByUserId(@Param('userId') userId: string) {
    return this.agreementsService.findAgreementByUserId(userId);
  }

  @Put(':id/status')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Update agreement status',
    description: 'Updates the status of an existing agreement.',
  })
  @ApiParam({
    name: 'id',
    description: 'Agreement ID',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'signed',
          description: 'New status for the agreement',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Agreement status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Agreement not found' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.agreementsService.updateAgreementStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Delete an agreement',
    description: 'Permanently removes an agreement from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Agreement ID to delete',
  })
  @ApiResponse({ status: 200, description: 'Agreement successfully deleted' })
  @ApiResponse({ status: 404, description: 'Agreement not found' })
  async deleteAgreement(@Param('id') id: string) {
    return this.agreementsService.deleteAgreement(id);
  }

  @Post(':agreementId/sign')
  // @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Send agreement for DocuSign signature',
    description:
      'Sends an existing agreement to DocuSign for electronic signature.',
  })
  @ApiParam({
    name: 'agreementId',
    description: 'Agreement ID to send for signature',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'ID of the user initiating the signature request',
        },
      },
      required: ['userId'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Agreement sent for signature successfully',
    schema: {
      example: {
        agreementId: 'agreement123',
        envelopeId: 'envelope456',
        status: 'sent',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request or DocuSign error',
  })
  @ApiResponse({ status: 404, description: 'Agreement not found' })
  async sendForSignature(
    @Param('agreementId') agreementId: string,
    @Body('userId') userId: string,
  ) {
    return this.docusignService.sendAgreementForSignature(userId, agreementId);
  }
}
