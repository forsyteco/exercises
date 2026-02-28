import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { MatterService } from '@/modules/matter/application/matter.service';
import { MatterDto } from '@/modules/matter/presenters/http/dto/matter.dto';

@ApiTags('matters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(':organisationIdOrSlug/matters')
export class MatterController {
  constructor(private readonly matterService: MatterService) {}

  @Get()
  @ApiOperation({ summary: 'List matters for the organisation' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiResponse({ status: 200, type: MatterDto, isArray: true })
  async list(@Param('organisationIdOrSlug') organisationIdOrSlug: string): Promise<MatterDto[]> {
    return this.matterService.list(organisationIdOrSlug);
  }

  @Get('by-client/:clientId')
  @ApiOperation({ summary: 'List matters for a given client' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'clientId', type: String })
  @ApiResponse({ status: 200, type: MatterDto, isArray: true })
  async listByClient(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('clientId') clientId: string,
  ): Promise<MatterDto[]> {
    return this.matterService.listByClientId(organisationIdOrSlug, clientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a matter by id' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: MatterDto })
  @ApiResponse({ status: 404, description: 'Matter not found' })
  async getById(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('id') id: string,
  ): Promise<MatterDto> {
    return this.matterService.getById(id, organisationIdOrSlug);
  }
}
