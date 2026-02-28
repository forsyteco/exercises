export class RiskAssessmentFlag {
  constructor(
    public readonly id: string,
    public readonly organisationId: string,
    public readonly riskAssessmentId: string | null,
    public readonly name: string | null,
    public readonly description: string | null,
    public readonly status: string,
    public readonly acceptedAt: Date | null,
    public readonly acceptedById: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
