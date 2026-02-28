import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '@/modules/user/application/user.service';
import { UserDto } from '@/modules/user/presenters/http/dto/user.dto';

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
}
