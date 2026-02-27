import { AgentSession } from '@/modules/agent/domain/agent-session';
import { AgentSession as PrismaAgentSession } from '@prisma/client';

export class AgentSessionMapper {
  static toDomain(record: PrismaAgentSession): AgentSession {
    return new AgentSession(
      record.id,
      record.organisationId,
      record.agentId,
      record.createdAt,
    );
  }
}
