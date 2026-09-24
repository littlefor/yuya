const { request, speak } = require("../../utils/api");
const { requireLogin } = require("../../utils/auth");

function mapOptions(question, picked) {
  return (question.options || []).map(function (text, index) {
    var klass = "";
    if (picked != null) {
      if (index === question.answer) klass = "correct";
      else if (index === picked) klass = "wrong";
    }
    return { text: text, index: index, klass: klass };
  });
}

Page({
  data: {
    kind: "category",
    slug: "",
    quiz: null,
    question: null,
    options: [],
    index: 0,
    picked: null,
    correct: 0,
    missed: [],
    done: false,
    error: "",
    score: 0,
    passed: false,
    qTypeLabel: "",
    nextLabel: "下一题",
    feedback: "",
  },

  async onLoad(query) {
    if (!requireLogin()) return;
    this.setData({
      kind: query.kind || "category",
      slug: query.slug || "",
    });
    this.loadQuiz();
  },

  async loadQuiz() {
    const kind = this.data.kind;
    const slug = this.data.slug;
    let path = "/practice/memory-quiz?category=" + slug;
    if (kind === "root") path = "/practice/memory-quiz?root=" + slug;
    try {
      const quiz = await request({ path: path });
      this.setData({
        quiz: quiz,
        error: "",
        done: false,
        correct: 0,
        missed: [],
        index: 0,
        picked: null,
      });
      this.showQuestion(0, quiz);
    } catch (err) {
      this.setData({ error: err.message || "出题失败" });
    }
  },

  showQuestion(index, quiz) {
    const paper = quiz || this.data.quiz;
    const question = paper.questions[index];
    if (!question) {
      const score = paper.total ? Math.round((this.data.correct / paper.total) * 100) : 0;
      this.setData({
        done: true,
        question: null,
        score: score,
        passed: score >= paper.passScore,
      });
      return;
    }
    this.setData({
      index: index,
      question: question,
      options: mapOptions(question, null),
      picked: null,
      qTypeLabel: question.type === "en2zh" ? "英译中" : "中译英",
      nextLabel: index + 1 < paper.total ? "下一题" : "看成绩",
      feedback: "",
    });
  },

  play() {
    if (this.data.question) speak(this.data.question.lemma);
  },

  async choose(e) {
    if (this.data.picked != null) return;
    const picked = Number(e.currentTarget.dataset.index);
    const question = this.data.question;
    const ok = picked === question.answer;
    const missed = this.data.missed.slice();
    if (!ok) missed.push(question);
    this.setData({
      picked: picked,
      options: mapOptions(question, picked),
      correct: this.data.correct + (ok ? 1 : 0),
      missed: missed,
      feedback: ok ? "答对了。" : ("正确是「" + question.options[question.answer] + "」。"),
    });
    if (question.wordId && String(question.wordId).indexOf("ex-") !== 0) {
      try {
        await request({
          path: "/learn/review",
          method: "POST",
          data: { wordId: question.wordId, result: ok ? "known" : "unknown" },
        });
      } catch (err) {}
    }
  },

  next() {
    this.showQuestion(this.data.index + 1);
  },

  retry() {
    this.loadQuiz();
  },

  back() {
    wx.navigateBack();
  },
});
