/** Composer model-list policy delivered with the client document. */
export interface ModelPickerBootstrap {
  /** Open the catalog at the first level. */
  readonly __DSH_FIRST_LEVEL_MODEL_PICKER__?: true
}

/** Page-bootstrap key for the first-level composer model list. */
export const FIRST_LEVEL_MODEL_PICKER = '__DSH_FIRST_LEVEL_MODEL_PICKER__' satisfies keyof ModelPickerBootstrap
