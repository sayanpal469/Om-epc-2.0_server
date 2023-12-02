import mongoose from "mongoose";

const expenseReportSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  amount: { type: String, required: true },
  engineer_EMP: { type: String, required: true },
  engineer_name: { type: String, required: true },
  location: { type: String, required: true },
  isApprove: { type: Boolean, required: true, default: false },
});

export const ExpenseReport = mongoose.model(
  "ExpenseReport",
  expenseReportSchema
);
