import { Injectable, Inject } from '@nestjs/common';
import { Prisma, RiskAssessmentFlagStatus } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { IdGenerator } from '@/utils/id-generator';
import {
  RiskAssessmentFlagRepositoryPort,
  CreateRiskAssessmentFlagData,
} from '@/modules/risk-assessment-flag/application/ports/risk-assessment-flag.repository.port';
import { RiskAssessmentFlag } from '@/modules/risk-assessment-flag/domain/risk-assessment-flag';
import { RiskAssessmentFlagMapper } from '@/modules/risk-assessment-flag/infrastructure/persistence/orm/mappers/risk-assessment-flag.mapper';

export const RISK_ASSESSMENT_FLAG_ID_GENERATOR = 'RISK_ASSESSMENT_FLAG_ID_GENERATOR';

@Injectable()
export class OrmRiskAssessmentFlagRepository extends RiskAssessmentFlagRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(RISK_ASSESSMENT_FLAG_ID_GENERATOR) private readonly idGenerator: IdGenerator,
  ) {
    super();
  }

  async findById(id: string): Promise<RiskAssessmentFlag | null> {
    const record = await this.prisma.riskAssessmentFlag.findUnique({ where: { id } });
    return record ? RiskAssessmentFlagMapper.toDomain(record) : null;
  }

  async findManyByOrganisationIdOrSlug(organisationIdOrSlug: string): Promise<RiskAssessmentFlag[]> {
    const org = await this.prisma.organisation.findFirst({
      where: {
        OR: [{ id: organisationIdOrSlug }, { slug: organisationIdOrSlug }],
      },
    });
    if (!org) return [];
    const records = await this.prisma.riskAssessmentFlag.findMany({
      where: { organisationId: org.id },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(RiskAssessmentFlagMapper.toDomain);
  }

  async findManyByRiskAssessmentId(riskAssessmentId: string): Promise<RiskAssessmentFlag[]> {
    const records = await this.prisma.riskAssessmentFlag.findMany({
      where: { riskAssessmentId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(RiskAssessmentFlagMapper.toDomain);
  }

  async getOrganisationIdByIdOrSlug(organisationIdOrSlug: string): Promise<string | null> {
    const org = await this.prisma.organisation.findFirst({
      where: {
        OR: [{ id: organisationIdOrSlug }, { slug: organisationIdOrSlug }],
      },
    });
    return org?.id ?? null;
  }

  async create(data: CreateRiskAssessmentFlagData): Promise<RiskAssessmentFlag> {
    const id = this.idGenerator.randomId();
    const record = await this.prisma.riskAssessmentFlag.create({
      data: {
        id,
        organisationId: data.organisationId,
        riskAssessmentId: data.riskAssessmentId ?? undefined,
        name: data.name ?? undefined,
        description: data.description ?? undefined,
      },
    });
    return RiskAssessmentFlagMapper.toDomain(record);
  }

  async update(id: string, patch: Partial<RiskAssessmentFlag>): Promise<RiskAssessmentFlag> {
    const data: Prisma.RiskAssessmentFlagUncheckedUpdateInput = {};
    if (patch.riskAssessmentId !== undefined) data.riskAssessmentId = patch.riskAssessmentId;
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.description !== undefined) data.description = patch.description;
    if (patch.status !== undefined) data.status = patch.status as RiskAssessmentFlagStatus;
    if (patch.acceptedAt !== undefined) data.acceptedAt = patch.acceptedAt;
    if (patch.acceptedById !== undefined) data.acceptedById = patch.acceptedById;
    const record = await this.prisma.riskAssessmentFlag.update({
      where: { id },
      data,
    });
    return RiskAssessmentFlagMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.riskAssessmentFlag.delete({ where: { id } });
  }
}
