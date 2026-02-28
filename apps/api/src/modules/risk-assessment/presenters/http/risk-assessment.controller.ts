import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { RiskAssessmentService } from '@/modules/risk-assessment/application/risk-assessment.service';
import { RiskAssessmentDto } from '@/modules/risk-assessment/presenters/http/dto/risk-assessment.dto';

@ApiTags('risk-assessments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(':organisationIdOrSlug/risk-assessments')
export class RiskAssessmentController {
  constructor(private readonly riskAssessmentService: RiskAssessmentService) {}

  @Get()
  @ApiOperation({ summary: 'List risk assessments for the organisation' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String, description: 'Organisation ID or slug' })
  @ApiResponse({ status: 200, type: RiskAssessmentDto, isArray: true })
  async list(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
  ): Promise<RiskAssessmentDto[]> {
    return this.riskAssessmentService.list(organisationIdOrSlug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a risk assessment by id' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: RiskAssessmentDto })
  @ApiResponse({ status: 404, description: 'Risk assessment not found' })
  async getById(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('id') id: string,
  ): Promise<RiskAssessmentDto> {
    return this.riskAssessmentService.getById(id, organisationIdOrSlug);
  }
}
