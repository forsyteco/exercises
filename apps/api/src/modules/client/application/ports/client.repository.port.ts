import { Client } from '@/modules/client/domain/client';

export interface CreateClientData {
  organisationId: string;
  reference: string;
  type: string;
  name: string;
}

export abstract class ClientRepositoryPort {
  abstract findById(id: string): Promise<Client | null>;
  abstract findManyByOrganisationIdOrSlug(organisationIdOrSlug: string): Promise<Client[]>;
  abstract getOrganisationIdByIdOrSlug(organisationIdOrSlug: string): Promise<string | null>;
  abstract create(data: CreateClientData): Promise<Client>;
  abstract update(id: string, patch: Partial<Client>): Promise<Client>;
  abstract delete(id: string): Promise<void>;
}
