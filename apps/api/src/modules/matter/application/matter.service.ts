import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MatterRepositoryPort } from '@/modules/matter/application/ports/matter.repository.port';
import { Matter } from '@/modules/matter/domain/matter';
import { MatterDto } from '@/modules/matter/presenters/http/dto/matter.dto';
import { CreateMatterFormDto } from '@/modules/matter/presenters/http/dto/matter.form.dto';
import { MatterStatus } from '@/common/enums/matter-status.enum';

@Injectable()
export class MatterService {
  constructor(private readonly matterRepo: MatterRepositoryPort) {}

  async list(organisationIdOrSlug: string): Promise<MatterDto[]> {
    const list = await this.matterRepo.findManyByOrganisationIdOrSlug(organisationIdOrSlug);
    return list.map((m) => this.toMatterDto(m));
  }

  async listByClientId(
    organisationIdOrSlug: string,
    clientId: string,
  ): Promise<MatterDto[]> {
    const organisationId = await this.matterRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const list = await this.matterRepo.findManyByClientId(clientId);
    return list
      .filter((m) => m.organisationId === organisationId)
      .map((m) => this.toMatterDto(m));
  }

  async getById(id: string, organisationIdOrSlug: string): Promise<MatterDto> {
    const organisationId = await this.matterRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const matter = await this.ensureMatter(id);
    if (matter.organisationId !== organisationId) {
      throw new NotFoundException('Matter not found');
    }
    return this.toMatterDto(matter);
  }

  async create(organisationIdOrSlug: string, dto: CreateMatterFormDto): Promise<MatterDto> {
    const organisationId = await this.matterRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    try {
      const matter = await this.matterRepo.create({
        organisationId,
        clientId: dto.clientId,
        reference: dto.reference,
        description: dto.description,
        status: dto.status,
        type: dto.type,
        ownerId: dto.ownerId,
      });
      return this.toMatterDto(matter);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
        throw new ConflictException('A matter with this identifier already exists.');
      }
      throw error;
    }
  }

  async update(
    id: string,
    organisationIdOrSlug: string,
    dto: Partial<{
      reference: string;
      description: string;
      status: MatterStatus;
      type: string;
      ownerId: string;
    }>,
  ): Promise<MatterDto> {
    const organisationId = await this.matterRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const existing = await this.ensureMatter(id);
    if (existing.organisationId !== organisationId) {
      throw new NotFoundException('Matter not found');
    }
    try {
      const updated = await this.matterRepo.update(id, {
        reference: dto.reference,
        description: dto.description,
        status: dto.status,
        type: dto.type,
        ownerId: dto.ownerId,
      });
      return this.toMatterDto(updated);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
        throw new ConflictException('Conflict updating matter.');
      }
      throw error;
    }
  }

  async delete(id: string, organisationIdOrSlug: string): Promise<void> {
    const organisationId = await this.matterRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const existing = await this.ensureMatter(id);
    if (existing.organisationId !== organisationId) {
      throw new NotFoundException('Matter not found');
    }
    await this.matterRepo.delete(id);
  }

  private async ensureMatter(id: string): Promise<Matter> {
    const matter = await this.matterRepo.findById(id);
    if (!matter) {
      throw new NotFoundException('Matter not found');
    }
    return matter;
  }

  private toMatterDto(m: Matter): MatterDto {
    return plainToInstance(
      MatterDto,
      {
        id: m.id,
        organisationId: m.organisationId,
        clientId: m.clientId,
        reference: m.reference,
        description: m.description,
        status: m.status as MatterStatus,
        type: m.type,
        ownerId: m.ownerId,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      },
      { excludeExtraneousValues: true },
    );
  }
}
