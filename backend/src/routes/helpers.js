export const NEXT_LEVEL = { A1: "A2", A2: "B1", B1: "B2", B2: "C1" };

export function publicUserSafe(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    level: user.level,
    streak: user.streak,
    longestStreak: user.longestStreak,
    lastCheckIn: user.lastCheckIn,
    xp: user.xp,
    dailyMinutes: user.dailyMinutes,
    completedStages: user.completedStages,
    unlockedTests: user.unlockedTests,
  };
}
