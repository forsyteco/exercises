import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MatterRepositoryPort } from '@/modules/matter/application/ports/matter.repository.port';
import { Matter } from '@/modules/matter/domain/matter';
import { MatterDto } from '@/modules/matter/presenters/http/dto/matter.dto';
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
