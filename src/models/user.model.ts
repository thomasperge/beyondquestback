import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

let userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
      primary: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    hobbies: {
      type: Array<String>,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
