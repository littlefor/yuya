const { apiBase } = require("../config.js");
const { getToken } = require("./auth");

function request(options) {
  const path = options.path;
  const method = options.method || "GET";
  const data = options.data;
  const auth = options.auth !== false;
  const token = getToken();
  const header = { "Content-Type": "application/json" };
  if (auth && token) header.Authorization = "Bearer " + token;

  return new Promise((resolve, reject) => {
    wx.request({
      url: apiBase + "/api" + path,
      method: method,
      data: method === "GET" ? undefined : (data || {}),
      header: header,
      success(res) {
        const body = res.data || {};
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
          return;
        }
        if (res.statusCode === 401) {
          wx.removeStorageSync("linguaseed_token");
          wx.reLaunch({ url: "/pages/login/login" });
        }
        reject(new Error(body.message || "请求失败"));
      },
      fail(err) {
        console.error(err);
        reject(new Error("连不上服务器。请确认 Docker 已启动，并在开发者工具关闭合法域名校验。"));
      },
    });
  });
}

function speak(text) {
  if (!text) return;
  const audio = wx.createInnerAudioContext();
  audio.src = "https://dict.youdao.com/dictvoice?audio=" + encodeURIComponent(text) + "&type=1";
  audio.play();
  audio.onEnded(function () { audio.destroy(); });
  audio.onError(function () { audio.destroy(); });
}

module.exports = { request: request, speak: speak, apiBase: apiBase };
