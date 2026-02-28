export class Client {
  constructor(
    public readonly id: string,
    public readonly organisationId: string,
    public readonly reference: string,
    public readonly type: string,
    public readonly name: string,
    public readonly ownedById: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
