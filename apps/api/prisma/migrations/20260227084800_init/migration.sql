-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentSession" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "organisationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "sequenceId" INTEGER NOT NULL,
    "content" JSONB,
    "variables" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentVariable" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentVariable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agent_slug_key" ON "Agent"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_model_key" ON "Agent"("model");

-- CreateIndex
CREATE INDEX "AgentSession_agentId_idx" ON "AgentSession"("agentId");

-- CreateIndex
CREATE INDEX "AgentMessage_sessionId_idx" ON "AgentMessage"("sessionId");

-- CreateIndex
CREATE INDEX "AgentVariable_sessionId_idx" ON "AgentVariable"("sessionId");

-- AddForeignKey
ALTER TABLE "AgentSession" ADD CONSTRAINT "AgentSession_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentMessage" ADD CONSTRAINT "AgentMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AgentSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentVariable" ADD CONSTRAINT "AgentVariable_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AgentSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
