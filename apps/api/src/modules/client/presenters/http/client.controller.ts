import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { ClientService } from '@/modules/client/application/client.service';
import { ClientDto } from '@/modules/client/presenters/http/dto/client.dto';

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(':organisationIdOrSlug/clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  @ApiOperation({ summary: 'List clients for the organisation' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiResponse({ status: 200, type: ClientDto, isArray: true })
  async list(@Param('organisationIdOrSlug') organisationIdOrSlug: string): Promise<ClientDto[]> {
    return this.clientService.list(organisationIdOrSlug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a client by id' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: ClientDto })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async getById(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('id') id: string,
  ): Promise<ClientDto> {
    return this.clientService.getById(id, organisationIdOrSlug);
  }
}
