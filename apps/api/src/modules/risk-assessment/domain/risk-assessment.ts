export class RiskAssessment {
  constructor(
    public readonly id: string,
    public readonly organisationId: string,
    public readonly clientId: string,
    public readonly matterId: string,
    public readonly status: string,
    public readonly version: number,
    public readonly ownedById: string | null,
    public readonly assignedToId: string | null,
    public readonly riskLevel: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
