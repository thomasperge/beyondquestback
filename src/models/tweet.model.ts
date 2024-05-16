import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

let postSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      primary: true,
    },
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

export default mongoose.model("tweet", postSchema);
