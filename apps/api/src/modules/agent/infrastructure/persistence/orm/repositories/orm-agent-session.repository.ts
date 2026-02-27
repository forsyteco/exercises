import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { IdGenerator } from '@/utils/id-generator';
import {
  AgentSessionRepositoryPort,
  CreateAgentSessionData,
  AgentSessionWithAgent,
} from '@/modules/agent/application/ports/agent-session.repository.port';
import { AgentSession } from '@/modules/agent/domain/agent-session';
import { Agent } from '@/modules/agent/domain/agent';
import { AgentSessionMapper } from '@/modules/agent/infrastructure/persistence/orm/mappers/agent-session.mapper';
import { AgentMapper } from '@/modules/agent/infrastructure/persistence/orm/mappers/agent.mapper';

export const SESSION_ID_GENERATOR = 'SESSION_ID_GENERATOR';

@Injectable()
export class OrmAgentSessionRepository extends AgentSessionRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(SESSION_ID_GENERATOR) private readonly idGenerator: IdGenerator,
  ) {
    super();
  }

  async create(data: CreateAgentSessionData): Promise<AgentSession> {
    const id = this.idGenerator.randomId();
    const record = await this.prisma.agentSession.create({
      data: {
        id,
        agentId: data.agentId,
        organisationId: data.organisationId,
      },
    });
    return AgentSessionMapper.toDomain(record);
  }

  async findByIdWithAgent(id: string): Promise<AgentSessionWithAgent | null> {
    const record = await this.prisma.agentSession.findUnique({
      where: { id },
      include: { agent: true },
    });
    if (!record) return null;
    return {
      session: AgentSessionMapper.toDomain(record),
      agent: AgentMapper.toDomain(record.agent),
    };
  }
}
