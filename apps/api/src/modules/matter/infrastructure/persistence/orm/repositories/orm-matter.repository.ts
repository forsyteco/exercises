import { Injectable, Inject } from '@nestjs/common';
import { Prisma, MatterStatus } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { IdGenerator } from '@/utils/id-generator';
import {
  MatterRepositoryPort,
  CreateMatterData,
} from '@/modules/matter/application/ports/matter.repository.port';
import { Matter } from '@/modules/matter/domain/matter';
import { MatterMapper } from '@/modules/matter/infrastructure/persistence/orm/mappers/matter.mapper';

export const MATTER_ID_GENERATOR = 'MATTER_ID_GENERATOR';

@Injectable()
export class OrmMatterRepository extends MatterRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(MATTER_ID_GENERATOR) private readonly idGenerator: IdGenerator,
  ) {
    super();
  }

  async findById(id: string): Promise<Matter | null> {
    const record = await this.prisma.matter.findUnique({ where: { id } });
    return record ? MatterMapper.toDomain(record) : null;
  }

  async findManyByOrganisationIdOrSlug(organisationIdOrSlug: string): Promise<Matter[]> {
    const org = await this.prisma.organisation.findFirst({
      where: {
        OR: [{ id: organisationIdOrSlug }, { slug: organisationIdOrSlug }],
      },
    });
    if (!org) return [];
    const records = await this.prisma.matter.findMany({
      where: { organisationId: org.id },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(MatterMapper.toDomain);
  }

  async findManyByClientId(clientId: string): Promise<Matter[]> {
    const records = await this.prisma.matter.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map(MatterMapper.toDomain);
  }

  async getOrganisationIdByIdOrSlug(organisationIdOrSlug: string): Promise<string | null> {
    const org = await this.prisma.organisation.findFirst({
      where: {
        OR: [{ id: organisationIdOrSlug }, { slug: organisationIdOrSlug }],
      },
    });
    return org?.id ?? null;
  }

  async create(data: CreateMatterData): Promise<Matter> {
    const id = this.idGenerator.randomId();
    const createData: Prisma.MatterUncheckedCreateInput = {
      id,
      organisationId: data.organisationId,
      clientId: data.clientId,
      reference: data.reference,
      description: data.description,
      status: data.status as MatterStatus,
      type: data.type,
      ownedById: data.ownedById,
    };
    const record = await this.prisma.matter.create({ data: createData });
    return MatterMapper.toDomain(record);
  }

  async update(id: string, patch: Partial<Matter>): Promise<Matter> {
    const data: Prisma.MatterUncheckedUpdateInput = {};
    if (patch.reference !== undefined) data.reference = patch.reference;
    if (patch.description !== undefined) data.description = patch.description;
    if (patch.status !== undefined) data.status = patch.status as MatterStatus;
    if (patch.type !== undefined) data.type = patch.type;
    if (patch.ownedById !== undefined) data.ownedById = patch.ownedById;
    const record = await this.prisma.matter.update({
      where: { id },
      data,
    });
    return MatterMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.matter.delete({ where: { id } });
  }
}
