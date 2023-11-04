import mongoose from "mongoose";

const engineerSchema = new mongoose.Schema({
  Fname: String,
  Lname: String,
  phone: String,
  EMP_id: String,
  image: String,
  address: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const Engineer = mongoose.model("Engineer", engineerSchema);
