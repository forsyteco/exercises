import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginCommand } from '@/modules/auth/application/commands/login.command';
import { Public } from '@/modules/auth/application/decorators/public.decorator';
import { AuthService } from '@/modules/auth/application/auth.service';
import { LoginFormDto } from '@/modules/auth/presenters/http/dto/login-form.dto';
import { AccessTokenDto } from '@/modules/auth/presenters/http/dto/access-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Obtain an access token' })
  @ApiBody({ type: LoginFormDto })
  @ApiResponse({ status: 201, description: 'Login successful', type: AccessTokenDto })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  async login(@Body() dto: LoginFormDto): Promise<AccessTokenDto> {
    const command = new LoginCommand(dto.email, dto.password);
    return this.authService.login(command);
  }
}
