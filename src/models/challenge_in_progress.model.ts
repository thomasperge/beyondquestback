import mongoose from "mongoose";

let challengeInProgressSchema = new mongoose.Schema(
  {
    challenge_id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    completed: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("challenge_in_progress", challengeInProgressSchema);
