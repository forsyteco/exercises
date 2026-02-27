import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@/modules/auth/auth.module';
import { AgentModule } from '@/modules/agent/agent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
