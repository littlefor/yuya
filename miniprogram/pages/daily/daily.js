const { request, speak } = require("../../utils/api");
const { requireLogin } = require("../../utils/auth");

Page({
  data: {
    minutes: 15,
    minuteOptions: [10, 15, 30],
    session: null,
    completed: false,
    current: null,
    done: 0,
    total: 0,
    clock: "00:00",
    msg: "",
  },
  timer: null,

  async onShow() {
    if (!requireLogin()) return;
    const me = await request({ path: "/auth/me" });
    this.setData({ minutes: me.user.dailyMinutes || 15 });
    const session = await request({ path: "/learn/daily/today" }).catch(() => null);
    if (session) this.applySession(session);
  },

  onUnload() { this.clearTimer(); },

  setMinutes(e) { this.setData({ minutes: Number(e.currentTarget.dataset.m) }); },

  applySession(session) {
    const tasks = session.tasks || [];
    const current = tasks.find((t) => !t.done) || null;
    this.setData({
      session,
      completed: session.status === "completed",
      current,
      done: tasks.filter((t) => t.done).length,
      total: tasks.length,
    });
    this.clearTimer();
    if (session.status !== "completed") this.startClock(session.minutes);
  },

  startClock(minutes) {
    let left = minutes * 60;
    const tick = () => {
      const mm = String(Math.floor(left / 60)).padStart(2, "0");
      const ss = String(left % 60).padStart(2, "0");
      this.setData({ clock: `${mm}:${ss}` });
      left = Math.max(0, left - 1);
    };
    tick();
    this.timer = setInterval(tick, 1000);
  },

  clearTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  },

  async start() {
    const session = await request({
      path: "/learn/daily/start",
      method: "POST",
      data: { minutes: this.data.minutes },
    });
    this.applySession(session);
  },

  play(e) { speak(e.currentTarget.dataset.text); },

  async submitTask(correct) {
    const { session, current } = this.data;
    const updated = await request({
      path: `/learn/daily/${session._id || session.id}/task/${current._id}`,
      method: "POST",
      data: { correct },
    });
    this.applySession(updated);
    if (updated.remaining === 0) this.finish(updated);
  },

  submitWord(e) {
    this.submitTask(e.currentTarget.dataset.opt === this.data.current.payload.answer);
  },
  submitChoice(e) {
    this.submitTask(e.currentTarget.dataset.opt === this.data.current.payload.answer);
  },
  markPronounce() { this.submitTask(true); },

  async finish(s) {
    const session = s || this.data.session;
    const result = await request({
      path: `/learn/daily/${session._id || session.id}/complete`,
      method: "POST",
    });
    this.clearTimer();
    this.setData({
      session: result.session,
      completed: true,
      current: null,
      msg: `打卡成功，+${result.xpEarned} XP，连续 ${result.streak} 天`,
    });
    const user = getApp().globalData.user || {};
    user.streak = result.streak;
    user.xp = result.xp;
    getApp().setUser(user);
  },

  goReview() { wx.navigateTo({ url: "/pages/review/review" }); },
});
