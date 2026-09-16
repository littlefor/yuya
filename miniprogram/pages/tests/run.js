const { request, speak } = require("../../utils/api");
const { requireLogin } = require("../../utils/auth");

Page({
  data: { level: "", test: null, index: 0, q: null, answers: [], result: null, wrong: [], error: "" },

  async onLoad(query) {
    if (!requireLogin()) return;
    const level = query.level;
    this.setData({ level });
    try {
      const test = await request({ path: `/tests/${level}` });
      this.setData({ test, q: test.questions[0], index: 0, answers: [] });
    } catch (err) {
      this.setData({ error: err.message });
    }
  },

  playAudio() { speak(this.data.q.audioText); },

  async choose(e) {
    const oi = Number(e.currentTarget.dataset.oi);
    const answers = this.data.answers.concat([oi]);
    const next = this.data.index + 1;
    if (next < this.data.test.questions.length) {
      this.setData({ answers, index: next, q: this.data.test.questions[next] });
      return;
    }
    const result = await request({
      path: `/tests/${this.data.level}/submit`,
      method: "POST",
      data: { answers },
    });
    if (result.user) getApp().setUser(result.user);
    const wrong = (result.review || []).filter(function (r) {
      return !r.correct;
    }).map(function (r) {
      return {
        index: r.index,
        prompt: r.prompt,
        explain: r.explain,
        yoursText: r.options[r.yours] || "未作答",
        answerText: r.options[r.answer],
      };
    });
    this.setData({ answers, result, wrong, q: null });
  },

  back() { wx.navigateBack(); },
  retry() {
    this.setData({
      result: null,
      wrong: [],
      index: 0,
      answers: [],
      q: this.data.test.questions[0],
    });
  },
});
