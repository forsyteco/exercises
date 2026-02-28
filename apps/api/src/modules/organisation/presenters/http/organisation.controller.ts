import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrganisationService } from '@/modules/organisation/application/organisation.service';
import { OrganisationDto } from '@/modules/organisation/presenters/http/dto/organisation.dto';

@ApiTags('organisations')
@ApiBearerAuth()
@Controller('organisations')
export class OrganisationController {
  constructor(private readonly organisationService: OrganisationService) {}

  @Get()
  @ApiOperation({ summary: 'List all organisations' })
  @ApiResponse({ status: 200, type: OrganisationDto, isArray: true })
  async list(): Promise<OrganisationDto[]> {
    return this.organisationService.list();
  }

  @Get(':organisationIdOrSlug')
  @ApiOperation({ summary: 'Get organisation by ID or slug' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiResponse({ status: 200, type: OrganisationDto })
  @ApiResponse({ status: 404, description: 'Organisation not found' })
  async findByIdOrSlug(@Param('organisationIdOrSlug') organisationIdOrSlug: string): Promise<OrganisationDto> {
    return this.organisationService.findByIdOrSlug(organisationIdOrSlug);
  }
}
