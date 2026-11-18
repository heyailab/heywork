/**
 * @heywork/ui — HEY Remote assembly module (no UI surface).
 * Rewritten from specs/ui-remotes.md, not translated from bundle.
 * Exposes the dsh browser contract:
 *   window.__ModuleLoader__.load({ id, factory: require => ({ apply, inject }) })
 * This package has no slot / no React component. Its contract is stage-one
 * factory registration (immediately:true) plus ordered Remote mounting and
 * reversible cleanup. All method lists and frozen texts follow the spec.
 */
window.__ModuleLoader__.load({
  id: '@heywork/dsh-client-uma-remotes',
  factory: require => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

    // --- identity / load semantics (spec §1.1 / §1.3) ---
    // immediately:true = "Stage-one prefetch mark: load the script for factory registration during module-face boot."
    // NOT "create Host service" and NOT "mount Remote now" — mounting happens in apply(ctx) via the plugin lifecycle.
    const IMMEDIATELY = true
    const HOST_SERVICES_OWNER = 'hey-base'

    // --- browser ctx-service inject (spec §4.1, single item) ---
    const inject = ['remote']

    // --- typert runtime classes (spec §4.3 / §5.2) — frozen names ---
    class RemoteInfo {}
    class NamedInput {}
    class ResultValue {}
    function createTypertRemoteInfo({ package: pkg, service, methods }) {
      return {
        package: pkg,
        service,
        methods,
        invocation: { kind: 'direct' },
        cancellation: { parameter: 'signal' },
      }
    }

    // --- 57 endpoints across 3 contributions (spec §5.3) ---
    const knowledgeMethods = [
      'knowledge/archiveBase', 'knowledge/catalog', 'knowledge/createBase',
      'knowledge/createNoteIfAbsent', 'knowledge/createTeam', 'knowledge/deleteExperience',
      'knowledge/detail', 'knowledge/document', 'knowledge/experienceCapture',
      'knowledge/experienceHistory', 'knowledge/importLocal', 'knowledge/listExperiences',
      'knowledge/note', 'knowledge/original', 'knowledge/restoreRevision',
      'knowledge/retryDocument', 'knowledge/saveExperience', 'knowledge/search',
      'knowledge/setExperienceCapture', 'knowledge/syncSource', 'knowledge/transitionExperience',
      'knowledge/updateBase', 'knowledge/updateDocument', 'knowledge/upload',
      'knowledge/watchSource',
    ]
    const codingWorkbenchMethods = [
      'codingWorkbench/addFinding', 'codingWorkbench/assess', 'codingWorkbench/cancelCheck',
      'codingWorkbench/cancelRepair', 'codingWorkbench/changes', 'codingWorkbench/commitTask',
      'codingWorkbench/context', 'codingWorkbench/createTask', 'codingWorkbench/diff',
      'codingWorkbench/doctor', 'codingWorkbench/evidenceSnapshot', 'codingWorkbench/experienceSearch',
      'codingWorkbench/exportEvidence', 'codingWorkbench/impact', 'codingWorkbench/inspectTask',
      'codingWorkbench/mergeTask', 'codingWorkbench/overview', 'codingWorkbench/planChecks',
      'codingWorkbench/qualityReport', 'codingWorkbench/removeTask', 'codingWorkbench/restoreFile',
      'codingWorkbench/restoreTask', 'codingWorkbench/saveSpec', 'codingWorkbench/startCheck',
      'codingWorkbench/startRepair', 'codingWorkbench/sweep', 'codingWorkbench/updateFinding',
    ]
    const projectWikiMethods = [
      'projectWiki/catalog', 'projectWiki/observe', 'projectWiki/readOwned',
      'projectWiki/readSource', 'projectWiki/summary',
    ]

    // Mounted in this exact order: TYPERT_REMOTE$2 -> TYPERT_REMOTE$1 -> TYPERT_REMOTE.
    const TYPERT_REMOTE$2 = createTypertRemoteInfo({
      package: '@deepseek-ai/dsh-knowledge', service: 'knowledge', methods: knowledgeMethods,
    })
    const TYPERT_REMOTE$1 = createTypertRemoteInfo({
      package: '@deepseek-ai/dsh-coding-workbench', service: 'codingWorkbench', methods: codingWorkbenchMethods,
    })
    const TYPERT_REMOTE = createTypertRemoteInfo({
      package: '@deepseek-ai/dsh-tool-repo-wiki', service: 'projectWiki', methods: projectWikiMethods,
    })

    // --- reverse release: splice + reverse, one failure does not interrupt, aggregate errors ---
    async function release(disposers) {
      const errors = []
      for (const dispose of disposers.splice(0).reverse()) {
        try { await dispose() } catch (error) { errors.push(error) }
      }
      return errors
    }

    // --- browser entry (spec §2.4) ---
    async function apply(ctx) {
      const disposers = []
      try {
        for (const contribution of [TYPERT_REMOTE$2, TYPERT_REMOTE$1, TYPERT_REMOTE]) {
          disposers.push(await ctx.remote.$mount(contribution))
        }
      } catch (error) {
        const errors = await release(disposers)
        if (errors.length > 0) {
          throw new AggregateError([error, ...errors], 'HEY Remote activation and cleanup failed')
        }
        throw error
      }
      return async () => {
        const errors = await release(disposers)
        if (errors.length > 0) {
          throw new AggregateError(errors, 'HEY Remote cleanup failed')
        }
      }
    }

    exports.apply = apply
    exports.inject = inject
    return module.exports
  },
})
