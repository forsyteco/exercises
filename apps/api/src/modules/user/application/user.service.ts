import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserRepositoryPort } from '@/modules/user/application/ports/user.repository.port';
import { OrganisationRepositoryPort } from '@/modules/organisation/application/ports/organisation.repository.port';
import { UserDto } from '@/modules/user/presenters/http/dto/user.dto';
import { UserFormDto } from '@/modules/user/presenters/http/dto/user-form.dto';
import { UserPutFormDto } from '@/modules/user/presenters/http/dto/user-put-form.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepositoryPort,
    private readonly organisationRepo: OrganisationRepositoryPort,
  ) {}

  async listByOrganisation(organisationIdOrSlug: string): Promise<UserDto[]> {
    const organisationId = await this.resolveOrganisationId(organisationIdOrSlug);
    const users = await this.userRepo.findManyByOrganisationId(organisationId);
    return users.map((u) => this.toDto(u));
  }

  async findById(organisationIdOrSlug: string, userId: string): Promise<UserDto> {
    const organisationId = await this.resolveOrganisationId(organisationIdOrSlug);
    const user = await this.userRepo.findById(userId);
    if (!user || user.organisationId !== organisationId) {
      throw new NotFoundException('User not found');
    }
    return this.toDto(user);
  }

  async create(organisationIdOrSlug: string, dto: UserFormDto): Promise<UserDto> {
    const organisationId = await this.resolveOrganisationId(organisationIdOrSlug);
    try {
      const user = await this.userRepo.create({
        organisationId,
        name: dto.name,
        email: dto.email,
        status: dto.status,
      });
      return this.toDto(user);
    } catch (error: unknown) {
      const prismaError = error as { code?: string };
      if (prismaError?.code === 'P2002') {
        throw new ConflictException('A user with this email already exists.');
      }
      throw error;
    }
  }

  async update(
    organisationIdOrSlug: string,
    userId: string,
    dto: UserPutFormDto,
  ): Promise<UserDto> {
    const organisationId = await this.resolveOrganisationId(organisationIdOrSlug);
    const user = await this.userRepo.findById(userId);
    if (!user || user.organisationId !== organisationId) {
      throw new NotFoundException('User not found');
    }
    const updated = await this.userRepo.update(userId, {
      name: dto.name,
      email: dto.email,
      status: dto.status,
      verifiedAt: dto.verifiedAt,
    });
    return this.toDto(updated);
  }

  private async resolveOrganisationId(organisationIdOrSlug: string): Promise<string> {
    const organisation = await this.organisationRepo.findByIdOrSlug(organisationIdOrSlug);
    if (!organisation) {
      throw new NotFoundException('Organisation not found');
    }
    return organisation.id;
  }

  private toDto(u: {
    id: string;
    name: string;
    email: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    verifiedAt: Date | null;
  }): UserDto {
    return plainToInstance(
      UserDto,
      {
        id: u.id,
        name: u.name,
        email: u.email,
        status: u.status,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        verifiedAt: u.verifiedAt,
      },
      { excludeExtraneousValues: true },
    );
  }
}
