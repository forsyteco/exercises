import { Module } from '@nestjs/common';
import { AgentService } from '@/modules/agent/application/agent.service';
import { AgentController } from '@/modules/agent/presenters/http/agent.controller';
import { PrismaModule } from '@/modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}

