import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OrganisationRepositoryPort } from '@/modules/organisation/application/ports/organisation.repository.port';
import { OrganisationFactory } from '@/modules/organisation/domain/factories/organisation.factory';
import { OrganisationDto } from '@/modules/organisation/presenters/http/dto/organisation.dto';
import { OrganisationFormDto } from '@/modules/organisation/presenters/http/dto/organisation-form.dto';

@Injectable()
export class OrganisationService {
  constructor(
    private readonly organisationRepo: OrganisationRepositoryPort,
    private readonly organisationFactory: OrganisationFactory,
  ) {}

  async list(): Promise<OrganisationDto[]> {
    const list = await this.organisationRepo.findMany();
    return list.map((o) => this.toDto(o));
  }

  async findByIdOrSlug(idOrSlug: string): Promise<OrganisationDto> {
    const organisation = await this.organisationRepo.findByIdOrSlug(idOrSlug);
    if (!organisation) {
      throw new NotFoundException('Organisation not found');
    }
    return this.toDto(organisation);
  }

  async create(dto: OrganisationFormDto): Promise<OrganisationDto> {
    const existing = await this.organisationRepo.findByIdOrSlug(dto.slug);
    if (existing) {
      throw new ConflictException('An organisation with this slug already exists.');
    }
    const organisation = this.organisationFactory.create(dto.name, dto.slug);
    const saved = await this.organisationRepo.save(organisation);
    return this.toDto(saved);
  }

  private toDto(o: { id: string; name: string; slug: string }): OrganisationDto {
    return plainToInstance(
      OrganisationDto,
      { id: o.id, name: o.name, slug: o.slug },
      { excludeExtraneousValues: true },
    );
  }
}
