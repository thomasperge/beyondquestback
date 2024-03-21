import mongoose from "mongoose";

let friendsSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    friends_id: {
      type: String,
      required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model("friends", friendsSchema);
