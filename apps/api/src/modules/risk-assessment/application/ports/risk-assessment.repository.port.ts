import { RiskAssessment } from '@/modules/risk-assessment/domain/risk-assessment';

export interface CreateRiskAssessmentData {
  organisationId: string;
  clientId: string;
  matterId: string;
  ownerId?: string | null;
  assignedToId?: string | null;
  riskLevel?: string | null;
}

export abstract class RiskAssessmentRepositoryPort {
  abstract findById(id: string): Promise<RiskAssessment | null>;
  abstract findManyByOrganisationIdOrSlug(organisationIdOrSlug: string): Promise<RiskAssessment[]>;
  abstract getOrganisationIdByIdOrSlug(organisationIdOrSlug: string): Promise<string | null>;
  abstract create(data: CreateRiskAssessmentData): Promise<RiskAssessment>;
  abstract update(id: string, patch: Partial<RiskAssessment>): Promise<RiskAssessment>;
  abstract delete(id: string): Promise<void>;
}
