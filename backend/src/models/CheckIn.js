import mongoose from "mongoose";

const checkInSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  date: { type: String, required: true },
  minutes: { type: Number, required: true },
  xp: { type: Number, default: 0 },
  wordsReviewed: { type: Number, default: 0 },
});

checkInSchema.index({ userId: 1, date: 1 }, { unique: true });

export const CheckIn = mongoose.model("CheckIn", checkInSchema);
