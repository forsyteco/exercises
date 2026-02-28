import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ClientRepositoryPort } from '@/modules/client/application/ports/client.repository.port';
import { Client } from '@/modules/client/domain/client';
import { ClientDto } from '@/modules/client/presenters/http/dto/client.dto';
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
        ownedById: c.ownedById,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      },
      { excludeExtraneousValues: true },
    );
  }
}
