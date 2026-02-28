import { RiskAssessment } from '@/modules/risk-assessment/domain/risk-assessment';
import { RiskAssessment as PrismaRiskAssessment } from '@prisma/client';

export class RiskAssessmentMapper {
  static toDomain(record: PrismaRiskAssessment): RiskAssessment {
    return new RiskAssessment(
      record.id,
      record.organisationId,
      record.clientId,
      record.matterId,
      record.status,
      record.version,
      record.ownedById,
      record.assignedToId,
      record.riskLevel,
      record.createdAt,
      record.updatedAt,
    );
  }
}
