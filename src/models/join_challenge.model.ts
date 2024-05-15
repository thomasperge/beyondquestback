import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

let joinChallengeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      primary: true,
    },
    challenge_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  { timestamps: true }
);

export default mongoose.model("join_challenge", joinChallengeSchema);
