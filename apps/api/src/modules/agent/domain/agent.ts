export class Agent {
  constructor(
    public readonly id: string,
    public readonly organisationId: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly model: string,
    public readonly description: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
