import mongoose from "mongoose";

const engineerSchema = new mongoose.Schema({
  Fname: {
    type: String,
    required: true,
  },
  Lname: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  eng_emp: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  eng_sign: {
    type: String,
    required: true,
  },
});

export const Engineer = mongoose.model("Engineer", engineerSchema);
