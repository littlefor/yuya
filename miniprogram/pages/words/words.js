const { request } = require("../../utils/api");
const { requireLogin } = require("../../utils/auth");

Page({
  data: {
    cats: [],
    shown: [],
    exam: "",
    exams: [
      { id: "", label: "全部" },
      { id: "CET4", label: "四级" },
      { id: "CET6", label: "六级" },
      { id: "IELTS", label: "雅思" },
    ],
  },

  onShow() {
    if (!requireLogin()) return;
    this.load();
  },

  async load() {
    const cats = await request({ path: "/categories", auth: false });
    this.setData({ cats });
    this.applyFilter(this.data.exam, cats);
  },

  setExam(e) {
    const exam = e.currentTarget.dataset.id;
    this.setData({ exam });
    this.applyFilter(exam, this.data.cats);
  },

  applyFilter(exam, cats) {
    const shown = exam
      ? cats.filter((c) => c.examFocus === exam || (exam === "CET6" && c.examFocus === "CET4"))
      : cats;
    this.setData({ shown });
  },

  openGroup(e) {
    wx.navigateTo({ url: `/pages/words/group?slug=${e.currentTarget.dataset.slug}` });
  },
});
