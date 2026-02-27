import { Organisation } from '@/modules/organisation/domain/organisation';
import { Organisation as PrismaOrganisation } from '@prisma/client';

export class OrganisationMapper {
  static toDomain(record: PrismaOrganisation): Organisation {
    return new Organisation(record.id, record.name, record.slug);
  }
}
