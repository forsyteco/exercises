import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@/modules/auth/auth.module';
import { AgentModule } from '@/modules/agent/agent.module';
import { OrganisationModule } from '@/modules/organisation/organisation.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    AgentModule,
    OrganisationModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
