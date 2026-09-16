const { request } = require("../../utils/api");
const { requireLogin } = require("../../utils/auth");

Page({
  data: {
    user: null,
    progress: {},
    review: {},
    stages: ["A1", "A2", "B1", "B2"],
  },

  onShow() {
    if (!requireLogin()) return;
    this.load();
  },

  async load() {
    try {
      const [me, progress, review] = await Promise.all([
        request({ path: "/auth/me" }),
        request({ path: "/progress" }).catch(() => ({})),
        request({ path: "/learn/review-queue" }).catch(() => ({})),
      ]);
      getApp().setUser(me.user);
      const done = me.user.completedStages || [];
      this.setData({
        user: me.user,
        progress,
        review,
        stages: ["A1", "A2", "B1", "B2"].map((id) => ({
          id,
          done: done.indexOf(id) >= 0,
          now: me.user.level === id,
        })),
      });
    } catch (err) {
      wx.showToast({ title: err.message, icon: "none" });
    }
  },

  goDaily() { wx.navigateTo({ url: "/pages/daily/daily" }); },
  goReview() { wx.navigateTo({ url: "/pages/review/review" }); },
  goTests() { wx.navigateTo({ url: "/pages/tests/tests" }); },
  goWords() { wx.switchTab({ url: "/pages/words/words" }); },
  goRoots() { wx.navigateTo({ url: "/pages/roots/roots" }); },
  goScenarios() { wx.switchTab({ url: "/pages/scenarios/scenarios" }); },
  goGrammar() { wx.switchTab({ url: "/pages/grammar/grammar" }); },
});
