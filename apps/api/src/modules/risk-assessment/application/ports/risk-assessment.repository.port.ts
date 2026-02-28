import { RiskAssessment } from '@/modules/risk-assessment/domain/risk-assessment';

/** Risk assessment with client and matter context for computing virtual description */
export interface RiskAssessmentWithDescriptionContext {
  riskAssessment: RiskAssessment;
  clientName: string;
  matterDescription: string;
}

export interface CreateRiskAssessmentData {
  organisationId: string;
  clientId: string;
  matterId: string;
  ownedById?: string | null;
  assignedToId?: string | null;
  riskLevel?: string | null;
}

export abstract class RiskAssessmentRepositoryPort {
  abstract findById(id: string): Promise<RiskAssessment | null>;
  abstract findByIdWithClientAndMatter(id: string): Promise<RiskAssessmentWithDescriptionContext | null>;
  abstract findManyByOrganisationIdOrSlug(organisationIdOrSlug: string): Promise<RiskAssessment[]>;
  abstract findManyByOrganisationIdOrSlugWithClientAndMatter(
    organisationIdOrSlug: string,
  ): Promise<RiskAssessmentWithDescriptionContext[]>;
  abstract getOrganisationIdByIdOrSlug(organisationIdOrSlug: string): Promise<string | null>;
  abstract create(data: CreateRiskAssessmentData): Promise<RiskAssessment>;
  abstract update(id: string, patch: Partial<RiskAssessment>): Promise<RiskAssessment>;
  abstract delete(id: string): Promise<void>;
}
