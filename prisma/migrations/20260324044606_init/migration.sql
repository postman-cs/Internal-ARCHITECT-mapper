-- CreateEnum
CREATE TYPE "Phase" AS ENUM ('DISCOVERY', 'CURRENT_TOPOLOGY', 'DESIRED_FUTURE_STATE', 'SOLUTION_DESIGN', 'INFRASTRUCTURE', 'TEST_DESIGN', 'CRAFT_SOLUTION', 'TEST_SOLUTION', 'DEPLOYMENT_PLAN', 'MONITORING', 'ITERATION', 'MEETINGS', 'WORKING_SESSIONS', 'BUILD_LOG');

-- CreateEnum
CREATE TYPE "ArtifactStatus" AS ENUM ('CLEAN', 'DIRTY', 'STALE', 'NEEDS_REVIEW', 'CLEAN_WITH_EXCEPTIONS');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ADMIRAL', 'CSE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CSE',
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "xpLevel" INTEGER NOT NULL DEFAULT 1,
    "xpStreak" INTEGER NOT NULL DEFAULT 0,
    "lastXpEventAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XpEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "action" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "XpEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "primaryDomain" TEXT,
    "apiDomain" TEXT,
    "publicWorkspaceUrl" TEXT,
    "customerContactName" TEXT,
    "customerContactEmail" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "engagementStage" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "closedWonAt" TIMESTAMP(3),
    "clonedFromId" TEXT,
    "ownerUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "serviceTemplateContent" TEXT,
    "serviceTemplateType" TEXT,
    "serviceTemplateFileName" TEXT,
    "serviceTemplateNotes" TEXT,
    "pocDeliverablesJson" JSONB,
    "architectShareToken" TEXT,
    "architectShareData" JSONB,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceDocument" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "externalId" TEXT,
    "contentHash" TEXT,
    "title" TEXT,
    "rawText" TEXT NOT NULL,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SourceDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentChunk" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tokenCount" INTEGER,
    "evidenceLabel" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscoveryArtifact" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "industry" TEXT,
    "engineeringSize" TEXT,
    "publicApiPresence" TEXT,
    "cloudGatewaySignals" TEXT,
    "hypothesis" TEXT,
    "generatedBriefMarkdown" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscoveryArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvidenceSnapshot" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "chunkIdsJson" JSONB NOT NULL,
    "countsJson" JSONB,
    "hash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvidenceSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhaseArtifact" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "phase" "Phase" NOT NULL,
    "version" INTEGER NOT NULL,
    "status" "ArtifactStatus" NOT NULL DEFAULT 'DIRTY',
    "snapshotId" TEXT,
    "contentJson" JSONB NOT NULL,
    "contentMarkdown" TEXT,
    "lastComputedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhaseArtifact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecomputeJob" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "triggeredBy" TEXT NOT NULL,
    "snapshotId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecomputeJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecomputeTask" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "phase" "Phase" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "inputRefsJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecomputeTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "XpEvent_userId_idx" ON "XpEvent"("userId");

-- CreateIndex
CREATE INDEX "XpEvent_createdAt_idx" ON "XpEvent"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Project_architectShareToken_key" ON "Project"("architectShareToken");

-- CreateIndex
CREATE INDEX "SourceDocument_projectId_externalId_idx" ON "SourceDocument"("projectId", "externalId");

-- CreateIndex
CREATE INDEX "SourceDocument_projectId_sourceType_idx" ON "SourceDocument"("projectId", "sourceType");

-- CreateIndex
CREATE UNIQUE INDEX "SourceDocument_projectId_contentHash_key" ON "SourceDocument"("projectId", "contentHash");

-- CreateIndex
CREATE INDEX "DocumentChunk_projectId_idx" ON "DocumentChunk"("projectId");

-- CreateIndex
CREATE INDEX "DocumentChunk_projectId_evidenceLabel_idx" ON "DocumentChunk"("projectId", "evidenceLabel");

-- CreateIndex
CREATE UNIQUE INDEX "DiscoveryArtifact_projectId_version_key" ON "DiscoveryArtifact"("projectId", "version");

-- CreateIndex
CREATE INDEX "EvidenceSnapshot_projectId_idx" ON "EvidenceSnapshot"("projectId");

-- CreateIndex
CREATE INDEX "PhaseArtifact_projectId_phase_idx" ON "PhaseArtifact"("projectId", "phase");

-- CreateIndex
CREATE INDEX "PhaseArtifact_projectId_phase_status_idx" ON "PhaseArtifact"("projectId", "phase", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PhaseArtifact_projectId_phase_version_key" ON "PhaseArtifact"("projectId", "phase", "version");

-- CreateIndex
CREATE INDEX "RecomputeJob_projectId_idx" ON "RecomputeJob"("projectId");

-- CreateIndex
CREATE INDEX "RecomputeTask_jobId_status_idx" ON "RecomputeTask"("jobId", "status");

-- AddForeignKey
ALTER TABLE "XpEvent" ADD CONSTRAINT "XpEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XpEvent" ADD CONSTRAINT "XpEvent_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SourceDocument" ADD CONSTRAINT "SourceDocument_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentChunk" ADD CONSTRAINT "DocumentChunk_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "SourceDocument"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscoveryArtifact" ADD CONSTRAINT "DiscoveryArtifact_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvidenceSnapshot" ADD CONSTRAINT "EvidenceSnapshot_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhaseArtifact" ADD CONSTRAINT "PhaseArtifact_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecomputeJob" ADD CONSTRAINT "RecomputeJob_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecomputeTask" ADD CONSTRAINT "RecomputeTask_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "RecomputeJob"("id") ON DELETE CASCADE ON UPDATE CASCADE;
