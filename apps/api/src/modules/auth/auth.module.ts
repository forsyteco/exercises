import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '@/modules/auth/application/auth.service';
import { TokenIssuerPort } from '@/modules/auth/application/ports/token-issuer.port';
import { AuthController } from '@/modules/auth/presenters/http/auth.controller';
import { JwtTokenIssuer } from '@/modules/auth/infrastructure/token/jwt-token-issuer';
import { JwtStrategy } from '@/modules/auth/infrastructure/strategies/jwt.strategy';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'exercise-secret-change-in-production'),
        signOptions: { algorithm: 'HS256' as const },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    { provide: TokenIssuerPort, useClass: JwtTokenIssuer },
  ],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
