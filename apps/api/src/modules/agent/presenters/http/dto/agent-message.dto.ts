import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MinLength, IsNotEmpty, IsString } from 'class-validator';
import { AgentMessageRole } from '@/common/enums/agent-message-role.enum';

export class AgentMessageDto {
  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @Expose()
  id!: string;

  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @Expose()
  sessionId!: string;

  @ApiProperty({ enum: AgentMessageRole })
  @Expose()
  role!: AgentMessageRole;

  @ApiProperty()
  @Expose()
  sequenceId!: number;

  @ApiPropertyOptional({ type: Object })
  @Expose()
  content?: Record<string, any> | null;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}

