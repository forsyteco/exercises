import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RiskAssessmentFlagRepositoryPort } from '@/modules/risk-assessment-flag/application/ports/risk-assessment-flag.repository.port';
import { RiskAssessmentFlag } from '@/modules/risk-assessment-flag/domain/risk-assessment-flag';
import { RiskAssessmentFlagDto } from '@/modules/risk-assessment-flag/presenters/http/dto/risk-assessment-flag.dto';
import { CreateRiskAssessmentFlagFormDto } from '@/modules/risk-assessment-flag/presenters/http/dto/risk-assessment-flag.form.dto';
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

  async create(
    organisationIdOrSlug: string,
    dto: CreateRiskAssessmentFlagFormDto,
  ): Promise<RiskAssessmentFlagDto> {
    const organisationId = await this.riskAssessmentFlagRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    try {
      const flag = await this.riskAssessmentFlagRepo.create({
        organisationId,
        riskAssessmentId: dto.riskAssessmentId ?? null,
        name: dto.name ?? null,
        description: dto.description ?? null,
      });
      return this.toRiskAssessmentFlagDto(flag);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
        throw new ConflictException('A risk assessment flag with this identifier already exists.');
      }
      throw error;
    }
  }

  async update(
    id: string,
    organisationIdOrSlug: string,
    dto: {
      riskAssessmentId?: string | null;
      name?: string | null;
      description?: string | null;
      status?: RiskAssessmentFlagStatus;
      acceptedAt?: Date | null;
      acceptedById?: string | null;
    },
  ): Promise<RiskAssessmentFlagDto> {
    const organisationId = await this.riskAssessmentFlagRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const existing = await this.ensureRiskAssessmentFlag(id);
    if (existing.organisationId !== organisationId) {
      throw new NotFoundException('Risk assessment flag not found');
    }
    try {
      const updated = await this.riskAssessmentFlagRepo.update(id, {
        riskAssessmentId: dto.riskAssessmentId,
        name: dto.name,
        description: dto.description,
        status: dto.status,
        acceptedAt: dto.acceptedAt,
        acceptedById: dto.acceptedById,
      });
      return this.toRiskAssessmentFlagDto(updated);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
        throw new ConflictException('Conflict updating risk assessment flag.');
      }
      throw error;
    }
  }

  async delete(id: string, organisationIdOrSlug: string): Promise<void> {
    const organisationId = await this.riskAssessmentFlagRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const existing = await this.ensureRiskAssessmentFlag(id);
    if (existing.organisationId !== organisationId) {
      throw new NotFoundException('Risk assessment flag not found');
    }
    await this.riskAssessmentFlagRepo.delete(id);
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
