import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'exercise@forsyte.co' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'beeCompliant33' })
  @IsString()
  @MinLength(1)
  password!: string;

  @ApiPropertyOptional({
    description: 'Token expiration in rauchg/ms format (e.g. "60s", "10h")',
    example: '24h',
  })
  @IsOptional()
  @IsString()
  expiry?: string;
}
