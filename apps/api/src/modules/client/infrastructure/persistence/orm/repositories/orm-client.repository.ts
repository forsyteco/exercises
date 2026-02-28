import { Injectable, Inject } from '@nestjs/common';
import { Prisma, ClientType } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { IdGenerator } from '@/utils/id-generator';
import {
  ClientRepositoryPort,
  CreateClientData,
} from '@/modules/client/application/ports/client.repository.port';
import { Client } from '@/modules/client/domain/client';
import { ClientMapper } from '@/modules/client/infrastructure/persistence/orm/mappers/client.mapper';

export const CLIENT_ID_GENERATOR = 'CLIENT_ID_GENERATOR';

@Injectable()
export class OrmClientRepository extends ClientRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CLIENT_ID_GENERATOR) private readonly idGenerator: IdGenerator,
  ) {
    super();
  }

  async findById(id: string): Promise<Client | null> {
    const record = await this.prisma.client.findUnique({ where: { id } });
    return record ? ClientMapper.toDomain(record) : null;
  }

  async findManyByOrganisationIdOrSlug(organisationIdOrSlug: string): Promise<Client[]> {
    const org = await this.prisma.organisation.findFirst({
      where: {
        OR: [{ id: organisationIdOrSlug }, { slug: organisationIdOrSlug }],
      },
    });
    if (!org) return [];
    const records = await this.prisma.client.findMany({
      where: { organisationId: org.id },
      orderBy: { name: 'asc' },
    });
    return records.map(ClientMapper.toDomain);
  }

  async getOrganisationIdByIdOrSlug(organisationIdOrSlug: string): Promise<string | null> {
    const org = await this.prisma.organisation.findFirst({
      where: {
        OR: [{ id: organisationIdOrSlug }, { slug: organisationIdOrSlug }],
      },
    });
    return org?.id ?? null;
  }

  async create(data: CreateClientData): Promise<Client> {
    const id = this.idGenerator.randomId();
    const createData: Prisma.ClientUncheckedCreateInput = {
      id,
      organisationId: data.organisationId,
      reference: data.reference,
      type: data.type as ClientType,
      name: data.name,
    };
    const record = await this.prisma.client.create({ data: createData });
    return ClientMapper.toDomain(record);
  }

  async update(id: string, patch: Partial<Client>): Promise<Client> {
    const data: Prisma.ClientUncheckedUpdateInput = {};
    if (patch.reference !== undefined) data.reference = patch.reference;
    if (patch.type !== undefined) data.type = patch.type as ClientType;
    if (patch.name !== undefined) data.name = patch.name;
    const record = await this.prisma.client.update({
      where: { id },
      data,
    });
    return ClientMapper.toDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({ where: { id } });
  }
}
