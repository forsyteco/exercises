import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '@/modules/prisma/prisma.service';
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
  constructor(private readonly prisma: PrismaService) {}

  async listAgents(): Promise<AgentDto[]> {
    const agents = await this.prisma.agent.findMany({
      orderBy: { name: 'asc' },
    });

    return plainToInstance(AgentDto, agents, { excludeExtraneousValues: true });
  }

  async createSession(agentId: string, organisationId: string): Promise<AgentSessionDto> {
    const agent = await this.prisma.agent.findUnique({ where: { id: agentId } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const session = await this.prisma.agentSession.create({
      data: {
        agentId: agent.id,
        organisationId,
      },
    });

    return plainToInstance(AgentSessionDto, session, { excludeExtraneousValues: true });
  }

  async sendMessage(
    sessionId: string,
    role: AgentMessageRole,
    content: Record<string, any> | null,
  ): Promise<AgentMessageDto> {
    const session = await this.prisma.agentSession.findUnique({
      where: { id: sessionId },
      include: { agent: true },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.agent.model === UNWIRED_MODEL) {
      throw new BadRequestException('This agent is not wired for conversations yet.');
    }

    if (session.agent.model !== WIRED_MODEL) {
      throw new BadRequestException('Unsupported agent configuration.');
    }

    const existingCount = await this.prisma.agentMessage.count({
      where: { sessionId },
    });

    const text = typeof content?.text === 'string' ? content.text.trim() : '';

    if (existingCount === 0) {
      if (text !== QUESTION_ONE) {
        throw new BadRequestException('First question must be: ' + QUESTION_ONE);
      }

      const [, agentMessage] = await this.prisma.$transaction([
        this.prisma.agentMessage.create({
          data: {
            sessionId,
            role,
            sequenceId: 1,
            content: content ?? undefined,
          },
        }),
        this.prisma.agentMessage.create({
          data: {
            sessionId,
            role: AgentMessageRole.Agent,
            sequenceId: 2,
            content: { text: ANSWER_ONE },
          },
        }),
      ]);

      return plainToInstance(AgentMessageDto, agentMessage, { excludeExtraneousValues: true });
    }

    if (existingCount === 2) {
      if (text !== QUESTION_TWO) {
        throw new BadRequestException('Second question must be: ' + QUESTION_TWO);
      }

      const [, agentMessage] = await this.prisma.$transaction([
        this.prisma.agentMessage.create({
          data: {
            sessionId,
            role,
            sequenceId: 3,
            content: content ?? undefined,
          },
        }),
        this.prisma.agentMessage.create({
          data: {
            sessionId,
            role: AgentMessageRole.Agent,
            sequenceId: 4,
            content: { text: ANSWER_TWO },
          },
        }),
      ]);

      return plainToInstance(AgentMessageDto, agentMessage, { excludeExtraneousValues: true });
    }

    throw new BadRequestException('This mock conversation only supports the two predefined questions.');
  }

}

