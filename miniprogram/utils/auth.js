const TOKEN_KEY = "linguaseed_token";

function getToken() {
  return wx.getStorageSync(TOKEN_KEY) || "";
}

function setToken(token) {
  if (token) wx.setStorageSync(TOKEN_KEY, token);
  else wx.removeStorageSync(TOKEN_KEY);
}

function requireLogin() {
  if (getToken()) return true;
  wx.reLaunch({ url: "/pages/login/login" });
  return false;
}

module.exports = { getToken, setToken, requireLogin };
