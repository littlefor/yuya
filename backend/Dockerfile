FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --omit=dev --registry=https://registry.npmmirror.com
COPY src ./src
EXPOSE 4000
CMD ["node", "src/index.js"]
