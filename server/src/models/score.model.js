import { Schema, model } from "mongoose";

const scoreSchema = new Schema(
  {
    matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
    innings: { type: Number, required: true, min: 1 },
    battingTeam: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    score: { type: Number, default: 0, min: 0 },
    wickets: { type: Number, default: 0, min: 0, max: 10 },
    overs: { type: String, default: "0.0", match: /^\d+\.[0-5]$/ },
    runRate: { type: Number, default: 0, min: 0 },
    target: { type: Number, min: 0 },
    striker: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    nonStriker: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    currentBowler: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    strikerStats: {
      runs: { type: Number, default: 0 },
      balls: { type: Number, default: 0 },
      fours: { type: Number, default: 0 },
      sixes: { type: Number, default: 0 }
    },
    nonStrikerStats: {
      runs: { type: Number, default: 0 },
      balls: { type: Number, default: 0 },
      fours: { type: Number, default: 0 },
      sixes: { type: Number, default: 0 }
    },
    bowlerStats: {
      overs: { type: String, default: "0.0" },
      runs: { type: Number, default: 0 },
      wickets: { type: Number, default: 0 },
      maidens: { type: Number, default: 0 }
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

scoreSchema.index({ matchId: 1, innings: 1 });

const scoreModel = model("Score", scoreSchema)

export default scoreModel