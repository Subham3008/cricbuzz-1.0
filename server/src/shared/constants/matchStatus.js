// ─── Match Status Constants ────────────────────────────────────────────────
// All possible lifecycle states a match can be in.
// Used by the Match model enum and validators.
// ────────────────────────────────────────────────────────────────────────────

export const MATCH_STATUS = {
  DRAFT: "DRAFT",
  UPCOMING: "UPCOMING",
  TOSS_COMPLETED: "TOSS_COMPLETED",
  PLAYING_XI_SELECTED: "PLAYING_XI_SELECTED",
  LIVE: "LIVE",
  INNINGS_BREAK: "INNINGS_BREAK",
  COMPLETED: "COMPLETED",
};
