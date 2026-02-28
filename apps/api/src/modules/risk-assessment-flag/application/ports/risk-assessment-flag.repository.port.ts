import { RiskAssessmentFlag } from '@/modules/risk-assessment-flag/domain/risk-assessment-flag';

export interface CreateRiskAssessmentFlagData {
  organisationId: string;
  riskAssessmentId?: string | null;
  name?: string | null;
  description?: string | null;
}

export abstract class RiskAssessmentFlagRepositoryPort {
  abstract findById(id: string): Promise<RiskAssessmentFlag | null>;
  abstract findManyByOrganisationIdOrSlug(organisationIdOrSlug: string): Promise<RiskAssessmentFlag[]>;
  abstract findManyByRiskAssessmentId(riskAssessmentId: string): Promise<RiskAssessmentFlag[]>;
  abstract getOrganisationIdByIdOrSlug(organisationIdOrSlug: string): Promise<string | null>;
  abstract create(data: CreateRiskAssessmentFlagData): Promise<RiskAssessmentFlag>;
  abstract update(id: string, patch: Partial<RiskAssessmentFlag>): Promise<RiskAssessmentFlag>;
  abstract delete(id: string): Promise<void>;
}
