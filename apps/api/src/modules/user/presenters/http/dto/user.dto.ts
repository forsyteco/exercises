import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { UserStatus } from '@/common/enums/user-status.enum';

export class UserDto {
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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Expose()
  email!: string;

  @ApiProperty({ enum: UserStatus })
  @IsEnum(UserStatus)
  @Expose()
  status!: UserStatus;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @Type(() => Date)
  updatedAt!: Date;

  @ApiPropertyOptional({ type: String, format: 'date-time', nullable: true })
  @Expose()
  @Type(() => Date)
  verifiedAt?: Date | null;
}
