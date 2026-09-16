const { request } = require("../../utils/api");
const { setToken, getToken } = require("../../utils/auth");
const config = require("../../config.js");

Page({
  data: {
    email: config.demoEmail,
    password: config.demoPassword,
    error: "",
    loading: false,
  },

  onShow() {
    if (getToken()) wx.switchTab({ url: "/pages/home/home" });
  },

  onEmail(e) { this.setData({ email: e.detail.value }); },
  onPassword(e) { this.setData({ password: e.detail.value }); },

  async onLogin() {
    this.setData({ error: "", loading: true });
    try {
      const data = await request({
        path: "/auth/login",
        method: "POST",
        auth: false,
        data: { email: this.data.email, password: this.data.password },
      });
      setToken(data.token);
      getApp().setUser(data.user);
      wx.switchTab({ url: "/pages/home/home" });
    } catch (err) {
      this.setData({ error: err.message });
    } finally {
      this.setData({ loading: false });
    }
  },

  goRegister() {
    wx.navigateTo({ url: "/pages/register/register" });
  },
});
