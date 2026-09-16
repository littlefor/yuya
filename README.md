# 语芽 LinguaSeed

给想系统学英语、又不想一上来就付费订阅的人用的开源学习应用。默认用中文界面学英语内容，覆盖记单词、场景口语、发音、语法、每日打卡和阶段测试。

技术栈：**React + Node.js + MongoDB**，用 **Docker Compose** 一键部署。

## 产品思路（参考了哪些做法）

| 参考 | 学到什么 | 语芽里怎么做 |
| --- | --- | --- |
| [Anki](https://apps.ankiweb.net/) / 超级记忆 | 间隔重复，难的词早点再见 | SM-2 算法，不认识/模糊/认识三档 |
| [百词斩](https://www.baicizhan.com/) | 图词绑定 | 每个词有主题色卡、emoji 图、音标、例句 |
| 不背单词 / 扇贝 | 主题词书，而不是乱序表 | 蔬菜、水果、交通、酒店等分类；另做词根簇 |
| [Duolingo](https://www.duolingo.com/) | 短时打卡、连续天数、经验值 | 10 / 15 / 30 分钟任务，streak + XP |
| 英语流利说 / ELSA | 开口比只看更重要 | Web Speech 跟读打分，可键盘对照 |
| BBC Learning English / 情景口语书 | 按生活场景学句子 | 酒店、机场、餐厅、海边四套对话 + 小测 |
| CEFR / 雅思进阶路径 | 阶段可被验证 | A1→B2 关卡测试，通过才解锁下一关 |

记单词的两条科学路径：

1. **语义归类**：胡萝卜、卷心菜、土豆放在「蔬菜」里，提取时走同一条线索。
2. **形态归类**：`able` 表示「能够」→ `disable` / `enable` / `available` / `comfortable`。

每天任务会把「新词 + 到期复习 + 昨天错词 + 语法/场景」拼在一起，避免只刷新的、不看旧的。

## 本地 Docker 部署

机器需安装 Docker 与 Docker Compose。在项目根目录：

```bash
docker compose up --build -d
```

浏览器打开 [http://localhost:8080](http://localhost:8080)

微信小程序预览页：[http://localhost:8090](http://localhost:8090)（下载代码包，用[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)导入 `miniprogram/`）

体验账号：

- 邮箱 `demo@linguaseed.app`
- 密码 `demo123`

Docker 镜像构建默认走 `npmmirror`，国内服务器会更快。若你的环境访问 npm 官方源更顺，可把 Dockerfile 里的 `--registry=...` 去掉。

```bash
JWT_SECRET='请换成足够长的随机串' docker compose up --build -d
```

停止：

```bash
docker compose down
```

数据在 Docker volume `mongo_data` 里。需要重新灌入课程内容时：

```bash
docker compose exec backend sh -c 'FORCE_SEED=true node -e "import(\"./src/seed/index.js\").then(m => m.seedDatabase().then(console.log))"'
```

更干净的做法是清空 Mongo 后重启 backend（会自动 seed）。

## 本地开发（不用 Docker 跑前端时）

另开一个 MongoDB（本机或 Docker 只起数据库），然后：

```bash
# 终端 1
cd backend
npm install
MONGO_URI=mongodb://127.0.0.1:27017/linguaseed npm run dev

# 终端 2
cd frontend
npm install
npm run dev
```

前端开发服务器在 [http://localhost:5173](http://localhost:5173)，`/api` 会代理到 4000 端口。

## 微信小程序

源码在 `miniprogram/`，按[微信小程序开发指南](https://developers.weixin.qq.com/miniprogram/dev/framework/)使用原生 WXML / WXSS / JS。底部 Tab 为：今日、单词、场景、语法、我的；词根、打卡、复习、发音、测试在二级页。

```bash
docker compose up --build -d
```

1. 打开 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，导入目录 `miniprogram/`（AppID 可先用测试号）。
2. 详情 → 本地设置：勾选「不校验合法域名」。
3. 小程序默认请求 [http://127.0.0.1:8080](http://127.0.0.1:8080) 的 `/api`，与 PC Docker 网页共用后端。
4. Docker 还会在 [http://localhost:8090](http://localhost:8090) 提供导入说明和 `linguaseed-miniprogram.zip`。

生产环境需要：

- 在 `project.config.json` 填入你的小程序 AppID
- 后端使用 HTTPS，并在公众平台配置 request 合法域名
- 发音音频域名 `dict.youdao.com` 配到 downloadFile / 音频合法域名
- 可用环境变量 `MINIPROGRAM_API_BASE=https://你的域名` 再构建 miniprogram 镜像

## 目录

```
backend/          Express API、SM-2、课程种子数据
frontend/         React PC 网页
miniprogram/      微信小程序（开发者工具导入）
docker-compose.yml
```

## 接下来可以加的（刻意没做进第一版）

- 接入真实单词图片 CDN / 自己的对象存储
- 更大词库（CET-4、雅思、商务）
- 语音评测换成专业 API
- 学习提醒（邮件或手机推送）
- 多用户班级 / 家长监督

课程内容在 `backend/src/seed/content.js`，改完后设 `FORCE_SEED=true` 或清空集合即可重新导入。
