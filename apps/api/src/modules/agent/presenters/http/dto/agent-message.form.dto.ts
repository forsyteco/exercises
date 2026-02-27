import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { AgentMessageRole } from '@/common/enums/agent-message-role.enum';

export class AgentMessageForm {
  @ApiProperty({ enum: AgentMessageRole })
  @IsEnum(AgentMessageRole)
  role!: AgentMessageRole;

  @ApiPropertyOptional({ type: Object, description: 'Arbitrary message content, expects { text: string } for mock Q&A.' })
  @IsOptional()
  content?: Record<string, any> | null;
}

