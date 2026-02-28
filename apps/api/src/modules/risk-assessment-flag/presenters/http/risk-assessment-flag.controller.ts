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
import { RiskAssessmentFlagService } from '@/modules/risk-assessment-flag/application/risk-assessment-flag.service';
import { RiskAssessmentFlagDto } from '@/modules/risk-assessment-flag/presenters/http/dto/risk-assessment-flag.dto';
import {
  CreateRiskAssessmentFlagFormDto,
  UpdateRiskAssessmentFlagFormDto,
} from '@/modules/risk-assessment-flag/presenters/http/dto/risk-assessment-flag.form.dto';

@ApiTags('risk-assessment-flags')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(':organisationIdOrSlug/risk-assessment-flags')
export class RiskAssessmentFlagController {
  constructor(private readonly riskAssessmentFlagService: RiskAssessmentFlagService) {}

  @Get()
  @ApiOperation({ summary: 'List risk assessment flags for the organisation' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String, description: 'Organisation ID or slug' })
  @ApiResponse({ status: 200, type: RiskAssessmentFlagDto, isArray: true })
  async list(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
  ): Promise<RiskAssessmentFlagDto[]> {
    return this.riskAssessmentFlagService.list(organisationIdOrSlug);
  }

  @Get('by-risk-assessment/:riskAssessmentId')
  @ApiOperation({ summary: 'List flags for a given risk assessment' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'riskAssessmentId', type: String })
  @ApiResponse({ status: 200, type: RiskAssessmentFlagDto, isArray: true })
  async listByRiskAssessment(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('riskAssessmentId') riskAssessmentId: string,
  ): Promise<RiskAssessmentFlagDto[]> {
    return this.riskAssessmentFlagService.listByRiskAssessmentId(organisationIdOrSlug, riskAssessmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a risk assessment flag by id' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: RiskAssessmentFlagDto })
  @ApiResponse({ status: 404, description: 'Risk assessment flag not found' })
  async getById(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('id') id: string,
  ): Promise<RiskAssessmentFlagDto> {
    return this.riskAssessmentFlagService.getById(id, organisationIdOrSlug);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create a risk assessment flag' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiBody({ type: CreateRiskAssessmentFlagFormDto })
  @ApiResponse({ status: 201, type: RiskAssessmentFlagDto })
  async create(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Body() dto: CreateRiskAssessmentFlagFormDto,
  ): Promise<RiskAssessmentFlagDto> {
    return this.riskAssessmentFlagService.create(organisationIdOrSlug, dto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Update a risk assessment flag' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateRiskAssessmentFlagFormDto })
  @ApiResponse({ status: 200, type: RiskAssessmentFlagDto })
  @ApiResponse({ status: 404, description: 'Risk assessment flag not found' })
  async update(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('id') id: string,
    @Body() dto: UpdateRiskAssessmentFlagFormDto,
  ): Promise<RiskAssessmentFlagDto> {
    return this.riskAssessmentFlagService.update(id, organisationIdOrSlug, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a risk assessment flag' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Risk assessment flag not found' })
  async delete(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.riskAssessmentFlagService.delete(id, organisationIdOrSlug);
  }
}
