import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  comment: String,
  provider: String,
  consumer: String,
});

export const Notification = mongoose.model("notification", notificationSchema);
