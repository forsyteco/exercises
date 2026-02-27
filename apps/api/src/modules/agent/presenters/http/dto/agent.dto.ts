import { Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AgentDto {
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
  name!: string;

  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @Expose()
  slug!: string;

  @ApiPropertyOptional()
  @Expose()
  description?: string | null;

  @ApiPropertyOptional()
  @Expose()
  bedrockAgentId?: string | null;

  @ApiPropertyOptional()
  @Expose()
  bedrockAgentAlias?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  updatedAt!: Date;
}

