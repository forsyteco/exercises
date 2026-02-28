import { Module } from '@nestjs/common';
import { RiskAssessmentService } from '@/modules/risk-assessment/application/risk-assessment.service';
import { RiskAssessmentController } from '@/modules/risk-assessment/presenters/http/risk-assessment.controller';
import { OrmRiskAssessmentPersistenceModule } from '@/modules/risk-assessment/infrastructure/persistence/orm-persistence.module';

@Module({
  imports: [OrmRiskAssessmentPersistenceModule],
  controllers: [RiskAssessmentController],
  providers: [RiskAssessmentService],
  exports: [RiskAssessmentService],
})
export class RiskAssessmentModule {}
