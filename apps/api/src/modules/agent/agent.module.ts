import { Module } from '@nestjs/common';
import { AgentService } from '@/modules/agent/application/agent.service';
import { AgentController } from '@/modules/agent/presenters/http/agent.controller';
import { OrmAgentPersistenceModule } from '@/modules/agent/infrastructure/persistence/orm-persistence.module';

@Module({
  imports: [OrmAgentPersistenceModule],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}

