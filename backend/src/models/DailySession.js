import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    done: { type: Boolean, default: false },
    correct: { type: Boolean, default: null },
  },
  { _id: true }
);

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    date: { type: String, required: true },
    minutes: { type: Number, required: true },
    tasks: [taskSchema],
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    xpEarned: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "completed"], default: "active" },
  },
  { timestamps: true }
);

sessionSchema.index({ userId: 1, date: 1 });

export const DailySession = mongoose.model("DailySession", sessionSchema);
