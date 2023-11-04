import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Engineer", "Admin"],
    required: true,
  },
  engineer: {
    type: Schema.Types.ObjectId,
    ref: "Engineer",
    required: false
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    required: false
  },
});

export const User = mongoose.model("User", userSchema);
