import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsEnum, MinLength } from 'class-validator';
import { ClientType } from '@/common/enums/client-type.enum';

export class CreateClientFormDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  reference!: string;

  @ApiProperty({ enum: ClientType })
  @IsEnum(ClientType)
  type!: ClientType;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  name!: string;
}

export class UpdateClientFormDto extends PartialType(CreateClientFormDto) {}
