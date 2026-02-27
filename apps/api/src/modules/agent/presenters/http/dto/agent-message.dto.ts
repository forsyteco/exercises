import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MinLength, IsNotEmpty, IsString } from 'class-validator';

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

  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @Expose()
  role!: string;

  @ApiProperty()
  @Expose()
  sequenceId!: number;

  @ApiPropertyOptional({ type: Object })
  @Expose()
  content?: Record<string, any> | null;

  @ApiPropertyOptional({ type: Object, description: 'Normalized message variables' })
  @Expose()
  variables?: Record<string, any> | null;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;
}

