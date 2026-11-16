/**
 * The coding-task eval baseline: fixture task definitions, grading contracts,
 * and the metric definitions the kernel-sync regression gate reports. The
 * runner that boots the distro against each fixture is a separate script —
 * this module owns the vocabulary and the aggregation so the gate and the
 * report cannot drift. @module @deepseek-ai/dsh-coding-eval-baseline
 */
/**
 * Aggregate one run set into the baseline report. Pure so the gate and the
 * report share one definition of every metric.
 * @param kernelVersion - the kernel commit or version the runs ran against.
 * @param results - per-task runner outcomes.
 * @returns the aggregated report.
 */
export function aggregateBaseline(kernelVersion, results) {
    const measured = results.filter(result => result.passRate !== null);
    return {
        kernelVersion,
        tasks: results,
        gradedRate: results.length === 0 ? 0 : results.filter(result => result.graded).length / results.length,
        meanPassRate: measured.length === 0 ? null : measured.reduce((sum, result) => sum + (result.passRate ?? 0), 0) / measured.length,
        repairLoops: results.reduce((sum, result) => sum + result.repairLoops, 0),
        escapes: results.filter(result => result.escaped).length,
    };
}
/**
 * Judge one report against the gate policy. Pure; tests pin the thresholds.
 * @param report - the aggregated report.
 * @param policy - the gate thresholds.
 * @returns the violations; empty means the gate passes.
 */
export function evalGateViolations(report, policy) {
    const violations = [];
    if (report.tasks.length === 0)
        violations.push('no evaluation tasks ran');
    if (report.gradedRate < policy.minGradedRate) {
        violations.push(`graded rate ${report.gradedRate.toFixed(2)} is below the policy minimum ${policy.minGradedRate.toFixed(2)}`);
    }
    if (report.repairLoops > policy.maxRepairLoops) {
        violations.push(`repair loops ${report.repairLoops} exceed the policy maximum ${policy.maxRepairLoops}`);
    }
    if (report.escapes > policy.maxEscapes) {
        violations.push(`escapes ${report.escapes} exceed the policy maximum ${policy.maxEscapes}`);
    }
    return violations;
}
//# sourceMappingURL=eval-baseline.js.map