const { request } = require("../../utils/api");
const { requireLogin } = require("../../utils/auth");

Page({
  data: { tests: [] },
  async onShow() {
    if (!requireLogin()) return;
    const data = await request({ path: "/tests" });
    this.setData({ tests: data.tests || [] });
  },
  start(e) {
    wx.navigateTo({ url: `/pages/tests/run?level=${e.currentTarget.dataset.level}` });
  },
});
