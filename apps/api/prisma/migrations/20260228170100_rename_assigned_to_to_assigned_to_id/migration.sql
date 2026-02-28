-- AlterTable
ALTER TABLE "risk_assessments" RENAME COLUMN "assigned_to" TO "assigned_to_id";

-- AlterTable: owner_id -> owned_by_id
ALTER TABLE "matters" RENAME COLUMN "owner_id" TO "owned_by_id";
ALTER TABLE "risk_assessments" RENAME COLUMN "owner_id" TO "owned_by_id";
