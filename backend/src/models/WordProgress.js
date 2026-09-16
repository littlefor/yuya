import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    wordId: { type: mongoose.Schema.Types.ObjectId, ref: "Word", required: true },
    easeFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 0 },
    repetitions: { type: Number, default: 0 },
    nextReviewAt: { type: Date, default: Date.now },
    lastQuality: { type: Number, default: 0 },
    lastReviewedAt: { type: Date },
    seenCount: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, wordId: 1 }, { unique: true });
progressSchema.index({ userId: 1, nextReviewAt: 1 });

export const WordProgress = mongoose.model("WordProgress", progressSchema);
