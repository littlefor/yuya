export const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/linguaseed",
  jwtSecret: process.env.JWT_SECRET || "linguaseed-dev-secret-change-me",
  seedOnStart: process.env.SEED_ON_START !== "false",
};
