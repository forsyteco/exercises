import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsEnum, MinLength } from 'class-validator';
import { MatterStatus } from '@/common/enums/matter-status.enum';

export class CreateMatterFormDto {
  @ApiProperty({ minLength: 1, description: 'Client ID' })
  @IsString()
  @MinLength(1)
  clientId!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  reference!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  description!: string;

  @ApiProperty({ enum: MatterStatus })
  @IsEnum(MatterStatus)
  status!: MatterStatus;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  type!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  ownerId!: string;
}

export class UpdateMatterFormDto extends PartialType(CreateMatterFormDto) {}
