import { Module } from '@nestjs/common';
import { IdGenerator } from '@/utils/id-generator';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { OrganisationRepositoryPort } from '@/modules/organisation/application/ports/organisation.repository.port';
import { OrmOrganisationRepository, ORGANISATION_ID_GENERATOR } from '@/modules/organisation/infrastructure/persistence/orm/repositories/orm-organisation.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: ORGANISATION_ID_GENERATOR, useFactory: () => new IdGenerator('org') },
    { provide: OrganisationRepositoryPort, useClass: OrmOrganisationRepository },
  ],
  exports: [OrganisationRepositoryPort],
})
export class OrmOrganisationPersistenceModule {}
