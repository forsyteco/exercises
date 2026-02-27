import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { AgentVariableDto } from './agent-variable.dto';

export class AgentSessionForm {
  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  agentId!: string;

  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  organisationId!: string;

  @ApiPropertyOptional({ type: [AgentVariableDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AgentVariableDto)
  variables?: AgentVariableDto[];
}

