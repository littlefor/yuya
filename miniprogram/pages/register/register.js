const { request } = require("../../utils/api");
const { setToken } = require("../../utils/auth");

Page({
  data: { name: "", email: "", password: "", error: "", loading: false },
  onName(e) { this.setData({ name: e.detail.value }); },
  onEmail(e) { this.setData({ email: e.detail.value }); },
  onPassword(e) { this.setData({ password: e.detail.value }); },
  async onRegister() {
    this.setData({ error: "", loading: true });
    try {
      const data = await request({
        path: "/auth/register",
        method: "POST",
        auth: false,
        data: { name: this.data.name, email: this.data.email, password: this.data.password },
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
});
