import { Agent } from '@/modules/agent/domain/agent';

export abstract class AgentRepositoryPort {
  abstract findById(id: string): Promise<Agent | null>;
  abstract findManyOrderByName(): Promise<Agent[]>;
  abstract findManyByOrganisationIdOrSlugOrderByName(organisationIdOrSlug: string): Promise<Agent[]>;
  abstract getOrganisationIdByIdOrSlug(organisationIdOrSlug: string): Promise<string | null>;
}
