import { Module } from '@nestjs/common';
import { IdGenerator } from '@/utils/id-generator';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { MatterRepositoryPort } from '@/modules/matter/application/ports/matter.repository.port';
import {
  OrmMatterRepository,
  MATTER_ID_GENERATOR,
} from '@/modules/matter/infrastructure/persistence/orm/repositories/orm-matter.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: MATTER_ID_GENERATOR, useFactory: () => new IdGenerator('mat') },
    { provide: MatterRepositoryPort, useClass: OrmMatterRepository },
  ],
  exports: [MatterRepositoryPort],
})
export class OrmMatterPersistenceModule {}
