import { AgentSession } from '@/modules/agent/domain/agent-session';
import { Agent } from '@/modules/agent/domain/agent';

export interface CreateAgentSessionData {
  agentId: string;
  organisationId: string;
}

export interface AgentSessionWithAgent {
  session: AgentSession;
  agent: Agent;
}

export abstract class AgentSessionRepositoryPort {
  abstract create(data: CreateAgentSessionData): Promise<AgentSession>;
  abstract findByIdWithAgent(id: string): Promise<AgentSessionWithAgent | null>;
}
