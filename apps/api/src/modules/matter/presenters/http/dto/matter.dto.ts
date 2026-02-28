import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { MatterStatus } from '@/common/enums/matter-status.enum';

export class MatterDto {
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

  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @Expose()
  clientId!: string;

  @ApiProperty()
  @Expose()
  reference!: string;

  @ApiProperty()
  @Expose()
  description!: string;

  @ApiProperty({ enum: MatterStatus })
  @IsEnum(MatterStatus)
  @Expose()
  status!: MatterStatus;

  @ApiProperty()
  @Expose()
  type!: string;

  @ApiProperty()
  @Expose()
  ownedById!: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @Type(() => Date)
  updatedAt!: Date;
}
