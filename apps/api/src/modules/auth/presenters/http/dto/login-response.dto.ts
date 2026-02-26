import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  @Expose()
  accessToken!: string;
}
