import { User } from '@/modules/user/domain/user';
import type { User as PrismaUser } from '@prisma/client';

export class UserMapper {
  static toDomain(record: PrismaUser): User {
    return new User(
      record.id,
      record.organisationId,
      record.name,
      record.email,
      record.status,
      record.createdAt,
      record.updatedAt,
      record.verifiedAt,
      record.password,
    );
  }
}
