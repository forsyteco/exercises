import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RiskAssessmentFlagService } from '@/modules/risk-assessment-flag/application/risk-assessment-flag.service';
import { RiskAssessmentFlagDto } from '@/modules/risk-assessment-flag/presenters/http/dto/risk-assessment-flag.dto';

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
}
