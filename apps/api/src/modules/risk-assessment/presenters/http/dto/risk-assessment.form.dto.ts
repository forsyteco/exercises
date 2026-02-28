import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, MinLength } from 'class-validator';
import { RiskLevel } from '@/common/enums/risk-level.enum';
import { RiskAssessmentStatus } from '@/common/enums/risk-assessment-status.enum';

export class CreateRiskAssessmentFormDto {
  @ApiProperty({ minLength: 1, description: 'Client ID' })
  @IsString()
  @MinLength(1)
  clientId!: string;

  @ApiProperty({ minLength: 1, description: 'Matter ID' })
  @IsString()
  @MinLength(1)
  matterId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  ownerId?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedToId?: string | null;

  @ApiPropertyOptional({ enum: RiskLevel })
  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel | null;
}

export class UpdateRiskAssessmentFormDto extends PartialType(CreateRiskAssessmentFormDto) {
  @ApiPropertyOptional({ enum: RiskAssessmentStatus })
  @IsOptional()
  @IsEnum(RiskAssessmentStatus)
  status?: RiskAssessmentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  version?: number;
}
