import { Matter } from '@/modules/matter/domain/matter';
import { Matter as PrismaMatter } from '@prisma/client';

export class MatterMapper {
  static toDomain(record: PrismaMatter): Matter {
    return new Matter(
      record.id,
      record.organisationId,
      record.clientId,
      record.reference,
      record.description,
      record.status,
      record.type,
      record.ownedById,
      record.createdAt,
      record.updatedAt,
    );
  }
}
