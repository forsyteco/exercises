import { Module } from '@nestjs/common';
import { MatterService } from '@/modules/matter/application/matter.service';
import { MatterController } from '@/modules/matter/presenters/http/matter.controller';
import { OrmMatterPersistenceModule } from '@/modules/matter/infrastructure/persistence/orm-persistence.module';

@Module({
  imports: [OrmMatterPersistenceModule],
  controllers: [MatterController],
  providers: [MatterService],
  exports: [MatterService],
})
export class MatterModule {}
