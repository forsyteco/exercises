import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserStatus } from '@/common/enums/user-status.enum';

export class UserFormDto {
  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ enum: UserStatus })
  @IsEnum(UserStatus)
  status!: UserStatus;
}
