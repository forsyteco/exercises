import { Module } from '@nestjs/common';
import { UserService } from '@/modules/user/application/user.service';
import { UserController } from '@/modules/user/presenters/http/user.controller';
import { PasswordHasherPort } from '@/modules/user/application/ports/password-hasher.port';
import { BcryptPasswordHasher } from '@/modules/user/infrastructure/crypto/bcrypt-password-hasher';
import { OrmUserPersistenceModule } from '@/modules/user/infrastructure/persistence/orm-persistence.module';
import { OrmOrganisationPersistenceModule } from '@/modules/organisation/infrastructure/persistence/orm-persistence.module';

@Module({
  imports: [OrmUserPersistenceModule, OrmOrganisationPersistenceModule],
  controllers: [UserController],
  providers: [
    UserService,
    { provide: PasswordHasherPort, useClass: BcryptPasswordHasher },
  ],
  exports: [UserService],
})
export class UserModule {}
