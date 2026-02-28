import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@/modules/auth/auth.module';
import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';
import { AgentModule } from '@/modules/agent/agent.module';
import { OrganisationModule } from '@/modules/organisation/organisation.module';
import { UserModule } from '@/modules/user/user.module';
import { RiskAssessmentModule } from '@/modules/risk-assessment/risk-assessment.module';
import { RiskAssessmentFlagModule } from '@/modules/risk-assessment-flag/risk-assessment-flag.module';
import { ClientModule } from '@/modules/client/client.module';
import { MatterModule } from '@/modules/matter/matter.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    AgentModule,
    OrganisationModule,
    UserModule,
    RiskAssessmentModule,
    RiskAssessmentFlagModule,
    ClientModule,
    MatterModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
