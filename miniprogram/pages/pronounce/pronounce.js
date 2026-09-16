const { request, speak } = require("../../utils/api");
const { requireLogin } = require("../../utils/auth");

Page({
  data: { words: [], index: 0, word: null },
  async onShow() {
    if (!requireLogin()) return;
    const words = await request({ path: "/words", auth: false });
    this.setData({ words, word: words[0], index: 0 });
  },
  playWord() { speak(this.data.word.lemma); },
  playExample() { speak(this.data.word.example); },
  next() {
    const index = (this.data.index + 1) % this.data.words.length;
    this.setData({ index, word: this.data.words[index] });
  },
});
