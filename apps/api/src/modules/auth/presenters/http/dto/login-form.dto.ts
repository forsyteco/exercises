import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginFormDto {
  @ApiProperty({ example: 'buzz.aldrin@forsyte.co' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'beeCompliant33' })
  @IsString()
  @MinLength(1)
  password!: string;
}
