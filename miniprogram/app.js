const { getToken, setToken } = require("./utils/auth");
const { request } = require("./utils/api");

App({
  globalData: {
    user: null,
    ready: false,
  },

  onLaunch() {
    this.restoreSession();
  },

  restoreSession() {
    if (!getToken()) {
      this.globalData.user = null;
      this.globalData.ready = true;
      return;
    }
    request({ path: "/auth/me" })
      .then((data) => {
        this.globalData.user = data.user;
      })
      .catch(() => {
        setToken("");
        this.globalData.user = null;
      })
      .then(() => {
        this.globalData.ready = true;
      });
  },

  setUser(user) {
    this.globalData.user = user;
  },
});
