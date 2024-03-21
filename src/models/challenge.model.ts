import mongoose from "mongoose";

let challengeSchema = new mongoose.Schema(
  {
    generate_by_user_id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true
    },
    time_to_complete_the_challenge: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("challenge", challengeSchema);
