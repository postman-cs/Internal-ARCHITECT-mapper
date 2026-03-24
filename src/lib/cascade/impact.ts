export async function runImpactAnalysis(projectId: string, snapshotId: string, trigger: string) {
  console.log("[impact-stub] Impact analysis skipped in standalone mode", { projectId, snapshotId, trigger });
  return {
    jobId: "stub",
    snapshotId,
    impactedPhases: ["DISCOVERY", "CURRENT_TOPOLOGY"] as string[],
    dirtyArtifacts: [],
    virtualDirty: [],
  };
}
