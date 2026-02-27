import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrganisationService } from '@/modules/organisation/application/organisation.service';
import { OrganisationDto } from '@/modules/organisation/presenters/http/dto/organisation.dto';
import { OrganisationFormDto } from '@/modules/organisation/presenters/http/dto/organisation-form.dto';

@ApiTags('organisations')
@Controller('organisations')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @Get()
  @ApiOperation({ summary: 'List all organisations' })
  @ApiResponse({ status: 200, type: OrganisationDto, isArray: true })
  async list(): Promise<OrganisationDto[]> {
    return this.organisationService.list();
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get organisation by ID or slug' })
  @ApiParam({ name: 'idOrSlug', type: String })
  @ApiResponse({ status: 200, type: OrganisationDto })
  @ApiResponse({ status: 404, description: 'Organisation not found' })
  async findByIdOrSlug(@Param('idOrSlug') idOrSlug: string): Promise<OrganisationDto> {
    return this.organisationService.findByIdOrSlug(idOrSlug);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create an organisation' })
  @ApiBody({ type: OrganisationFormDto })
  @ApiResponse({ status: 201, type: OrganisationDto })
  @ApiResponse({ status: 409, description: 'Slug already exists' })
  async create(@Body() dto: OrganisationFormDto): Promise<OrganisationDto> {
    return this.organisationService.create(dto);
  }
}
