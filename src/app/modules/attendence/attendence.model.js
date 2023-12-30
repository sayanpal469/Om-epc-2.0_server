import mongoose from "mongoose";

const attendenceSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    eng_name: { type: String, required: true },
    eng_emp: { type: String, required: true },
    time: { type: String,  },
    location: { type: String,  },
  },
  { timestamps: true }
);

export const Attendence = mongoose.model("Attendence", attendenceSchema);
