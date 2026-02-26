import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenIssuerPort } from '@/modules/auth/application/ports/token-issuer.port';

@Injectable()
export class JwtTokenIssuer implements TokenIssuerPort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async issue(payload: { sub: string }, expiry?: string): Promise<string> {
    const defaultExpiry = this.config.get<string>('AUTH_TOKEN_EXPIRY');
    // JWT signAsync accepts expiresIn as string (e.g. "60s", "24h") at runtime
    return this.jwtService.signAsync(
      { sub: payload.sub },
      { expiresIn: expiry ?? defaultExpiry } as Parameters<JwtService['signAsync']>[1],
    );
  }
}
