const { request, speak } = require("../../utils/api");
const { requireLogin } = require("../../utils/auth");

function shuffle(list) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

Page({
  data: {
    words: [],
    index: 0,
    word: null,
    options: [],
    revealed: false,
    picked: "",
    done: 0,
    loaded: false,
  },

  async onLoad(query) {
    if (!requireLogin()) return;
    const { kind, slug } = query;
    let words = [];
    if (kind === "root") {
      const data = await request({ path: `/roots/${slug}`, auth: false });
      words = (data.examples || []).map(function (w, idx) {
        return {
          lemma: w.lemma,
          ipa: w.ipa,
          meaning: w.meaning,
          emoji: w.emoji,
          breakdown: w.breakdown,
          _id: w._id || ("ex-" + idx),
          example: w.breakdown || data.affix,
          exampleZh: data.meaning,
        };
      });
    } else {
      words = await request({ path: `/words?category=${slug}`, auth: false });
    }
    this.setData({ words, loaded: true });
    this.show(0, words);
  },

  show(index, words = this.data.words) {
    const word = words[index];
    if (!word) {
      this.setData({ word: null, index });
      return;
    }
    const others = shuffle(words.filter((w) => w._id !== word._id).map((w) => w.meaning)).slice(0, 3);
    this.setData({
      index,
      word,
      options: shuffle([word.meaning].concat(others)).map(function (text) {
        return { text: text, klass: "" };
      }),
      revealed: false,
      picked: "",
    });
  },

  play() { speak(this.data.word.lemma); },

  answer(e) {
    if (this.data.picked) return;
    const meaning = e.currentTarget.dataset.meaning;
    const answerText = this.data.word.meaning;
    const options = this.data.options.map(function (opt) {
      var klass = "";
      if (opt.text === answerText) klass = "correct";
      else if (opt.text === meaning) klass = "wrong";
      return { text: opt.text, klass: klass };
    });
    this.setData({
      picked: meaning,
      revealed: true,
      options: options,
      done: this.data.done + (meaning === answerText ? 1 : 0),
    });
  },

  async rate(e) {
    const word = this.data.word;
    if (word._id && String(word._id).indexOf("ex-") !== 0) {
      await request({
        path: "/learn/review",
        method: "POST",
        data: { wordId: word._id, result: e.currentTarget.dataset.result },
      });
    }
    this.show(this.data.index + 1);
  },

  back() { wx.navigateBack(); },
});
