import { Module } from '@nestjs/common';
import { IdGenerator } from '@/utils/id-generator';
import { PrismaModule } from '@/modules/prisma/prisma.module';
import { RiskAssessmentRepositoryPort } from '@/modules/risk-assessment/application/ports/risk-assessment.repository.port';
import {
  OrmRiskAssessmentRepository,
  RISK_ASSESSMENT_ID_GENERATOR,
} from '@/modules/risk-assessment/infrastructure/persistence/orm/repositories/orm-risk-assessment.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    { provide: RISK_ASSESSMENT_ID_GENERATOR, useFactory: () => new IdGenerator('ris') },
    { provide: RiskAssessmentRepositoryPort, useClass: OrmRiskAssessmentRepository },
  ],
  exports: [RiskAssessmentRepositoryPort],
})
export class OrmRiskAssessmentPersistenceModule {}
