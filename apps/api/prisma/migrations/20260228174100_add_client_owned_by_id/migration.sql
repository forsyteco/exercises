-- AlterTable
ALTER TABLE "clients" ADD COLUMN "owned_by_id" TEXT;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_owned_by_id_fkey" FOREIGN KEY ("owned_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
