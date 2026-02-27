import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserStatus } from '@/common/enums/user-status.enum';

export class UserPutFormDto {
  @ApiPropertyOptional({ minLength: 1 })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  @IsOptional()
  verifiedAt?: Date | null;

  @ApiPropertyOptional({ minLength: 1, description: 'Password (write-only, not returned in responses)' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  password?: string;
}
