import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AgentRepositoryPort } from '@/modules/agent/application/ports/agent.repository.port';
import { AgentSessionRepositoryPort } from '@/modules/agent/application/ports/agent-session.repository.port';
import { AgentMessageRepositoryPort } from '@/modules/agent/application/ports/agent-message.repository.port';
import { AgentDto } from '@/modules/agent/presenters/http/dto/agent.dto';
import { AgentSessionDto } from '@/modules/agent/presenters/http/dto/agent-session.dto';
import { AgentMessageDto } from '@/modules/agent/presenters/http/dto/agent-message.dto';
import { AgentMessageRole } from '@/common/enums/agent-message-role.enum';

const WIRED_MODEL = 'forsyte.ask-forsyte-mock-1-alpha-v5';
const UNWIRED_MODEL = 'anthropic.claude-sonnet-4-5-20250929-v1:0';

const QUESTION_ONE = 'Do I have matters in high risk jurisdictions?';
const QUESTION_TWO = 'How many of these have outstanding risk assessments?';

const ANSWER_ONE = 'Yes, you have 12 matters in high-risk jurisdictions across three regions.';
const ANSWER_TWO = 'Out of these, 5 matters currently have outstanding risk assessments.';

@Injectable()
export class AgentService {
  constructor(
    private readonly agentRepo: AgentRepositoryPort,
    private readonly sessionRepo: AgentSessionRepositoryPort,
    private readonly messageRepo: AgentMessageRepositoryPort,
  ) {}

  async listAgents(organisationIdOrSlug: string): Promise<AgentDto[]> {
    const agents = await this.agentRepo.findManyByOrganisationIdOrSlugOrderByName(organisationIdOrSlug);
    return agents.map((a) => this.toAgentDto(a));
  }

  async createSession(agentId: string, organisationIdOrSlug: string): Promise<AgentSessionDto> {
    const agent = await this.agentRepo.findById(agentId);
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }
    const organisationId = await this.agentRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }

    const session = await this.sessionRepo.create({
      agentId: agent.id,
      organisationId,
    });
    return this.toSessionDto(session);
  }

  async sendMessage(
    sessionId: string,
    role: AgentMessageRole,
    content: Record<string, unknown> | null,
  ): Promise<AgentMessageDto> {
    const sessionWithAgent = await this.sessionRepo.findByIdWithAgent(sessionId);
    if (!sessionWithAgent) {
      throw new NotFoundException('Session not found');
    }

    const { session, agent } = sessionWithAgent;
    if (agent.model === UNWIRED_MODEL) {
      throw new BadRequestException('This agent is not wired for conversations yet.');
    }
    if (agent.model !== WIRED_MODEL) {
      throw new BadRequestException('Unsupported agent configuration.');
    }

    const existingCount = await this.messageRepo.countBySessionId(sessionId);
    const text = typeof content?.text === 'string' ? (content.text as string).trim() : '';

    if (existingCount === 0) {
      if (text !== QUESTION_ONE) {
        throw new BadRequestException('First question must be: ' + QUESTION_ONE);
      }
      const [, second] = await Promise.all([
        this.messageRepo.create({
          sessionId,
          organisationId: session.organisationId,
          role,
          sequenceId: 1,
          content: content ?? undefined,
        }),
        this.messageRepo.create({
          sessionId,
          organisationId: session.organisationId,
          role: AgentMessageRole.Agent,
          sequenceId: 2,
          content: { text: ANSWER_ONE },
        }),
      ]);
      return this.toMessageDto(second);
    }

    if (existingCount === 2) {
      if (text !== QUESTION_TWO) {
        throw new BadRequestException('Second question must be: ' + QUESTION_TWO);
      }
      const [, second] = await Promise.all([
        this.messageRepo.create({
          sessionId,
          organisationId: session.organisationId,
          role,
          sequenceId: 3,
          content: content ?? undefined,
        }),
        this.messageRepo.create({
          sessionId,
          organisationId: session.organisationId,
          role: AgentMessageRole.Agent,
          sequenceId: 4,
          content: { text: ANSWER_TWO },
        }),
      ]);
      return this.toMessageDto(second);
    }

    throw new BadRequestException('This mock conversation only supports the two predefined questions.');
  }

  private toAgentDto(agent: { id: string; name: string; slug: string; description: string | null; createdAt: Date; updatedAt: Date }): AgentDto {
    return plainToInstance(AgentDto, {
      id: agent.id,
      name: agent.name,
      slug: agent.slug,
      description: agent.description,
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
    }, { excludeExtraneousValues: true });
  }

  private toSessionDto(session: { id: string; agentId: string; organisationId: string; createdAt: Date }): AgentSessionDto {
    return plainToInstance(AgentSessionDto, {
      id: session.id,
      agentId: session.agentId,
      organisationId: session.organisationId,
      createdAt: session.createdAt,
    }, { excludeExtraneousValues: true });
  }

  private toMessageDto(msg: { id: string; sessionId: string; role: string; sequenceId: number; content: Record<string, unknown> | null; createdAt: Date }): AgentMessageDto {
    return plainToInstance(AgentMessageDto, {
      id: msg.id,
      sessionId: msg.sessionId,
      role: msg.role as AgentMessageRole,
      sequenceId: msg.sequenceId,
      content: msg.content,
      createdAt: msg.createdAt,
    }, { excludeExtraneousValues: true });
  }
}
