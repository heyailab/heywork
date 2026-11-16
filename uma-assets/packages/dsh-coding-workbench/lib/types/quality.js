/** Execution, specification and review state written by the workbench's immutable record updates. */
function evidenceState(overview) {
    const ordered = (values) => [...values].sort((a, b) => a.id.localeCompare(b.id));
    return JSON.stringify({
        workspaceId: overview.workspaceId,
        spec: overview.spec,
        runs: ordered(overview.runs).map(run => [run.id, run.sequence, run.status, run.finishedAt,
            run.before, run.after, run.exitCode, run.specRevision]),
        findings: ordered(overview.findings).map(finding => [finding.id, finding.state, finding.updatedAt, finding.sourceHash]),
        tasks: ordered(overview.tasks).map(task => [task.id, task.state, task.path, task.branch, task.baseCommit]),
        repairs: ordered(overview.repairs).map(repair => [repair.id, repair.status, repair.attempts,
            repair.childSessionId, repair.runIds, repair.finishedAt, repair.error]),
    });
}
/**
 * Evaluate one retained snapshot and reject mixing it with records changed during source reads.
 * @param read - synchronous read of immutable workbench records for the same workspace.
 * @param assess - source-aware assessment of exactly the supplied retained snapshot.
 * @returns a coherent observation, or null after three concurrent changes; read errors propagate.
 */
export async function captureCodingEvidence(read, assess) {
    for (let attempt = 0; attempt < 3; attempt++) {
        const overview = read();
        const before = evidenceState(overview);
        const assessment = await assess(overview);
        if (before !== evidenceState(read()))
            continue;
        return { overview, assessment, quality: computeQualityReport(overview.runs, overview.repairs, overview.findings) };
    }
    return null;
}
/**
 * Aggregate the workspace's settled runs, repairs, and findings into the quality report. Pure so
 * tests pin every metric definition without providers; freshness and readiness live in `assess`,
 * which scans sources — deliberately not here.
 * @param runs - the workspace's retained runs, in any order.
 * @param repairs - the workspace's retained repair requests.
 * @param findings - the workspace's retained review findings.
 * @returns the metrics.
 */
export function computeQualityReport(runs, repairs, findings) {
    const settled = runs.filter(run => run.status !== 'running');
    const passedRuns = settled.filter(run => run.status === 'passed').length;
    const failedRuns = settled.filter(run => run.status === 'failed').length;
    const openFindings = findings.filter(finding => finding.state === 'open');
    return {
        settledRuns: settled.length,
        passedRuns,
        failedRuns,
        abandonedRuns: settled.length - passedRuns - failedRuns,
        passRate: settled.length === 0 ? null : passedRuns / settled.length,
        distinctChecksPassed: new Set(runs.filter(run => run.status === 'passed').map(run => run.name)).size,
        repairCount: repairs.length,
        repairAttempts: repairs.reduce((sum, repair) => sum + repair.attempts, 0),
        repairsPassed: repairs.filter(repair => repair.status === 'passed').length,
        findingsOpen: openFindings.length,
        findingsResolved: findings.filter(finding => finding.state === 'resolved').length,
        findingsDismissed: findings.filter(finding => finding.state === 'dismissed').length,
        openBySeverity: {
            critical: openFindings.filter(finding => finding.severity === 'critical').length,
            high: openFindings.filter(finding => finding.severity === 'high').length,
            medium: openFindings.filter(finding => finding.severity === 'medium').length,
            low: openFindings.filter(finding => finding.severity === 'low').length,
        },
    };
}
//# sourceMappingURL=quality.js.map