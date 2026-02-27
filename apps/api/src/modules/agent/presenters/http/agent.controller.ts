import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AgentService } from '@/modules/agent/application/agent.service';
import { AgentDto } from '@/modules/agent/presenters/http/dto/agent.dto';
import { AgentSessionDto } from '@/modules/agent/presenters/http/dto/agent-session.dto';
import { AgentMessageDto } from '@/modules/agent/presenters/http/dto/agent-message.dto';
import { AgentSessionForm } from '@/modules/agent/presenters/http/dto/agent-session.form.dto';
import { AgentMessageForm } from '@/modules/agent/presenters/http/dto/agent-message.form.dto';

@ApiTags('agents')
@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Get()
  @ApiOperation({ summary: 'List available agents' })
  @ApiResponse({ status: 200, type: AgentDto, isArray: true })
  async listAgents(): Promise<AgentDto[]> {
    return this.agentService.listAgents();
  }

  @Post(':agentId/sessions')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create a new agent session' })
  @ApiParam({ name: 'agentId', type: String })
  @ApiBody({ type: AgentSessionForm })
  @ApiResponse({ status: 201, type: AgentSessionDto })
  async createSession(
    @Param('agentId') agentId: string,
    @Body() dto: AgentSessionForm,
  ): Promise<AgentSessionDto> {
    return this.agentService.createSession(agentId, dto.organisationId);
  }

  @Post('sessions/:sessionId/messages')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Send a message in a session and receive the mock agent response' })
  @ApiParam({ name: 'sessionId', type: String })
  @ApiBody({ type: AgentMessageForm })
  @ApiResponse({ status: 201, type: AgentMessageDto })
  async sendMessage(
    @Param('sessionId') sessionId: string,
    @Body() dto: AgentMessageForm,
  ): Promise<AgentMessageDto> {
    return this.agentService.sendMessage(sessionId, dto.role, dto.content ?? null);
  }
}

