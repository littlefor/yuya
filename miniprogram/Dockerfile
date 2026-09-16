FROM nginx:1.27-alpine
RUN apk add --no-cache zip
WORKDIR /app
COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY preview /preview
COPY . /app/miniprogram
RUN chmod +x /docker-entrypoint.sh \
  && rm -f /app/miniprogram/Dockerfile /app/miniprogram/docker-entrypoint.sh /app/miniprogram/nginx.conf \
  && rm -rf /app/miniprogram/preview
EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
