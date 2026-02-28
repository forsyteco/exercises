import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { RiskAssessmentFlagStatus } from '@/common/enums/risk-assessment-flag-status.enum';

export class RiskAssessmentFlagDto {
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

  @ApiPropertyOptional()
  @Expose()
  riskAssessmentId?: string | null;

  @ApiPropertyOptional()
  @Expose()
  name?: string | null;

  @ApiPropertyOptional()
  @Expose()
  description?: string | null;

  @ApiProperty({ enum: RiskAssessmentFlagStatus })
  @IsEnum(RiskAssessmentFlagStatus)
  @Expose()
  status!: RiskAssessmentFlagStatus;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @Expose()
  @Type(() => Date)
  acceptedAt?: Date | null;

  @ApiPropertyOptional()
  @Expose()
  acceptedById?: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @Expose()
  @Type(() => Date)
  updatedAt!: Date;
}
