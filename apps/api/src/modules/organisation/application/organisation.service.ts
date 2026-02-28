import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OrganisationRepositoryPort } from '@/modules/organisation/application/ports/organisation.repository.port';
import { OrganisationDto } from '@/modules/organisation/presenters/http/dto/organisation.dto';

@Injectable()
export class OrganisationService {
  constructor(private readonly organisationRepo: OrganisationRepositoryPort) {}

  async list(): Promise<OrganisationDto[]> {
    const list = await this.organisationRepo.findMany();
    return list.map((o) => this.toDto(o));
  }

  async findByIdOrSlug(organisationIdOrSlug: string): Promise<OrganisationDto> {
    const organisation = await this.organisationRepo.findByIdOrSlug(organisationIdOrSlug);
    if (!organisation) {
      throw new NotFoundException('Organisation not found');
    }
    return this.toDto(organisation);
  }

  private toDto(o: { id: string; name: string; slug: string }): OrganisationDto {
    return plainToInstance(
      OrganisationDto,
      { id: o.id, name: o.name, slug: o.slug },
      { excludeExtraneousValues: true },
    );
  }
}
