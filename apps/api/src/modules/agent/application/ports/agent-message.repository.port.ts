import { AgentMessage } from '@/modules/agent/domain/agent-message';
import { AgentMessageRole } from '@/common/enums/agent-message-role.enum';

export interface CreateAgentMessageData {
  sessionId: string;
  organisationId: string;
  role: AgentMessageRole;
  sequenceId: number;
  content?: Record<string, unknown> | null;
}

export abstract class AgentMessageRepositoryPort {
  abstract countBySessionId(sessionId: string): Promise<number>;
  abstract create(data: CreateAgentMessageData): Promise<AgentMessage>;
  abstract createMany(data: CreateAgentMessageData[]): Promise<AgentMessage[]>;
}
