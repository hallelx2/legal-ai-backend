import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { TemplateCategory } from './template.enum';
import {
  CreateCustomTemplateDto,
  TemplateSearchQuery,
} from './dto/create-template.dto';
import { User } from 'src/users/schemas/user.schemas';
import { CurrentUser } from 'src/users/decorators/user.decorators';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { TemplateVersionChangesDto } from './dto/update-template.dto';

@ApiTags('Templates')
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get('categories/:category')
  @ApiOperation({ summary: 'Get templates by category' })
  @ApiParam({
    name: 'category',
    enum: TemplateCategory,
    description: 'Category of templates to retrieve',
  })
  @ApiResponse({
    status: 200,
    description: 'List of templates in the specified category',
  })
  async getTemplatesByCategory(@Param('category') category: TemplateCategory) {
    return await this.templatesService.getTemplateByCategory(category);
  }

  @Post('custom')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a custom template' })
  @ApiBody({
    type: CreateCustomTemplateDto,
    description: 'Details of the custom template to create',
  })
  @ApiResponse({
    status: 201,
    description: 'Custom template successfully created',
  })
  async createCustomTemplate(
    @Body() data: CreateCustomTemplateDto,
    @CurrentUser() user: User,
  ) {
    return await this.templatesService.createCustomTemplate(data, user.id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search templates' })
  @ApiQuery({
    type: TemplateSearchQuery,
    description: 'Search parameters for templates',
  })
  @ApiResponse({
    status: 200,
    description: 'List of templates matching search criteria',
  })
  async searchTemplates(@Query() query: TemplateSearchQuery) {
    return await this.templatesService.searchTemplates(query);
  }

  @Post(':id/version')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new template version' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID of the template to create a new version for',
  })
  @ApiBody({
    type: TemplateVersionChangesDto,
    description: 'Changes for the new template version',
  })
  @ApiResponse({
    status: 201,
    description: 'New template version successfully created',
  })
  async createTemplateVersion(
    @Param('id') id: string,
    @Body() changes: TemplateVersionChangesDto,
    @CurrentUser() user: User,
  ) {
    changes.userId = user.id;
    return await this.templatesService.versionTemplate(id, changes);
  }

  @Get('predefined')
  @ApiOperation({ summary: 'Get all Predefined templates' })
  @ApiResponse({
    status: 200,
    description: 'List of all custom templates',
  })
  async getAllPredefinedTemplates() {
    return await this.templatesService.getPredefinedTemplates();
  }

  @Get('user/all')
  @ApiOperation({ summary: 'Get all templates for a user' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID of the user to retrieve templates for',
  })
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'List of all templates created by the user',
  })
  async getTemplatesByUser(@CurrentUser() user: User) {
    return await this.templatesService.getAllTemplatesForUser(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all templates created by a user' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'ID of the user to retrieve templates for',
  })
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'List of all templates created by the user',
  })
  async getCustomTemplatesByUser(@CurrentUser() user: User) {
    return await this.templatesService.getTemplatesForUser(user.id);
  }
}
