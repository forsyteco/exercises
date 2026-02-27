import { Injectable, Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { IdGenerator } from '@/utils/id-generator';
import {
  AgentMessageRepositoryPort,
  CreateAgentMessageData,
} from '@/modules/agent/application/ports/agent-message.repository.port';
import { AgentMessage } from '@/modules/agent/domain/agent-message';
import { AgentMessageMapper } from '@/modules/agent/infrastructure/persistence/orm/mappers/agent-message.mapper';

export const MESSAGE_ID_GENERATOR = 'MESSAGE_ID_GENERATOR';

@Injectable()
export class OrmAgentMessageRepository extends AgentMessageRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(MESSAGE_ID_GENERATOR) private readonly idGenerator: IdGenerator,
  ) {
    super();
  }

  async countBySessionId(sessionId: string): Promise<number> {
    return this.prisma.agentMessage.count({
      where: { sessionId },
    });
  }

  async create(data: CreateAgentMessageData): Promise<AgentMessage> {
    const id = this.idGenerator.randomId();
    const record = await this.prisma.agentMessage.create({
      data: {
        id,
        organisationId: data.organisationId,
        sessionId: data.sessionId,
        role: data.role as 'user' | 'agent',
        sequenceId: data.sequenceId,
        content: (data.content ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
    return AgentMessageMapper.toDomain(record);
  }

  async createMany(data: CreateAgentMessageData[]): Promise<AgentMessage[]> {
    const records = await this.prisma.$transaction(
      data.map((d) =>
        this.prisma.agentMessage.create({
          data: {
            id: this.idGenerator.randomId(),
            organisationId: d.organisationId,
            sessionId: d.sessionId,
            role: d.role as 'user' | 'agent',
            sequenceId: d.sequenceId,
            content: (d.content ?? undefined) as Prisma.InputJsonValue | undefined,
          },
        }),
      ),
    );
    return records.map(AgentMessageMapper.toDomain);
  }
}
