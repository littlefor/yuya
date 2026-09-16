const { request } = require("../../utils/api");
const { requireLogin } = require("../../utils/auth");

Page({
  data: { items: [], shown: [], stage: "全部", stages: ["全部", "A1", "A2", "B1", "B2"] },
  async onShow() {
    if (!requireLogin()) return;
    const items = await request({ path: "/grammar", auth: false });
    this.setData({ items });
    this.filter(this.data.stage, items);
  },
  setStage(e) {
    const stage = e.currentTarget.dataset.stage;
    this.setData({ stage });
    this.filter(stage, this.data.items);
  },
  filter(stage, items) {
    this.setData({ shown: stage === "全部" ? items : items.filter((g) => g.stage === stage) });
  },
  open(e) {
    wx.navigateTo({ url: `/pages/grammar/detail?slug=${e.currentTarget.dataset.slug}` });
  },
});
