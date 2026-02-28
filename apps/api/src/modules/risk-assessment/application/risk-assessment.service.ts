import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RiskAssessmentRepositoryPort } from '@/modules/risk-assessment/application/ports/risk-assessment.repository.port';
import { RiskAssessment } from '@/modules/risk-assessment/domain/risk-assessment';
import { RiskAssessmentDto } from '@/modules/risk-assessment/presenters/http/dto/risk-assessment.dto';
import { CreateRiskAssessmentFormDto } from '@/modules/risk-assessment/presenters/http/dto/risk-assessment.form.dto';
import { RiskAssessmentStatus } from '@/common/enums/risk-assessment-status.enum';
import { RiskLevel } from '@/common/enums/risk-level.enum';

@Injectable()
export class RiskAssessmentService {
  constructor(private readonly riskAssessmentRepo: RiskAssessmentRepositoryPort) {}

  async list(organisationIdOrSlug: string): Promise<RiskAssessmentDto[]> {
    const list = await this.riskAssessmentRepo.findManyByOrganisationIdOrSlug(organisationIdOrSlug);
    return list.map((r) => this.toRiskAssessmentDto(r));
  }

  async getById(id: string, organisationIdOrSlug: string): Promise<RiskAssessmentDto> {
    const organisationId = await this.riskAssessmentRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const riskAssessment = await this.ensureRiskAssessment(id);
    if (riskAssessment.organisationId !== organisationId) {
      throw new NotFoundException('Risk assessment not found');
    }
    return this.toRiskAssessmentDto(riskAssessment);
  }

  async create(organisationIdOrSlug: string, dto: CreateRiskAssessmentFormDto): Promise<RiskAssessmentDto> {
    const organisationId = await this.riskAssessmentRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    try {
      const riskAssessment = await this.riskAssessmentRepo.create({
        organisationId,
        clientId: dto.clientId,
        matterId: dto.matterId,
        ownerId: dto.ownerId ?? null,
        assignedToId: dto.assignedToId ?? null,
        riskLevel: dto.riskLevel ?? null,
      });
      return this.toRiskAssessmentDto(riskAssessment);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
        throw new ConflictException('A risk assessment with this identifier already exists.');
      }
      throw error;
    }
  }

  async update(
    id: string,
    organisationIdOrSlug: string,
    dto: { status?: RiskAssessmentStatus; version?: number; ownerId?: string | null; assignedToId?: string | null; riskLevel?: RiskLevel | null },
  ): Promise<RiskAssessmentDto> {
    const organisationId = await this.riskAssessmentRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const existing = await this.ensureRiskAssessment(id);
    if (existing.organisationId !== organisationId) {
      throw new NotFoundException('Risk assessment not found');
    }
    try {
      const updated = await this.riskAssessmentRepo.update(id, {
        status: dto.status,
        version: dto.version,
        ownerId: dto.ownerId,
        assignedToId: dto.assignedToId,
        riskLevel: dto.riskLevel,
      });
      return this.toRiskAssessmentDto(updated);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
        throw new ConflictException('Conflict updating risk assessment.');
      }
      throw error;
    }
  }

  async delete(id: string, organisationIdOrSlug: string): Promise<void> {
    const organisationId = await this.riskAssessmentRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const existing = await this.ensureRiskAssessment(id);
    if (existing.organisationId !== organisationId) {
      throw new NotFoundException('Risk assessment not found');
    }
    await this.riskAssessmentRepo.delete(id);
  }

  private async ensureRiskAssessment(id: string): Promise<RiskAssessment> {
    const riskAssessment = await this.riskAssessmentRepo.findById(id);
    if (!riskAssessment) {
      throw new NotFoundException('Risk assessment not found');
    }
    return riskAssessment;
  }

  private toRiskAssessmentDto(r: RiskAssessment): RiskAssessmentDto {
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
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      },
      { excludeExtraneousValues: true },
    );
  }
}
