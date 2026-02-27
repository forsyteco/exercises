export class AgentMessage {
  constructor(
    public readonly id: string,
    public readonly organisationId: string,
    public readonly sessionId: string,
    public readonly role: string,
    public readonly sequenceId: number,
    public readonly content: Record<string, unknown> | null,
    public readonly createdAt: Date,
  ) {}
}
