export class User {
  constructor(
    public readonly id: string,
    public readonly organisationId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly verifiedAt: Date | null,
    /** Not exposed in API responses; only used for persistence mapping. */
    public readonly password?: string,
  ) {}
}
