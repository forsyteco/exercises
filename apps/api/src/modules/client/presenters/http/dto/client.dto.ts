import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { ClientType } from '@/common/enums/client-type.enum';

export class ClientDto {
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
  organisationId!: string;

  @ApiProperty()
  @Expose()
  reference!: string;

  @ApiProperty({ enum: ClientType })
  @IsEnum(ClientType)
  @Expose()
  type!: ClientType;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @Type(() => Date)
  updatedAt!: Date;
}
