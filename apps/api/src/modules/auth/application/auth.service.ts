import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { LoginCommand } from '@/modules/auth/application/commands/login.command';
import { TokenIssuerPort } from '@/modules/auth/application/ports/token-issuer.port';
import { LoginResponseDto } from '@/modules/auth/presenters/http/dto/login-response.dto';
import { UserService } from '@/modules/user/application/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenIssuer: TokenIssuerPort,
    private readonly userService: UserService,
  ) {}

  async login(command: LoginCommand): Promise<LoginResponseDto> {
    const user = await this.userService.validateCredentials(command.email, command.password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.tokenIssuer.issue(
      { sub: user.id },
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
