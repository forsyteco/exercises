import { Module } from '@nestjs/common';
import { IdGenerator } from '@/utils/id-generator';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { OrmOrganisationPersistenceModule } from '@/modules/organisation/infrastructure/persistence/orm-persistence.module';
import { UserRepositoryPort } from '@/modules/user/application/ports/user.repository.port';
import { OrmUserRepository, USER_ID_GENERATOR } from '@/modules/user/infrastructure/persistence/orm/repositories/orm-user.repository';

@Module({
  imports: [PrismaModule, OrmOrganisationPersistenceModule],
  providers: [
    { provide: USER_ID_GENERATOR, useFactory: () => new IdGenerator('usr') },
    { provide: UserRepositoryPort, useClass: OrmUserRepository },
  ],
  exports: [UserRepositoryPort],
})
export class OrmUserPersistenceModule {}
