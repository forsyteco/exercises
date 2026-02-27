import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '@/modules/user/application/user.service';
import { UserDto } from '@/modules/user/presenters/http/dto/user.dto';
import { UserFormDto } from '@/modules/user/presenters/http/dto/user-form.dto';
import { UserPutFormDto } from '@/modules/user/presenters/http/dto/user-put-form.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller(':organisationIdOrSlug/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List users in the organisation' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiResponse({ status: 200, type: UserDto, isArray: true })
  async list(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
  ): Promise<UserDto[]> {
    return this.userService.listByOrganisation(organisationIdOrSlug);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'userId', type: String })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 404, description: 'User or organisation not found' })
  async findById(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('userId') userId: string,
  ): Promise<UserDto> {
    return this.userService.findById(organisationIdOrSlug, userId);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Create a user' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiBody({ type: UserFormDto })
  @ApiResponse({ status: 201, type: UserDto })
  @ApiResponse({ status: 404, description: 'Organisation not found' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async create(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Body() dto: UserFormDto,
  ): Promise<UserDto> {
    return this.userService.create(organisationIdOrSlug, dto);
  }

  @Patch(':userId')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'organisationIdOrSlug', type: String })
  @ApiParam({ name: 'userId', type: String })
  @ApiBody({ type: UserPutFormDto })
  @ApiResponse({ status: 200, type: UserDto })
  @ApiResponse({ status: 404, description: 'User or organisation not found' })
  async update(
    @Param('organisationIdOrSlug') organisationIdOrSlug: string,
    @Param('userId') userId: string,
    @Body() dto: UserPutFormDto,
  ): Promise<UserDto> {
    return this.userService.update(organisationIdOrSlug, userId, dto);
  }
}
