import { Module } from '@nestjs/common';
import { IdGenerator } from '@/utils/id-generator';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { ClientRepositoryPort } from '@/modules/client/application/ports/client.repository.port';
import {
  OrmClientRepository,
  CLIENT_ID_GENERATOR,
} from '@/modules/client/infrastructure/persistence/orm/repositories/orm-client.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: CLIENT_ID_GENERATOR, useFactory: () => new IdGenerator('cli') },
    { provide: ClientRepositoryPort, useClass: OrmClientRepository },
  ],
  exports: [ClientRepositoryPort],
})
export class OrmClientPersistenceModule {}
