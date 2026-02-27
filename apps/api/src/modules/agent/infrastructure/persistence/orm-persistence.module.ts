import { Module } from '@nestjs/common';
import { IdGenerator } from '@/utils/id-generator';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { AgentRepositoryPort } from '@/modules/agent/application/ports/agent.repository.port';
import { AgentSessionRepositoryPort } from '@/modules/agent/application/ports/agent-session.repository.port';
import { AgentMessageRepositoryPort } from '@/modules/agent/application/ports/agent-message.repository.port';
import { OrmAgentRepository } from '@/modules/agent/infrastructure/persistence/orm/repositories/orm-agent.repository';
import {
  OrmAgentSessionRepository,
  SESSION_ID_GENERATOR,
} from '@/modules/agent/infrastructure/persistence/orm/repositories/orm-agent-session.repository';
import {
  OrmAgentMessageRepository,
  MESSAGE_ID_GENERATOR,
} from '@/modules/agent/infrastructure/persistence/orm/repositories/orm-agent-message.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: SESSION_ID_GENERATOR, useFactory: () => new IdGenerator('ses') },
    { provide: MESSAGE_ID_GENERATOR, useFactory: () => new IdGenerator('msg') },
    { provide: AgentRepositoryPort, useClass: OrmAgentRepository },
    { provide: AgentSessionRepositoryPort, useClass: OrmAgentSessionRepository },
    { provide: AgentMessageRepositoryPort, useClass: OrmAgentMessageRepository },
  ],
  exports: [
    AgentRepositoryPort,
    AgentSessionRepositoryPort,
    AgentMessageRepositoryPort,
  ],
})
export class OrmAgentPersistenceModule {}
