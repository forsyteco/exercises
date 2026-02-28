import { Organisation } from '@/modules/organisation/domain/organisation';

export abstract class OrganisationRepositoryPort {
  abstract findById(id: string): Promise<Organisation | null>;
  abstract findByIdOrSlug(organisationIdOrSlug: string): Promise<Organisation | null>;
  abstract findMany(): Promise<Organisation[]>;
  abstract save(organisation: Organisation): Promise<Organisation>;
}
