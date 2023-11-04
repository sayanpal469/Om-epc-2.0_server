import mongoose from "mongoose";
import config from "./config/index.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.db_url);

    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(`Error connecting to MongoDB: ${err}`);
  }
};


export default connectDB;
