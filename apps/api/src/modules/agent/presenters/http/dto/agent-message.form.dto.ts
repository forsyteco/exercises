import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class AgentMessageForm {
  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  role!: string;

  @ApiPropertyOptional({ type: Object, description: 'Arbitrary message content, expects { text: string } for mock Q&A.' })
  @IsOptional()
  content?: Record<string, any> | null;

  @ApiPropertyOptional({ type: Object, description: 'Optional normalized variables for this message.' })
  @IsOptional()
  variables?: Record<string, any> | null;
}

