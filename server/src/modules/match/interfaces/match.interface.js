// ─── Match Interface ───────────────────────────────────────────────────────
// Centralised field-name constants for the Match entity.
//
// Why do we need this?
//   • Prevents typos when referencing fields in queries, projections, etc.
//   • Gives us a single source of truth — if we rename a field in the schema,
//     we only update it here and every consumer picks up the change.
//   • Useful for building dynamic select/projection strings.
// ────────────────────────────────────────────────────────────────────────────

export const MatchFields = {
  TEAM_A: "teamA",
  TEAM_B: "teamB",
  STATUS: "status",
  VENUE: "venue",
  FORMAT: "format",
  START_DATE: "startDate",
  IS_DELETED: "isDeleted",
};

// Allowed match statuses (mirrors the enum in match.model.js)
export const MatchStatus = {
  SCHEDULED: "SCHEDULED",
  LIVE: "LIVE",
  COMPLETED: "COMPLETED",
  ABANDONED: "ABANDONED",
};

// Supported cricket formats
export const MatchFormat = {
  T20: "T20",
  ODI: "ODI",
  TEST: "TEST",
};
