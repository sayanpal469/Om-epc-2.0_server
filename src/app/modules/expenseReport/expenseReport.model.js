import mongoose from "mongoose";

const expenseReportSchema = new mongoose.Schema(
  {
    eng_emp: { type: String, required: true },
    eng_name: { type: String, required: true },
    company_name: { type: String },
    company_location: { type: String, required: true },
    call_id: { type: String },
    total_kilometer: { type: String, required: true },
    time: { type: String, required: true },
    date: { type: String, required: true },
    others: { type: String },
    expense_amount: { type: String, required: true },
    isApprove: {
      type: String,
      enum: ["APPROVE", "REJECT", "PENDING"],
      default: "PENDING",
    },
    status: {
      type: String,
      enum: ["APPROVE", "REJECT", "RECENT", "ALL", "PENDING"],
      default: "PENDING",
    },
    eng_desc: { type: String, required: true },
    admin_desc: { type: String, default: "_" },
  },
  { timestamps: true }
);

export const ExpenseReport = mongoose.model(
  "ExpenseReport",
  expenseReportSchema
);
