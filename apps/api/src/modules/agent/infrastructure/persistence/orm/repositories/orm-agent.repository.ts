import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { AgentRepositoryPort } from '@/modules/agent/application/ports/agent.repository.port';
import { Agent } from '@/modules/agent/domain/agent';
import { AgentMapper } from '@/modules/agent/infrastructure/persistence/orm/mappers/agent.mapper';

@Injectable()
export class OrmAgentRepository extends AgentRepositoryPort {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<Agent | null> {
    const record = await this.prisma.agent.findUnique({ where: { id } });
    return record ? AgentMapper.toDomain(record) : null;
  }

  async findManyOrderByName(): Promise<Agent[]> {
    const records = await this.prisma.agent.findMany({
      orderBy: { name: 'asc' },
    });
    return records.map(AgentMapper.toDomain);
  }

  async findManyByOrganisationIdOrSlugOrderByName(organisationIdOrSlug: string): Promise<Agent[]> {
    const org = await this.prisma.organisation.findFirst({
      where: {
        OR: [{ id: organisationIdOrSlug }, { slug: organisationIdOrSlug }],
      },
    });
    if (!org) return [];
    const records = await this.prisma.agent.findMany({
      where: { organisationId: org.id },
      orderBy: { name: 'asc' },
    });
    return records.map(AgentMapper.toDomain);
  }

  async getOrganisationIdByIdOrSlug(organisationIdOrSlug: string): Promise<string | null> {
    const org = await this.prisma.organisation.findFirst({
      where: {
        OR: [{ id: organisationIdOrSlug }, { slug: organisationIdOrSlug }],
      },
    });
    return org?.id ?? null;
  }
}
