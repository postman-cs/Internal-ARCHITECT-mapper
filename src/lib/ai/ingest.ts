/**
 * AI Ingestion Pipeline — Standalone Stub (No Embeddings)
 *
 * Keeps the same interface as the full AI_pipeline version but:
 * - Skips OpenAI embedding generation
 * - Stores DocumentChunks via normal Prisma create (no pgvector raw SQL)
 * - Logs a stub message instead of generating embeddings
 */

import { prisma } from "@/lib/prisma";
import { chunkText } from "./chunker";
import { createHash } from "crypto";
import type { Prisma } from "@prisma/client";

export interface IngestDocumentInput {
  projectId: string;
  sourceType: string;
  title?: string;
  rawText: string;
  metadata?: Record<string, unknown>;
  externalId?: string;
}

export interface IngestResult {
  documentId: string;
  chunkCount: number;
  evidenceLabels: string[];
  skipped: boolean;
  skipReason?: string;
}

function computeContentHash(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

async function getNextEvidenceNumber(projectId: string): Promise<number> {
  const result = await prisma.documentChunk.findFirst({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    select: { evidenceLabel: true },
  });

  if (!result) return 1;

  const match = result.evidenceLabel.match(/EVIDENCE-(\d+)/);
  return match ? parseInt(match[1], 10) + 1 : 1;
}

export async function ingestDocument(
  input: IngestDocumentInput
): Promise<IngestResult> {
  const { projectId, sourceType, title, rawText, metadata, externalId } = input;

  console.log("[ingest-stub] Skipping embeddings — standalone mode");

  // 1. Content hash for dedup
  const contentHash = computeContentHash(rawText);

  // 2. Check for exact content duplicate
  const existing = await prisma.sourceDocument.findFirst({
    where: { projectId, contentHash },
    select: { id: true },
  });

  if (existing) {
    const existingChunkCount = await prisma.documentChunk.count({
      where: { documentId: existing.id },
    });

    if (existingChunkCount > 0) {
      return {
        documentId: existing.id,
        chunkCount: 0,
        evidenceLabels: [],
        skipped: true,
        skipReason: `Duplicate content (hash: ${contentHash.slice(0, 12)}...)`,
      };
    }

    // Orphaned document — remove it so we can re-ingest
    console.info("[ingest-stub] Deleting orphaned SourceDocument (0 chunks):", existing.id);
    await prisma.sourceDocument.delete({ where: { id: existing.id } });
  }

  // 3. Store raw document with hash
  const doc = await prisma.sourceDocument.create({
    data: {
      projectId,
      sourceType,
      externalId: externalId || null,
      contentHash,
      title: title || null,
      rawText,
      metadataJson: (metadata as Prisma.InputJsonValue) ?? undefined,
    },
  });

  // 4. Chunk text
  const chunks = chunkText(rawText);
  if (chunks.length === 0) {
    console.warn("[ingest-stub] chunkText returned 0 chunks for non-empty text", {
      docId: doc.id,
      rawTextLength: rawText.length,
    });
    return { documentId: doc.id, chunkCount: 0, evidenceLabels: [], skipped: false };
  }

  // 5. Assign evidence labels and store chunks (NO embeddings)
  let nextEvNum = await getNextEvidenceNumber(projectId);
  const evidenceLabels: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const label = `EVIDENCE-${nextEvNum}`;
    evidenceLabels.push(label);
    nextEvNum++;

    await prisma.documentChunk.create({
      data: {
        id: `${doc.id}-${i}`,
        documentId: doc.id,
        projectId,
        content: chunks[i].content,
        tokenCount: chunks[i].tokenCount,
        evidenceLabel: label,
      },
    });
  }

  return {
    documentId: doc.id,
    chunkCount: chunks.length,
    evidenceLabels,
    skipped: false,
  };
}

export async function ingestDocuments(
  inputs: IngestDocumentInput[]
): Promise<IngestResult[]> {
  const results: IngestResult[] = [];
  for (const input of inputs) {
    results.push(await ingestDocument(input));
  }
  return results;
}
