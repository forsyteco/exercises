import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { ClientService } from '@/modules/client/application/client.service';
import { ClientDto } from '@/modules/client/presenters/http/dto/client.dto';
import {
  CreateClientFormDto,
  UpdateClientFormDto,
} from '@/modules/client/presenters/http/dto/client.form.dto';

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

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create a client' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiBody({ type: CreateClientFormDto })
  @ApiResponse({ status: 201, type: ClientDto })
  async create(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Body() dto: CreateClientFormDto,
  ): Promise<ClientDto> {
    return this.clientService.create(organisationIdOrSlug, dto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Update a client' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateClientFormDto })
  @ApiResponse({ status: 200, type: ClientDto })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async update(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('id') id: string,
    @Body() dto: UpdateClientFormDto,
  ): Promise<ClientDto> {
    return this.clientService.update(id, organisationIdOrSlug, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async delete(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.clientService.delete(id, organisationIdOrSlug);
  }
}
