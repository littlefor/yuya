const { request, speak } = require("../../utils/api");
const { requireLogin } = require("../../utils/auth");

Page({
  data: { slug: "", root: null },
  async onLoad(query) {
    if (!requireLogin()) return;
    const slug = query.slug;
    const root = await request({ path: `/roots/${slug}`, auth: false });
    this.setData({ slug, root });
    wx.setNavigationBarTitle({ title: root.affix || slug });
  },
  play(e) { speak(e.currentTarget.dataset.text); },
  study() {
    wx.navigateTo({ url: `/pages/words/study?kind=root&slug=${this.data.slug}` });
  },
});
