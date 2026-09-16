const { request, speak } = require("../../utils/api");
const { requireLogin } = require("../../utils/auth");

Page({
  data: { queue: null, index: 0, word: null, show: false, empty: false },
  async onShow() {
    if (!requireLogin()) return;
    const queue = await request({ path: "/learn/review-queue" });
    this.setData({ queue, index: 0, show: false });
    this.syncWord(0, queue);
  },
  syncWord(index, queue = this.data.queue) {
    const word = queue?.words?.[index];
    this.setData({ index, word: word || null, empty: !word, show: false });
  },
  reveal() { this.setData({ show: true }); },
  play() { speak(this.data.word.lemma); },
  async rate(e) {
    await request({
      path: "/learn/review",
      method: "POST",
      data: { wordId: this.data.word._id, result: e.currentTarget.dataset.result },
    });
    this.syncWord(this.data.index + 1);
  },
  goDaily() { wx.navigateTo({ url: "/pages/daily/daily" }); },
});
