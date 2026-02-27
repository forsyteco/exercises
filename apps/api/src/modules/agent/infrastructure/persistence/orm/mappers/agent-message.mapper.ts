import { AgentMessage } from '@/modules/agent/domain/agent-message';
import { AgentMessage as PrismaAgentMessage } from '@prisma/client';
import { AgentMessageRole } from '@/common/enums/agent-message-role.enum';

function mapRole(role: string): AgentMessageRole {
  if (role === 'agent') return AgentMessageRole.Agent;
  return AgentMessageRole.User;
}

export class AgentMessageMapper {
  static toDomain(record: PrismaAgentMessage): AgentMessage {
    return new AgentMessage(
      record.id,
      record.organisationId,
      record.sessionId,
      mapRole(record.role),
      record.sequenceId,
      (record.content as Record<string, unknown>) ?? null,
      record.createdAt,
    );
  }
}
