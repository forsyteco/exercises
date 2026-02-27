export class AgentSession {
  constructor(
    public readonly id: string,
    public readonly organisationId: string,
    public readonly agentId: string,
    public readonly createdAt: Date,
  ) {}
}
