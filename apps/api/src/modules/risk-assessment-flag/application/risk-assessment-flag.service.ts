import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RiskAssessmentFlagRepositoryPort } from '@/modules/risk-assessment-flag/application/ports/risk-assessment-flag.repository.port';
import { RiskAssessmentFlag } from '@/modules/risk-assessment-flag/domain/risk-assessment-flag';
import { RiskAssessmentFlagDto } from '@/modules/risk-assessment-flag/presenters/http/dto/risk-assessment-flag.dto';
import { RiskAssessmentFlagStatus } from '@/common/enums/risk-assessment-flag-status.enum';

@Injectable()
export class RiskAssessmentFlagService {
  constructor(private readonly riskAssessmentFlagRepo: RiskAssessmentFlagRepositoryPort) {}

  async list(organisationIdOrSlug: string): Promise<RiskAssessmentFlagDto[]> {
    const list = await this.riskAssessmentFlagRepo.findManyByOrganisationIdOrSlug(organisationIdOrSlug);
    return list.map((f) => this.toRiskAssessmentFlagDto(f));
  }

  async listByRiskAssessmentId(
    organisationIdOrSlug: string,
    riskAssessmentId: string,
  ): Promise<RiskAssessmentFlagDto[]> {
    const organisationId = await this.riskAssessmentFlagRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const list = await this.riskAssessmentFlagRepo.findManyByRiskAssessmentId(riskAssessmentId);
    return list
      .filter((f) => f.organisationId === organisationId)
      .map((f) => this.toRiskAssessmentFlagDto(f));
  }

  async getById(id: string, organisationIdOrSlug: string): Promise<RiskAssessmentFlagDto> {
    const organisationId = await this.riskAssessmentFlagRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const flag = await this.ensureRiskAssessmentFlag(id);
    if (flag.organisationId !== organisationId) {
      throw new NotFoundException('Risk assessment flag not found');
    }
    return this.toRiskAssessmentFlagDto(flag);
  }

  private async ensureRiskAssessmentFlag(id: string): Promise<RiskAssessmentFlag> {
    const flag = await this.riskAssessmentFlagRepo.findById(id);
    if (!flag) {
      throw new NotFoundException('Risk assessment flag not found');
    }
    return flag;
  }

  private toRiskAssessmentFlagDto(f: RiskAssessmentFlag): RiskAssessmentFlagDto {
    return plainToInstance(
      RiskAssessmentFlagDto,
      {
        id: f.id,
        organisationId: f.organisationId,
        riskAssessmentId: f.riskAssessmentId,
        name: f.name,
        description: f.description,
        status: f.status as RiskAssessmentFlagStatus,
        acceptedAt: f.acceptedAt,
        acceptedById: f.acceptedById,
        createdAt: f.createdAt,
        updatedAt: f.updatedAt,
      },
      { excludeExtraneousValues: true },
    );
  }
}
