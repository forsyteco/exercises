import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClientRepositoryPort } from '@/modules/client/application/ports/client.repository.port';
import { Client } from '@/modules/client/domain/client';
import { ClientDto } from '@/modules/client/presenters/http/dto/client.dto';
import { CreateClientFormDto } from '@/modules/client/presenters/http/dto/client.form.dto';
import { ClientType } from '@/common/enums/client-type.enum';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepo: ClientRepositoryPort) {}

  async list(organisationIdOrSlug: string): Promise<ClientDto[]> {
    const list = await this.clientRepo.findManyByOrganisationIdOrSlug(organisationIdOrSlug);
    return list.map((c) => this.toClientDto(c));
  }

  async getById(id: string, organisationIdOrSlug: string): Promise<ClientDto> {
    const organisationId = await this.clientRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const client = await this.ensureClient(id);
    if (client.organisationId !== organisationId) {
      throw new NotFoundException('Client not found');
    }
    return this.toClientDto(client);
  }

  async create(organisationIdOrSlug: string, dto: CreateClientFormDto): Promise<ClientDto> {
    const organisationId = await this.clientRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    try {
      const client = await this.clientRepo.create({
        organisationId,
        reference: dto.reference,
        type: dto.type,
        name: dto.name,
      });
      return this.toClientDto(client);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
        throw new ConflictException('A client with this reference already exists.');
      }
      throw error;
    }
  }

  async update(
    id: string,
    organisationIdOrSlug: string,
    dto: { reference?: string; type?: ClientType; name?: string },
  ): Promise<ClientDto> {
    const organisationId = await this.clientRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const existing = await this.ensureClient(id);
    if (existing.organisationId !== organisationId) {
      throw new NotFoundException('Client not found');
    }
    try {
      const updated = await this.clientRepo.update(id, {
        reference: dto.reference,
        type: dto.type,
        name: dto.name,
      });
      return this.toClientDto(updated);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
        throw new ConflictException('Conflict updating client.');
      }
      throw error;
    }
  }

  async delete(id: string, organisationIdOrSlug: string): Promise<void> {
    const organisationId = await this.clientRepo.getOrganisationIdByIdOrSlug(organisationIdOrSlug);
    if (!organisationId) {
      throw new NotFoundException('Organisation not found');
    }
    const existing = await this.ensureClient(id);
    if (existing.organisationId !== organisationId) {
      throw new NotFoundException('Client not found');
    }
    await this.clientRepo.delete(id);
  }

  private async ensureClient(id: string): Promise<Client> {
    const client = await this.clientRepo.findById(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return client;
  }

  private toClientDto(c: Client): ClientDto {
    return plainToInstance(
      ClientDto,
      {
        id: c.id,
        organisationId: c.organisationId,
        reference: c.reference,
        type: c.type as ClientType,
        name: c.name,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      },
      { excludeExtraneousValues: true },
    );
  }
}
