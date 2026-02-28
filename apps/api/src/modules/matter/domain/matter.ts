export class Matter {
  constructor(
    public readonly id: string,
    public readonly organisationId: string,
    public readonly clientId: string,
    public readonly reference: string,
    public readonly description: string,
    public readonly status: string,
    public readonly type: string,
    public readonly ownerId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
