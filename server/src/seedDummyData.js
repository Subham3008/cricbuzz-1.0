import mongoose from "mongoose";
import { connectDB } from "./database/mongodb.js";
import userModel from "./models/user.model.js";
import teamModel from "./models/team.model.js";
import playersModel from "./models/players.model.js";
import matchModel from "./models/match.model.js";
import { SeriesModel } from "./models/series.model.js";
import { MATCH_STATUS } from "./shared/constants/matchStatus.js";

const seedDummyData = async () => {
  try {
    await connectDB();
    console.log("Seeding dummy data...");

    // 1. Get Super Admin
    const superAdmin = await userModel.findOne({ email: "superadmin@gmail.com" });
    if (!superAdmin) {
      throw new Error("Super Admin not found. Run 'npm run seed' first.");
    }

    // 2. Clear existing data
    await Promise.all([
      teamModel.deleteMany({}),
      playersModel.deleteMany({}),
      matchModel.deleteMany({}),
      SeriesModel.deleteMany({})
    ]);

    // 3. Create Series
    const series = await SeriesModel.create({
      name: "Global T20 Championship 2026",
      shortName: "GT20",
      season: "2026",
      status: "UPCOMING",
      createdBy: superAdmin._id
    });

    // 4. Create Teams
    const india = await teamModel.create({
      name: "India",
      shortName: "IND",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/Cricket_India_Crest.svg/1200px-Cricket_India_Crest.svg.png",
      primaryColor: "#0000FF",
      createdBy: superAdmin._id
    });

    const australia = await teamModel.create({
      name: "Australia",
      shortName: "AUS",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Cricket_Australia_logo.svg/1200px-Cricket_Australia_logo.svg.png",
      primaryColor: "#FFD700",
      createdBy: superAdmin._id
    });

    // 5. Create Players
    const indiaPlayers = [
      "Rohit Sharma", "Virat Kohli", "Suryakumar Yadav", "Rishabh Pant", "Hardik Pandya",
      "Ravindra Jadeja", "Axar Patel", "Kuldeep Yadav", "Jasprit Bumrah", "Mohammed Siraj", "Arshdeep Singh"
    ];

    const ausPlayers = [
      "David Warner", "Travis Head", "Mitchell Marsh", "Steve Smith", "Glenn Maxwell",
      "Marcus Stoinis", "Matthew Wade", "Pat Cummins", "Mitchell Starc", "Adam Zampa", "Josh Hazlewood"
    ];

    const createdIndPlayers = [];
    for (const p of indiaPlayers) {
      createdIndPlayers.push(await playersModel.create({
        name: p,
        country: "India",
        role: "BATSMAN",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
        battingStyle: "RIGHT_HANDED",
        bowlingStyle: "RIGHT_ARM_FAST",
        team: india._id,
        createdBy: superAdmin._id
      }));
    }

    const createdAusPlayers = [];
    for (const p of ausPlayers) {
      createdAusPlayers.push(await playersModel.create({
        name: p,
        country: "Australia",
        role: "BATSMAN",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
        battingStyle: "LEFT_HANDED",
        bowlingStyle: "RIGHT_ARM_FAST",
        team: australia._id,
        createdBy: superAdmin._id
      }));
    }

    // Assign to squad
    india.squadPlayers = createdIndPlayers.map(p => p._id);
    await india.save();
    
    australia.squadPlayers = createdAusPlayers.map(p => p._id);
    await australia.save();

    // 6. Create Live Match
    const match = await matchModel.create({
      seriesId: series._id,
      matchNumber: "Final",
      venue: "Wankhede Stadium, Mumbai",
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
      status: MATCH_STATUS.LIVE,
      team1: india._id,
      team2: australia._id,
      tossWinner: india._id,
      tossDecision: "BAT",
      playingXI: {
        team1: createdIndPlayers.map(p => ({ player: p._id, isCaptain: p.name === "Rohit Sharma", isWicketKeeper: p.name === "Rishabh Pant" })),
        team2: createdAusPlayers.map(p => ({ player: p._id, isCaptain: p.name === "Mitchell Marsh", isWicketKeeper: p.name === "Matthew Wade" }))
      },
      createdBy: superAdmin._id
    });

    console.log("Successfully seeded dummy data!");
    console.log(`Created 2 teams, 22 players, 1 series, and 1 live match.`);
    process.exit(0);

  } catch (error) {
    console.error("Error seeding dummy data:", error);
    process.exit(1);
  }
};

seedDummyData();
