/** Docker 启动时会按 API_BASE_URL 覆盖此文件。本地默认走 PC 的 Nginx 反代。 */
module.exports = {
  apiBase: "http://127.0.0.1:8080",
};
