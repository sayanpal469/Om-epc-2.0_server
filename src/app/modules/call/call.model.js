import mongoose from "mongoose";

const callSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  amount: { type: String, required: true },
  location: { type: String, required: true },
  assign_eng: { type: String, required: true },
  eng_emp: { type: String, required: true },
  status: {
    type: String,
    enum: ["PENDING", "RUNNING", "COMPLETED"],
    default: "PENDING",
  },
});

export const Call = mongoose.model("Call", callSchema);
