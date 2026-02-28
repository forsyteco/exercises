import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenIssuerPort } from '@/modules/auth/application/ports/token-issuer.port';

const TOKEN_EXPIRY = '24h';

@Injectable()
export class JwtTokenIssuer implements TokenIssuerPort {
  constructor(private readonly jwtService: JwtService) {}

  async issue(payload: { sub: string }): Promise<string> {
    return this.jwtService.signAsync(
      { sub: payload.sub },
      { expiresIn: TOKEN_EXPIRY } as Parameters<JwtService['signAsync']>[1],
    );
  }
}
