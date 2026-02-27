import { Agent } from '@/modules/agent/domain/agent';
import { Agent as PrismaAgent } from '@prisma/client';

export class AgentMapper {
  static toDomain(record: PrismaAgent): Agent {
    return new Agent(
      record.id,
      record.organisationId,
      record.name,
      record.slug,
      record.model,
      record.description,
      record.createdAt,
      record.updatedAt,
    );
  }
}
