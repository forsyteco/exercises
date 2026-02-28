import { Matter } from '@/modules/matter/domain/matter';

export interface CreateMatterData {
  organisationId: string;
  clientId: string;
  reference: string;
  description: string;
  status: string;
  type: string;
  ownerId: string;
}

export abstract class MatterRepositoryPort {
  abstract findById(id: string): Promise<Matter | null>;
  abstract findManyByOrganisationIdOrSlug(organisationIdOrSlug: string): Promise<Matter[]>;
  abstract findManyByClientId(clientId: string): Promise<Matter[]>;
  abstract getOrganisationIdByIdOrSlug(organisationIdOrSlug: string): Promise<string | null>;
  abstract create(data: CreateMatterData): Promise<Matter>;
  abstract update(id: string, patch: Partial<Matter>): Promise<Matter>;
  abstract delete(id: string): Promise<void>;
}
