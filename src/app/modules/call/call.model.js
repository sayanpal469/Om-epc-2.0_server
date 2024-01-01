import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    company_name: { type: String, required: true },
    company_details: { type: String, required: true },
    company_location: { type: String, required: true },
    company_address: { type: String, required: true },
    eng_name: { type: String, required: true },
    eng_emp: { type: String, required: true },
    assigned_date: { type: String, required: true },
    assigned_time: { type: String, required: true },
    eng_desc: { type: String, default: "_" },
    admin_desc: { type: String, default: "_" },
    call_id: { type: String, required: true },
    customer_contact: { type: String, required: true },
    submit_date: { type: String, default: "-" },
    visit_date: { type: String, default: "-" },
    completed: { type: Boolean, default: false },
    site_images: [
      {
        type: String,
      },
    ],
    expense_amount: { type: String, default: "-" },
    report: { type: String, default: "-" },
    status: {
      type: String,
      enum: ["PENDING", "TODAY", "COMPLETED", "ALL"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export const Call = mongoose.model("Call", callSchema);
