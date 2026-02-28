import { Module } from '@nestjs/common';
import { IdGenerator } from '@/utils/id-generator';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { RiskAssessmentFlagRepositoryPort } from '@/modules/risk-assessment-flag/application/ports/risk-assessment-flag.repository.port';
import {
  OrmRiskAssessmentFlagRepository,
  RISK_ASSESSMENT_FLAG_ID_GENERATOR,
} from '@/modules/risk-assessment-flag/infrastructure/persistence/orm/repositories/orm-risk-assessment-flag.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: RISK_ASSESSMENT_FLAG_ID_GENERATOR, useFactory: () => new IdGenerator('rif') },
    { provide: RiskAssessmentFlagRepositoryPort, useClass: OrmRiskAssessmentFlagRepository },
  ],
  exports: [RiskAssessmentFlagRepositoryPort],
})
export class OrmRiskAssessmentFlagPersistenceModule {}
