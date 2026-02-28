import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { MatterService } from '@/modules/matter/application/matter.service';
import { MatterDto } from '@/modules/matter/presenters/http/dto/matter.dto';
import {
  CreateMatterFormDto,
  UpdateMatterFormDto,
} from '@/modules/matter/presenters/http/dto/matter.form.dto';

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

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create a matter' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiBody({ type: CreateMatterFormDto })
  @ApiResponse({ status: 201, type: MatterDto })
  async create(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Body() dto: CreateMatterFormDto,
  ): Promise<MatterDto> {
    return this.matterService.create(organisationIdOrSlug, dto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Update a matter' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateMatterFormDto })
  @ApiResponse({ status: 200, type: MatterDto })
  @ApiResponse({ status: 404, description: 'Matter not found' })
  async update(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('id') id: string,
    @Body() dto: UpdateMatterFormDto,
  ): Promise<MatterDto> {
    return this.matterService.update(id, organisationIdOrSlug, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a matter' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Matter not found' })
  async delete(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.matterService.delete(id, organisationIdOrSlug);
  }
}
