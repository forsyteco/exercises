-- DropForeignKey
ALTER TABLE "risk_assessment_flags" DROP CONSTRAINT "risk_assessment_flags_matter_risk_assessment_id_fkey";

-- DropIndex
DROP INDEX "risk_assessment_flags_matter_risk_assessment_id_idx";

-- AlterTable: rename columns on risk_assessment_flags
ALTER TABLE "risk_assessment_flags" RENAME COLUMN "matter_risk_assessment_id" TO "risk_assessment_id";
ALTER TABLE "risk_assessment_flags" RENAME COLUMN "flag_name" TO "name";
ALTER TABLE "risk_assessment_flags" RENAME COLUMN "flag_description" TO "description";

-- CreateIndex
CREATE INDEX "risk_assessment_flags_risk_assessment_id_idx" ON "risk_assessment_flags"("risk_assessment_id");

-- AddForeignKey
ALTER TABLE "risk_assessment_flags" ADD CONSTRAINT "risk_assessment_flags_risk_assessment_id_fkey" FOREIGN KEY ("risk_assessment_id") REFERENCES "risk_assessments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
