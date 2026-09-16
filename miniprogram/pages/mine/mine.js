const { request } = require("../../utils/api");
const { requireLogin, setToken } = require("../../utils/auth");

Page({
  data: { user: null },
  async onShow() {
    if (!requireLogin()) return;
    const data = await request({ path: "/auth/me" });
    getApp().setUser(data.user);
    this.setData({ user: data.user });
  },
  goDaily() { wx.navigateTo({ url: "/pages/daily/daily" }); },
  goReview() { wx.navigateTo({ url: "/pages/review/review" }); },
  goPronounce() { wx.navigateTo({ url: "/pages/pronounce/pronounce" }); },
  goTests() { wx.navigateTo({ url: "/pages/tests/tests" }); },
  goRoots() { wx.navigateTo({ url: "/pages/roots/roots" }); },
  logout() {
    setToken("");
    getApp().setUser(null);
    wx.redirectTo({ url: "/pages/login/login" });
  },
});
