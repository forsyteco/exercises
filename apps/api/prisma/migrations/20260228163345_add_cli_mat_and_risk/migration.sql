-- CreateEnum
CREATE TYPE "RiskAssessmentStatus" AS ENUM ('in_progress', 'completed');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "RiskAssessmentFlagStatus" AS ENUM ('pending', 'accepted');

-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('individual', 'business');

-- CreateEnum
CREATE TYPE "MatterStatus" AS ENUM ('active', 'closed', 'pending');

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "type" "ClientType" NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matters" (
    "id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "MatterStatus" NOT NULL,
    "type" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_assessments" (
    "id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "matter_id" TEXT NOT NULL,
    "status" "RiskAssessmentStatus" NOT NULL DEFAULT 'in_progress',
    "version" INTEGER NOT NULL DEFAULT 1,
    "owner_id" TEXT,
    "assigned_to" TEXT,
    "risk_level" "RiskLevel",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "risk_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_assessment_flags" (
    "id" TEXT NOT NULL,
    "organisation_id" TEXT NOT NULL,
    "matter_risk_assessment_id" TEXT,
    "flag_name" TEXT,
    "flag_description" TEXT,
    "status" "RiskAssessmentFlagStatus" NOT NULL DEFAULT 'pending',
    "accepted_at" TIMESTAMP(3),
    "accepted_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "risk_assessment_flags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clients_organisation_id_idx" ON "clients"("organisation_id");

-- CreateIndex
CREATE INDEX "matters_organisation_id_idx" ON "matters"("organisation_id");

-- CreateIndex
CREATE INDEX "matters_client_id_idx" ON "matters"("client_id");

-- CreateIndex
CREATE INDEX "risk_assessments_client_id_idx" ON "risk_assessments"("client_id");

-- CreateIndex
CREATE INDEX "risk_assessments_matter_id_idx" ON "risk_assessments"("matter_id");

-- CreateIndex
CREATE INDEX "risk_assessment_flags_matter_risk_assessment_id_idx" ON "risk_assessment_flags"("matter_risk_assessment_id");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matters" ADD CONSTRAINT "matters_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matters" ADD CONSTRAINT "matters_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_assessments" ADD CONSTRAINT "risk_assessments_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_assessments" ADD CONSTRAINT "risk_assessments_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_assessments" ADD CONSTRAINT "risk_assessments_matter_id_fkey" FOREIGN KEY ("matter_id") REFERENCES "matters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_assessment_flags" ADD CONSTRAINT "risk_assessment_flags_organisation_id_fkey" FOREIGN KEY ("organisation_id") REFERENCES "organisations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_assessment_flags" ADD CONSTRAINT "risk_assessment_flags_matter_risk_assessment_id_fkey" FOREIGN KEY ("matter_risk_assessment_id") REFERENCES "risk_assessments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
