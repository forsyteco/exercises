import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { IdGenerator } from '@/utils/id-generator';
import { OrganisationRepositoryPort } from '@/modules/organisation/application/ports/organisation.repository.port';
import { Organisation } from '@/modules/organisation/domain/organisation';
import { OrganisationMapper } from '@/modules/organisation/infrastructure/persistence/orm/mappers/organisation.mapper';

export const ORGANISATION_ID_GENERATOR = 'ORGANISATION_ID_GENERATOR';

@Injectable()
export class OrmOrganisationRepository extends OrganisationRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(ORGANISATION_ID_GENERATOR) private readonly idGenerator: IdGenerator,
  ) {
    super();
  }

  async findById(id: string): Promise<Organisation | null> {
    const record = await this.prisma.organisation.findUnique({ where: { id } });
    return record ? OrganisationMapper.toDomain(record) : null;
  }

  async findByIdOrSlug(organisationIdOrSlug: string): Promise<Organisation | null> {
    const record = await this.prisma.organisation.findFirst({
      where: {
        OR: [{ id: organisationIdOrSlug }, { slug: organisationIdOrSlug }],
      },
    });
    return record ? OrganisationMapper.toDomain(record) : null;
  }

  async findMany(): Promise<Organisation[]> {
    const records = await this.prisma.organisation.findMany({
      orderBy: { name: 'asc' },
    });
    return records.map(OrganisationMapper.toDomain);
  }

  async save(organisation: Organisation): Promise<Organisation> {
    const record = await this.prisma.organisation.upsert({
      where: { id: organisation.id },
      create: {
        id: organisation.id,
        name: organisation.name,
        slug: organisation.slug,
      },
      update: {
        name: organisation.name,
        slug: organisation.slug,
      },
    });
    return OrganisationMapper.toDomain(record);
  }
}
