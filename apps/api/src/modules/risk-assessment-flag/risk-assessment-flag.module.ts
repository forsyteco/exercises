import { Module } from '@nestjs/common';
import { RiskAssessmentFlagService } from '@/modules/risk-assessment-flag/application/risk-assessment-flag.service';
import { RiskAssessmentFlagController } from '@/modules/risk-assessment-flag/presenters/http/risk-assessment-flag.controller';
import { OrmRiskAssessmentFlagPersistenceModule } from '@/modules/risk-assessment-flag/infrastructure/persistence/orm-persistence.module';

@Module({
  imports: [OrmRiskAssessmentFlagPersistenceModule],
  controllers: [RiskAssessmentFlagController],
  providers: [RiskAssessmentFlagService],
  exports: [RiskAssessmentFlagService],
})
export class RiskAssessmentFlagModule {}
