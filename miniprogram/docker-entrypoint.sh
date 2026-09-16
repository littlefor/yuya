#!/bin/sh
set -eu

API_BASE_URL="${API_BASE_URL:-http://127.0.0.1:8080}"

mkdir -p /usr/share/nginx/html

cat > /app/miniprogram/config.generated.js <<EOF
/** 由 Docker 入口脚本根据 API_BASE_URL 生成 */
module.exports = {
  apiBase: "${API_BASE_URL}",
};
EOF

sed "s|__API_BASE__|${API_BASE_URL}|g" /preview/index.html > /usr/share/nginx/html/index.html

cd /app/miniprogram
zip -qr /usr/share/nginx/html/linguaseed-miniprogram.zip . \
  -x "Dockerfile" -x "docker-entrypoint.sh" -x "nginx.conf" -x "preview/*" -x "*.DS_Store"

echo "LinguaSeed miniprogram pack ready. API_BASE_URL=${API_BASE_URL}"
exec nginx -g "daemon off;"
