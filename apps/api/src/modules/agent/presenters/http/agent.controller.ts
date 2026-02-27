import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AgentService } from '@/modules/agent/application/agent.service';
import { AgentDto } from '@/modules/agent/presenters/http/dto/agent.dto';
import { AgentSessionDto } from '@/modules/agent/presenters/http/dto/agent-session.dto';
import { AgentMessageDto } from '@/modules/agent/presenters/http/dto/agent-message.dto';
import { AgentSessionForm } from '@/modules/agent/presenters/http/dto/agent-session.form.dto';
import { AgentMessageForm } from '@/modules/agent/presenters/http/dto/agent-message.form.dto';

@ApiTags('agents')
@ApiBearerAuth()
@Controller(':organisationIdOrSlug/agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get()
  @ApiOperation({ summary: 'List available agents' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String, description: 'Organisation ID or slug' })
  @ApiResponse({ status: 200, type: AgentDto, isArray: true })
  async listAgents(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
  ): Promise<AgentDto[]> {
    return this.agentService.listAgents(organisationIdOrSlug);
  }

  @Post(':agentId/sessions')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create a new agent session' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String, description: 'Organisation ID or slug' })
  @ApiParam({ name: 'agentId', type: String })
  @ApiBody({ type: AgentSessionForm })
  @ApiResponse({ status: 201, type: AgentSessionDto })
  async createSession(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('agentId') agentId: string,
    @Body() dto: AgentSessionForm,
  ): Promise<AgentSessionDto> {
    return this.agentService.createSession(agentId, organisationIdOrSlug);
  }

  @Post('sessions/:sessionId/messages')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Send a message in a session and receive the mock agent response' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String, description: 'Organisation ID or slug' })
  @ApiParam({ name: 'sessionId', type: String })
  @ApiBody({ type: AgentMessageForm })
  @ApiResponse({ status: 201, type: AgentMessageDto })
  async sendMessage(
    @Param('organisationIdOrSlug') _organisationIdOrSlug: string,
    @Param('sessionId') sessionId: string,
    @Body() dto: AgentMessageForm,
  ): Promise<AgentMessageDto> {
    return this.agentService.sendMessage(sessionId, dto.role, dto.content ?? null);
  }
}

