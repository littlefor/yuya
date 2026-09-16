const generated = require("./config.generated.js");

module.exports = {
  apiBase: generated.apiBase || "http://127.0.0.1:8080",
  demoEmail: "demo@linguaseed.app",
  demoPassword: "demo123",
};
