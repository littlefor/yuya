const { request } = require("../../utils/api");
const { requireLogin } = require("../../utils/auth");

Page({
  data: { data: {} },
  async onShow() {
    if (!requireLogin()) return;
    this.setData({ data: await request({ path: "/roots", auth: false }) });
  },
  open(e) {
    wx.navigateTo({ url: `/pages/roots/detail?slug=${e.currentTarget.dataset.slug}` });
  },
});
