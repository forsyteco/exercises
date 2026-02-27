import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AgentVariableDto {
  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @Expose()
  name!: string;

  @ApiProperty({ type: Object })
  @Expose()
  value!: Record<string, any>;
}

