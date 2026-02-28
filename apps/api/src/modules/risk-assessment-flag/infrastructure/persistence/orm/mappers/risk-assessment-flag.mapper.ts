import { RiskAssessmentFlag } from '@/modules/risk-assessment-flag/domain/risk-assessment-flag';
import { RiskAssessmentFlag as PrismaRiskAssessmentFlag } from '@prisma/client';

export class RiskAssessmentFlagMapper {
  static toDomain(record: PrismaRiskAssessmentFlag): RiskAssessmentFlag {
    return new RiskAssessmentFlag(
      record.id,
      record.organisationId,
      record.riskAssessmentId,
      record.name,
      record.description,
      record.status,
      record.acceptedAt,
      record.acceptedById,
      record.createdAt,
      record.updatedAt,
    );
  }
}
