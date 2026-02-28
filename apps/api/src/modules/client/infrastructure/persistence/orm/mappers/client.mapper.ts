import { Client } from '@/modules/client/domain/client';
import { Client as PrismaClientModel } from '@prisma/client';

export class ClientMapper {
  static toDomain(record: PrismaClientModel): Client {
    return new Client(
      record.id,
      record.organisationId,
      record.reference,
      record.type,
      record.name,
      record.ownedById,
      record.createdAt,
      record.updatedAt,
    );
  }
}
