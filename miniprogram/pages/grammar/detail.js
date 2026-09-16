const { request, speak } = require("../../utils/api");
const { requireLogin } = require("../../utils/auth");

function decorate(item) {
  const quizzes = (item.quizzes || []).map(function (q) {
    return {
      question: q.question,
      answer: q.answer,
      explain: q.explain,
      explained: false,
      displayOptions: (q.options || []).map(function (text, oi) {
        return { text: text, oi: oi, klass: "" };
      }),
    };
  });
  item.quizzes = quizzes;
  return item;
}

Page({
  data: { item: null, finished: false, correct: 0, picked: {} },
  onLoad(query) {
    if (!requireLogin()) return;
    const that = this;
    request({ path: "/grammar/" + query.slug, auth: false }).then(function (item) {
      that.setData({ item: decorate(item) });
      wx.setNavigationBarTitle({ title: item.title });
    });
  },
  play(e) { speak(e.currentTarget.dataset.text); },
  choose(e) {
    const qi = Number(e.currentTarget.dataset.qi);
    const oi = Number(e.currentTarget.dataset.oi);
    const picked = this.data.picked;
    if (picked[qi] !== undefined) return;
    picked[qi] = oi;
    const quizzes = this.data.item.quizzes.map(function (q, index) {
      if (index !== qi) return q;
      return {
        question: q.question,
        answer: q.answer,
        explain: q.explain,
        explained: true,
        displayOptions: q.displayOptions.map(function (opt) {
          var klass = "";
          if (opt.oi === q.answer) klass = "correct";
          else if (opt.oi === oi) klass = "wrong";
          return { text: opt.text, oi: opt.oi, klass: klass };
        }),
      };
    });
    const keys = Object.keys(picked);
    const correct = quizzes.filter(function (q, i) { return picked[i] === q.answer; }).length;
    this.setData({
      "item.quizzes": quizzes,
      picked: picked,
      finished: keys.length === quizzes.length,
      correct: correct,
    });
  },
});
