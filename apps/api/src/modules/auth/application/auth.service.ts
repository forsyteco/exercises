import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { LoginCommand } from '@/modules/auth/application/commands/login.command';
import { TokenIssuerPort } from '@/modules/auth/application/ports/token-issuer.port';
import { LoginResponseDto } from '@/modules/auth/presenters/http/dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenIssuer: TokenIssuerPort,
    private readonly config: ConfigService,
  ) {}

  async login(command: LoginCommand): Promise<LoginResponseDto> {
    const validEmail = this.config.get<string>('AUTH_LOGIN_EMAIL');
    const validPassword = this.config.get<string>('AUTH_LOGIN_PASSWORD');

    if (command.email !== validEmail || command.password !== validPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.tokenIssuer.issue(
      { sub: command.email },
      command.expiry,
    );
    
    return this.toLoginResponseDto(accessToken);
  }

  private toLoginResponseDto(accessToken: string): LoginResponseDto {
    return plainToInstance(LoginResponseDto, { accessToken }, {
      excludeExtraneousValues: true,
    });
  }
}
