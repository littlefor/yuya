const { request, speak } = require("../../utils/api");
const { requireLogin } = require("../../utils/auth");

Page({
  data: { slug: "", words: [], meta: {}, active: null },

  async onLoad(query) {
    if (!requireLogin()) return;
    const slug = query.slug || "";
    this.setData({ slug });
    const [words, cats] = await Promise.all([
      request({ path: `/words?category=${slug}`, auth: false }),
      request({ path: "/categories", auth: false }),
    ]);
    const meta = cats.find((c) => c.slug === slug) || {};
    this.setData({ words, meta, active: words[0] || null });
    wx.setNavigationBarTitle({ title: meta.name || slug });
  },

  pick(e) {
    const active = this.data.words.find((w) => w._id === e.currentTarget.dataset.id);
    this.setData({ active });
    if (active) speak(active.lemma);
  },

  speakActive() {
    if (this.data.active) speak(`${this.data.active.lemma}. ${this.data.active.example || ""}`);
  },

  startStudy() {
    wx.navigateTo({ url: `/pages/words/study?kind=category&slug=${this.data.slug}` });
  },
});
