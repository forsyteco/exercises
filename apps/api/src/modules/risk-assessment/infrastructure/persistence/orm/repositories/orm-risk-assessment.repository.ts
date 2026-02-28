import { Injectable, Inject } from '@nestjs/common';
import { Prisma, RiskAssessmentStatus, RiskLevel } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { IdGenerator } from '@/utils/id-generator';
import {
  RiskAssessmentRepositoryPort,
  CreateRiskAssessmentData,
  RiskAssessmentWithDescriptionContext,
} from '@/modules/risk-assessment/application/ports/risk-assessment.repository.port';
import { RiskAssessment } from '@/modules/risk-assessment/domain/risk-assessment';
import { RiskAssessmentMapper } from '@/modules/risk-assessment/infrastructure/persistence/orm/mappers/risk-assessment.mapper';

export const RISK_ASSESSMENT_ID_GENERATOR = 'RISK_ASSESSMENT_ID_GENERATOR';

@Injectable()
export class OrmRiskAssessmentRepository extends RiskAssessmentRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(RISK_ASSESSMENT_ID_GENERATOR) private readonly idGenerator: IdGenerator,
  ) {
    super();
  }

  async findById(id: string): Promise<RiskAssessment | null> {
    const record = await this.prisma.riskAssessment.findUnique({ where: { id } });
    return record ? RiskAssessmentMapper.toDomain(record) : null;
  }

  async findByIdWithClientAndMatter(id: string): Promise<RiskAssessmentWithDescriptionContext | null> {
    const record = await this.prisma.riskAssessment.findUnique({
      where: { id },
      include: { client: true, matter: true },
    });
    if (!record) return null;
    return {
      riskAssessment: RiskAssessmentMapper.toDomain(record),
      clientName: record.client.name,
      matterDescription: record.matter.description,
    };
  }

  async findManyByOrganisationIdOrSlug(organisationIdOrSlug: string): Promise<RiskAssessment[]> {
    const org = await this.prisma.organisation.findFirst({
      where: {
        OR: [{ id: organisationIdOrSlug }, { slug: organisationIdOrSlug }],
      },
    });
    if (!org) return [];
    const records = await this.prisma.riskAssessment.findMany({
      where: { organisationId: org.id },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(RiskAssessmentMapper.toDomain);
  }

  async findManyByOrganisationIdOrSlugWithClientAndMatter(
    organisationIdOrSlug: string,
  ): Promise<RiskAssessmentWithDescriptionContext[]> {
    const org = await this.prisma.organisation.findFirst({
      where: {
        OR: [{ id: organisationIdOrSlug }, { slug: organisationIdOrSlug }],
      },
    });
    if (!org) return [];
    const records = await this.prisma.riskAssessment.findMany({
      where: { organisationId: org.id },
      orderBy: { createdAt: 'desc' },
      include: { client: true, matter: true },
    });
    return records.map((record) => ({
      riskAssessment: RiskAssessmentMapper.toDomain(record),
      clientName: record.client.name,
      matterDescription: record.matter.description,
    }));
  }

  async getOrganisationIdByIdOrSlug(organisationIdOrSlug: string): Promise<string | null> {
    const org = await this.prisma.organisation.findFirst({
      where: {
        OR: [{ id: organisationIdOrSlug }, { slug: organisationIdOrSlug }],
      },
    });
    return org?.id ?? null;
  }

  async create(data: CreateRiskAssessmentData): Promise<RiskAssessment> {
    const id = this.idGenerator.randomId();
    const createData: Prisma.RiskAssessmentUncheckedCreateInput = {
      id,
      organisationId: data.organisationId,
      clientId: data.clientId,
      matterId: data.matterId,
      ownerId: data.ownerId ?? undefined,
      assignedToId: data.assignedToId ?? undefined,
      riskLevel: data.riskLevel != null ? (data.riskLevel as RiskLevel) : undefined,
    };
    const record = await this.prisma.riskAssessment.create({ data: createData });
    return RiskAssessmentMapper.toDomain(record);
  }

  async update(id: string, patch: Partial<RiskAssessment>): Promise<RiskAssessment> {
    const data: Prisma.RiskAssessmentUncheckedUpdateInput = {};
    if (patch.status !== undefined) data.status = patch.status as RiskAssessmentStatus;
    if (patch.version !== undefined) data.version = patch.version;
    if (patch.ownerId !== undefined) data.ownerId = patch.ownerId;
    if (patch.assignedToId !== undefined) data.assignedToId = patch.assignedToId;
    if (patch.riskLevel !== undefined) data.riskLevel = patch.riskLevel as RiskLevel | null;
    const record = await this.prisma.riskAssessment.update({
      where: { id },
      data,
    });
    return RiskAssessmentMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.riskAssessment.delete({ where: { id } });
  }
}
