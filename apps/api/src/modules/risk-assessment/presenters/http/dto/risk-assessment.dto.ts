import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsEnum, IsInt } from 'class-validator';
import { RiskAssessmentStatus } from '@/common/enums/risk-assessment-status.enum';
import { RiskLevel } from '@/common/enums/risk-level.enum';

export class RiskAssessmentDto {
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

  @ApiProperty({ minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @Expose()
  matterId!: string;

  @ApiProperty({ enum: RiskAssessmentStatus })
  @IsEnum(RiskAssessmentStatus)
  @Expose()
  status!: RiskAssessmentStatus;

  @ApiProperty()
  @IsInt()
  @Expose()
  version!: number;

  @ApiPropertyOptional()
  @Expose()
  ownerId?: string | null;

  @ApiPropertyOptional()
  @Expose()
  assignedToId?: string | null;

  @ApiPropertyOptional({ enum: RiskLevel })
  @Expose()
  riskLevel?: RiskLevel | null;

  /** Virtual: matter description + " for " + client name (e.g. "Sale of 49b South Parade for Julian Dawson") */
  @ApiPropertyOptional({
    description: 'Computed from matter description and client name: "{matterDescription} for {clientName}"',
  })
  @Expose()
  description?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @Type(() => Date)
  updatedAt!: Date;
}
