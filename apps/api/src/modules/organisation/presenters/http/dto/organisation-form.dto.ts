import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class OrganisationFormDto {
  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  slug!: string;
}
