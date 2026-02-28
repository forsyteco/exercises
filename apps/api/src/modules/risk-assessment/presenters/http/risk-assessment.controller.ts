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
import { RiskAssessmentService } from '@/modules/risk-assessment/application/risk-assessment.service';
import { RiskAssessmentDto } from '@/modules/risk-assessment/presenters/http/dto/risk-assessment.dto';
import {
  CreateRiskAssessmentFormDto,
  UpdateRiskAssessmentFormDto,
} from '@/modules/risk-assessment/presenters/http/dto/risk-assessment.form.dto';

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

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create a risk assessment' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiBody({ type: CreateRiskAssessmentFormDto })
  @ApiResponse({ status: 201, type: RiskAssessmentDto })
  async create(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Body() dto: CreateRiskAssessmentFormDto,
  ): Promise<RiskAssessmentDto> {
    return this.riskAssessmentService.create(organisationIdOrSlug, dto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Update a risk assessment' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateRiskAssessmentFormDto })
  @ApiResponse({ status: 200, type: RiskAssessmentDto })
  @ApiResponse({ status: 404, description: 'Risk assessment not found' })
  async update(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('id') id: string,
    @Body() dto: UpdateRiskAssessmentFormDto,
  ): Promise<RiskAssessmentDto> {
    return this.riskAssessmentService.update(id, organisationIdOrSlug, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a risk assessment' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Risk assessment not found' })
  async delete(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.riskAssessmentService.delete(id, organisationIdOrSlug);
  }
}
