import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RiskAssessmentRepositoryPort } from '@/modules/risk-assessment/application/ports/risk-assessment.repository.port';
import { RiskAssessment } from '@/modules/risk-assessment/domain/risk-assessment';
import { RiskAssessmentDto } from '@/modules/risk-assessment/presenters/http/dto/risk-assessment.dto';
import { RiskAssessmentStatus } from '@/common/enums/risk-assessment-status.enum';
import { RiskLevel } from '@/common/enums/risk-level.enum';

@Injectable()
export class RiskAssessmentService {
  constructor(private readonly riskAssessmentRepo: RiskAssessmentRepositoryPort) {}

  async list(organisationIdOrSlug: string): Promise<RiskAssessmentDto[]> {
    const list =
      await this.riskAssessmentRepo.findManyByOrganisationIdOrSlugWithClientAndMatter(organisationIdOrSlug);
    return list.map(({ riskAssessment, clientName, matterDescription }) =>
      this.toRiskAssessmentDto(riskAssessment, { clientName, matterDescription }),
    );
  }

  async getById(id: string, organisationIdOrSlug: string): Promise<RiskAssessmentDto> {
    const organisationId = await this.riskAssessmentRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const withContext = await this.riskAssessmentRepo.findByIdWithClientAndMatter(id);
    if (!withContext || withContext.riskAssessment.organisationId !== organisationId) {
      throw new NotFoundException('Risk assessment not found');
    }
    return this.toRiskAssessmentDto(withContext.riskAssessment, {
      clientName: withContext.clientName,
      matterDescription: withContext.matterDescription,
    });
  }

  private async ensureRiskAssessment(id: string): Promise<RiskAssessment> {
    const riskAssessment = await this.riskAssessmentRepo.findById(id);
    if (!riskAssessment) {
      throw new NotFoundException('Risk assessment not found');
    }
    return riskAssessment;
  }

  /** Format virtual description: matter description + " for " + client name */
  private formatDescription(matterDescription: string, clientName: string): string {
    return `${matterDescription} for ${clientName}`;
  }

  private toRiskAssessmentDto(
    r: RiskAssessment,
    context?: { clientName: string; matterDescription: string },
  ): RiskAssessmentDto {
    const description =
      context != null ? this.formatDescription(context.matterDescription, context.clientName) : undefined;
    return plainToInstance(
      RiskAssessmentDto,
      {
        id: r.id,
        organisationId: r.organisationId,
        clientId: r.clientId,
        matterId: r.matterId,
        status: r.status as RiskAssessmentStatus,
        version: r.version,
        ownerId: r.ownerId,
        assignedToId: r.assignedToId,
        riskLevel: (r.riskLevel as RiskLevel | null) ?? null,
        description,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      },
      { excludeExtraneousValues: true },
    );
  }
}
