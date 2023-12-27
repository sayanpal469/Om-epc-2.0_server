import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    company_name: String,
    call_id: String,
    eng_emp: String,
    complain_id: String,
    date: String,
    customer_name: String,
    client_name: String,
    atm_id: String,
    contact: String,
    address: String,
    site_type: {
      type: String,
      enum: [
        "ONSITE",
        "OFFSITE",
        "WARRANTY",
        "AMC",
        "INSTALLATION",
        "SITE_INSPECTION",
        "CHARGEABLE",
        "PM",
        "SERVICE",
      ],
    },
    device_type: {
      type: String,
      enum: [
        "UPS",
        "UPS_BATTERY",
        "INVERTER",
        "INVERTER_BATTERY",
        "STABILIZER",
        "SOLAR",
        "COMPUTER",
        "PRINTER",
        "CCTV",
      ],
    },
    product_make: String,
    product_slNo: String,
    buy_back_details: String,
    nature_of_complaint: String,
    ac_input_three_phase: {
      type: String,
      enum: ["R_Y", "Y_B", "R_B", "N_R"],
    },
    ac_output_three_phase: {
      type: String,
      enum: ["R_Y", "Y_B", "R_B", "N_R"],
    },
    ac_input_single_phase: {
      type: String,
      enum: ["L_N", "N_E", "L_E"],
    },
    ac_output_single_phase: {
      type: String,
      enum: ["L_N", "N_E", "L_E"],
    },
    DC: {
      V: String,
      V_withMains: String,
      V_withoutMains: String,
    },
    power_cut: String,
    battery_make: String,
    battery_type: String,
    battery_AH: String,
    quantity: String,
    battery_test_report: {
      battery_catch_code: String,
      with_mains: String,
      without_mains: String,
      after_5_min: String,
      after_10_min: String,
      after_20_min: String,
      after_40_min: String,
      after_1_hour: String,
      signature: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model("Report", reportSchema);
