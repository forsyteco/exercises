import { Module } from '@nestjs/common';
import { UserService } from '@/modules/user/application/user.service';
import { UserController } from '@/modules/user/presenters/http/user.controller';
import { OrmUserPersistenceModule } from '@/modules/user/infrastructure/persistence/orm-persistence.module';
import { OrmOrganisationPersistenceModule } from '@/modules/organisation/infrastructure/persistence/orm-persistence.module';

@Module({
  imports: [OrmUserPersistenceModule, OrmOrganisationPersistenceModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
