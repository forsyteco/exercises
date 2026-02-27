import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MinLength, IsNotEmpty, IsString } from 'class-validator';
import { AgentVariableDto } from './agent-variable.dto';

export class AgentSessionDto {
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
  agentId!: string;

  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @Expose()
  organisationId!: string;

  @ApiPropertyOptional({ type: [AgentVariableDto], description: 'Session variables' })
  @Expose()
  @Type(() => AgentVariableDto)
  variables?: AgentVariableDto[];

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}

