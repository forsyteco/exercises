import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class OrganisationDto {
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

  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @Expose()
  slug!: string;
}
