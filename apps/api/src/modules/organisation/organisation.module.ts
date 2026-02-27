import { Module } from '@nestjs/common';
import { OrganisationService } from '@/modules/organisation/application/organisation.service';
import { OrganisationController } from '@/modules/organisation/presenters/http/organisation.controller';
import { OrmOrganisationPersistenceModule } from '@/modules/organisation/infrastructure/persistence/orm-persistence.module';
import { OrganisationFactory } from '@/modules/organisation/domain/factories/organisation.factory';
import { IdGenerator } from '@/utils/id-generator';

@Module({
  imports: [OrmOrganisationPersistenceModule],
  controllers: [OrganisationController],
  providers: [
    OrganisationService,
    OrganisationFactory,
    { provide: IdGenerator, useFactory: () => new IdGenerator('org') },
  ],
  exports: [OrganisationService],
})
export class OrganisationModule {}
