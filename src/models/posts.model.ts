import mongoose from "mongoose";

let postSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    challenge_id: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("posts", postSchema);
