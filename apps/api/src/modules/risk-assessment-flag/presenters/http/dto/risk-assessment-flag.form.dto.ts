import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { RiskAssessmentFlagStatus } from '@/common/enums/risk-assessment-flag-status.enum';

export class CreateRiskAssessmentFlagFormDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  riskAssessmentId?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string | null;
}

export class UpdateRiskAssessmentFlagFormDto extends PartialType(CreateRiskAssessmentFlagFormDto) {
  @ApiPropertyOptional({ enum: RiskAssessmentFlagStatus })
  @IsOptional()
  @IsEnum(RiskAssessmentFlagStatus)
  status?: RiskAssessmentFlagStatus;
}
