import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    company_name: String,
    call_id: String,
    eng_emp: String,
    complain_id: String,
    date: String,
    time: String,
    client_name: String,
    atm_id: String,
    contact: String,
    address: String,
    site_type: {
      type: String,
      enum: ["Onsite", "Offsite"],
    },
    work_type: {
      type: String,
      enum: [
        "Warrenty",
        "AMC",
        "Installation",
        "SiteInspection",
        "Chargeable",
        "PM",
        "Chargeable",
        "Service",
      ],
    },
    device_type: {
      type: String,
      enum: [
        "Ups_Battery",
        "Inverter_Battery",
        "Stabilizer",
        "Solar",
        "Computer",
        "Printer",
        "CCTV",
      ],
    },
    product_make: String,
    product_slNo: String,
    buy_back_details: String,
    nature_of_complaint: String,
    ac_input_three_phase: {
      ac_input_three_phase_RY: String,
      ac_input_three_phase_YB: String,
      ac_input_three_phase_RB: String,
      ac_input_three_phase_NR: String,
    },
    ac_output_three_phase: {
      ac_output_three_phase_RY: String,
      ac_output_three_phase_YB: String,
      ac_output_three_phase_RB: String,
      ac_output_three_phase_NR: String,
    },
    ac_input_single_phase: {
      ac_input_single_phase_LN: String,
      ac_input_single_phase_NE: String,
      ac_input_single_phase_LE: String,
    },
    ac_output_single_phase: {
      ac_output_single_phase_LN: String,
      ac_output_single_phase_NE: String,
      ac_output_single_phase_LE: String,
    },
    DC: {
      V: String,
      V_withMains: String,
      V_withoutMains: String,
    },
    site_images: [
      {
        type: String,
      },
    ],
    power_cut: String,
    battery_make: String,
    battery_type: String,
    battery_AH: String,
    quantity: String,
    battery_test_report: [
      {
        battery_catch_code: String,
        with_mains: String,
        without_mains: String,
        after_5_min: String,
        after_10_min: String,
        after_20_min: String,
        after_40_min: String,
        after_1_hour: String,
      },
    ],
    customer_sign: String,
    eng_sign: String,
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model("Report", reportSchema);
