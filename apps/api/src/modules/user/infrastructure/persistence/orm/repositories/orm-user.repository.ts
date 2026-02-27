import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '@/modules/prisma/prisma.service';
import { IdGenerator } from '@/utils/id-generator';
import {
  UserRepositoryPort,
  CreateUserData,
  UpdateUserData,
} from '@/modules/user/application/ports/user.repository.port';
import { User } from '@/modules/user/domain/user';
import { UserMapper } from '@/modules/user/infrastructure/persistence/orm/mappers/user.mapper';

export const USER_ID_GENERATOR = 'USER_ID_GENERATOR';

@Injectable()
export class OrmUserRepository extends UserRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(USER_ID_GENERATOR) private readonly idGenerator: IdGenerator,
  ) {
    super();
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? UserMapper.toDomain(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    return record ? UserMapper.toDomain(record) : null;
  }

  async findManyByOrganisationId(organisationId: string): Promise<User[]> {
    const records = await this.prisma.user.findMany({
      where: { organisationId },
      orderBy: { name: 'asc' },
    });
    return records.map(UserMapper.toDomain);
  }

  async create(data: CreateUserData): Promise<User> {
    const id = this.idGenerator.randomId();
    const record = await this.prisma.user.create({
      data: {
        id,
        organisationId: data.organisationId,
        name: data.name,
        email: data.email,
        password: data.password,
        status: data.status as 'active' | 'inactive',
      },
    });
    return UserMapper.toDomain(record);
  }

  async update(id: string, data: UpdateUserData): Promise<User> {
    const updateInput: { name?: string; email?: string; password?: string; status?: 'active' | 'inactive'; verifiedAt?: Date | null } = {};
    if (data.name !== undefined) updateInput.name = data.name;
    if (data.email !== undefined) updateInput.email = data.email;
    if (data.password !== undefined) updateInput.password = data.password;
    if (data.status !== undefined) updateInput.status = data.status as 'active' | 'inactive';
    if (data.verifiedAt !== undefined) updateInput.verifiedAt = data.verifiedAt;

    const record = await this.prisma.user.update({
      where: { id },
      data: updateInput,
    });
    return UserMapper.toDomain(record);
  }
}
