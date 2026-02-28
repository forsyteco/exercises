import { Module } from '@nestjs/common';
import { ClientService } from '@/modules/client/application/client.service';
import { ClientController } from '@/modules/client/presenters/http/client.controller';
import { OrmClientPersistenceModule } from '@/modules/client/infrastructure/persistence/orm-persistence.module';

@Module({
  imports: [OrmClientPersistenceModule],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService],
})
export class ClientModule {}
