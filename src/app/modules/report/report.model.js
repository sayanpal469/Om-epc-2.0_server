import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  pdf: { type: String, required: true },
  engineer_EMP: { type: String, required: true },
  engineer_name: { type: String },
  company: { type: String, required: true },
  createdId: { type: String },
});

export const Report = mongoose.model("Report", reportSchema);
