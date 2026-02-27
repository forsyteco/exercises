import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginCommand } from '@/modules/auth/application/commands/login.command';
import { Public } from '@/modules/auth/application/decorators/public.decorator';
import { AuthService } from '@/modules/auth/application/auth.service';
import { LoginRequestDto } from '@/modules/auth/presenters/http/dto/login-request.dto';
import { LoginResponseDto } from '@/modules/auth/presenters/http/dto/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Obtain an access token' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ status: 201, description: 'Login successful', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  async login(@Body() dto: LoginRequestDto): Promise<LoginResponseDto> {
    const command = new LoginCommand(dto.email, dto.password, dto.expiry);
    return this.authService.login(command);
  }
}
