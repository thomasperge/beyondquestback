import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

let challengeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      primary: true,
    },
    generate_by_user_id: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true
    },
    hobbies: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("challenge", challengeSchema);
