import { User } from '@/modules/user/domain/user';

export interface CreateUserData {
  organisationId: string;
  name: string;
  email: string;
  status: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  status?: string;
  verifiedAt?: Date | null;
}

export abstract class UserRepositoryPort {
  abstract findById(id: string): Promise<User | null>;
  abstract findManyByOrganisationId(organisationId: string): Promise<User[]>;
  abstract create(data: CreateUserData): Promise<User>;
  abstract update(id: string, data: UpdateUserData): Promise<User>;
}
