export const categories = [
  { slug: "documents", name: "票据单据", nameEn: "Documents", emoji: "🧾", color: "#C9A227", examFocus: "CET6", description: "收据、发票、账单、凭证放在一张词表里对照记，商务六级高频。", stage: "A2", clusters: [
    { slug: "papers", name: "票据单据", nameEn: "Papers", emoji: "🧾" },
    { slug: "office-docs", name: "商务文件", nameEn: "Office files", emoji: "📁" },
    { slug: "finance-docs", name: "财务票据", nameEn: "Finance", emoji: "💹" },
  ]},
  { slug: "home", name: "家", nameEn: "Home", emoji: "🏠", color: "#4A7C59", examFocus: "CET4", description: "以「家」为中心，房屋、庭院、电器、陈设连成一张脑图。", stage: "A1", clusters: [
    { slug: "structure", name: "房屋结构", nameEn: "Structure", emoji: "🏠" },
    { slug: "garden", name: "庭院花草", nameEn: "Garden", emoji: "🌸" },
    { slug: "living", name: "起居电器", nameEn: "Living", emoji: "📺" },
    { slug: "decor", name: "陈设音乐", nameEn: "Decor", emoji: "🎸" },
  ]},
  { slug: "vegetables", name: "蔬菜", nameEn: "Vegetables", emoji: "🥕", color: "#3D8B6E", examFocus: "CET4", description: "把餐桌上的蔬菜放进同一篮子。", stage: "A1", clusters: [{ slug: "common", name: "常见蔬菜", nameEn: "Common", emoji: "🥕" }] },
  { slug: "fruits", name: "水果", nameEn: "Fruits", emoji: "🍎", color: "#E07A5F", examFocus: "CET4", description: "颜色和味道都能当记忆钩子。", stage: "A1", clusters: [{ slug: "common", name: "常见水果", nameEn: "Common", emoji: "🍎" }] },
  { slug: "animals", name: "动物", nameEn: "Animals", emoji: "🐶", color: "#D4A017", examFocus: "CET6", description: "从宠物到濒危物种，六级阅读常考。", stage: "A1", clusters: [
    { slug: "pets", name: "宠物家畜", nameEn: "Pets", emoji: "🐶" },
    { slug: "wildlife", name: "野生动物", nameEn: "Wildlife", emoji: "🦁" },
  ]},
  { slug: "transport", name: "交通出行", nameEn: "Transport", emoji: "✈️", color: "#3D7EA6", examFocus: "CET4", description: "工具 + 机场车站用语。", stage: "A1", clusters: [
    { slug: "vehicles", name: "交通工具", nameEn: "Vehicles", emoji: "🚌" },
    { slug: "travel-words", name: "出行用语", nameEn: "Travel", emoji: "🛂" },
  ]},
  { slug: "food", name: "餐饮", nameEn: "Dining", emoji: "🍜", color: "#C45C26", examFocus: "CET4", description: "点餐、口味、食材。", stage: "A2", clusters: [{ slug: "dining", name: "餐厅点餐", nameEn: "Dining", emoji: "🍽️" }] },
  { slug: "cooking", name: "烹饪", nameEn: "Cooking", emoji: "🍳", color: "#B45309", examFocus: "CET4", description: "煮煎蒸烤和厨具放一起。", stage: "A2", clusters: [{ slug: "kitchen", name: "烹饪厨房", nameEn: "Kitchen", emoji: "🔪" }] },
  { slug: "hotel", name: "酒店", nameEn: "Hotel", emoji: "🏨", color: "#6B5B95", examFocus: "CET4", description: "入住、设施、服务。", stage: "A2", clusters: [{ slug: "stay", name: "入住设施", nameEn: "Stay", emoji: "🛎️" }] },
  { slug: "beach", name: "海边", nameEn: "Beach", emoji: "🏖️", color: "#2A9D8F", examFocus: "CET4", description: "度假和安全用语。", stage: "A2", clusters: [{ slug: "seaside", name: "海边度假", nameEn: "Seaside", emoji: "🌊" }] },
  { slug: "daily", name: "日常用语", nameEn: "Daily", emoji: "💬", color: "#4A7C59", examFocus: "CET4", description: "最基本的请求和礼貌用语。", stage: "A1", clusters: [{ slug: "basics", name: "日常基础", nameEn: "Basics", emoji: "🙏" }] },
  { slug: "clothing", name: "服饰", nameEn: "Clothes", emoji: "👕", color: "#7C3AED", examFocus: "CET4", description: "衣着和面料。", stage: "A2", clusters: [{ slug: "wear", name: "衣着穿戴", nameEn: "Wear", emoji: "👗" }] },
  { slug: "body", name: "身体", nameEn: "Body", emoji: "🧠", color: "#DC2626", examFocus: "CET4", description: "部位和器官，看病时用得上。", stage: "A1", clusters: [{ slug: "parts", name: "身体部位", nameEn: "Parts", emoji: "🦴" }] },
  { slug: "emotions", name: "情绪性格", nameEn: "Feelings", emoji: "😊", color: "#DB2777", examFocus: "CET4", description: "把心情词放在一起，写作更准。", stage: "A2", clusters: [{ slug: "feelings", name: "情绪性格", nameEn: "Feelings", emoji: "💗" }] },
  { slug: "weather", name: "天气", nameEn: "Weather", emoji: "⛅", color: "#0284C7", examFocus: "CET4", description: "天气和预报。", stage: "A2", clusters: [{ slug: "climate-words", name: "天气气候", nameEn: "Climate", emoji: "🌡️" }] },
  { slug: "time", name: "时间", nameEn: "Time", emoji: "⏰", color: "#0F766E", examFocus: "CET4", description: "时刻、日程、期限。", stage: "A1", clusters: [{ slug: "calendar", name: "时间日历", nameEn: "Calendar", emoji: "📅" }] },
  { slug: "sports", name: "运动", nameEn: "Sports", emoji: "⚽", color: "#16A34A", examFocus: "CET4", description: "项目、场馆、比赛。", stage: "A2", clusters: [{ slug: "games", name: "运动项目", nameEn: "Games", emoji: "🏆" }] },
  { slug: "office", name: "职场", nameEn: "Office", emoji: "💼", color: "#1E3A5F", examFocus: "CET6", description: "会议、薪水、晋升，六级听力常客。", stage: "B1", clusters: [{ slug: "workplace", name: "职场办公", nameEn: "Workplace", emoji: "👔" }] },
  { slug: "work-verbs", name: "职场动词", nameEn: "Work verbs", emoji: "⚙️", color: "#334155", examFocus: "CET6", description: "实施、协调、优化——报告里的高频动词。", stage: "B1", clusters: [{ slug: "action", name: "职场动词", nameEn: "Actions", emoji: "▶️" }] },
  { slug: "education", name: "教育", nameEn: "Education", emoji: "🎓", color: "#1D4ED8", examFocus: "CET6", description: "校园、学位、课程。", stage: "A2", clusters: [{ slug: "campus", name: "校园学习", nameEn: "Campus", emoji: "📚" }] },
  { slug: "academic", name: "学术写作", nameEn: "Academic", emoji: "📘", color: "#4338CA", examFocus: "IELTS", description: "雅思写作核心：分析、评估、显著、因此。", stage: "B2", clusters: [
    { slug: "awl", name: "学术核心词", nameEn: "AWL", emoji: "📗" },
    { slug: "verbs", name: "学术动词", nameEn: "Verbs", emoji: "✍️" },
    { slug: "adj", name: "学术形容词", nameEn: "Adjectives", emoji: "🏷️" },
  ]},
  { slug: "environment", name: "环境", nameEn: "Environment", emoji: "🌍", color: "#15803D", examFocus: "IELTS", description: "污染、气候、可持续，雅思大作文常考。", stage: "B1", clusters: [{ slug: "planet", name: "环境气候", nameEn: "Planet", emoji: "♻️" }] },
  { slug: "health", name: "健康医疗", nameEn: "Health", emoji: "🩺", color: "#B91C1C", examFocus: "CET6", description: "症状、处方、营养。", stage: "B1", clusters: [{ slug: "body", name: "健康医疗", nameEn: "Medical", emoji: "💊" }] },
  { slug: "technology", name: "科技", nameEn: "Technology", emoji: "💻", color: "#0E7490", examFocus: "IELTS", description: "算法、隐私、人工智能。", stage: "B1", clusters: [{ slug: "digital", name: "科技数码", nameEn: "Digital", emoji: "🤖" }] },
  { slug: "economy", name: "经济金融", nameEn: "Economy", emoji: "📈", color: "#A16207", examFocus: "CET6", description: "通胀、投资、衰退。", stage: "B1", clusters: [{ slug: "money", name: "经济金融", nameEn: "Finance", emoji: "💰" }] },
  { slug: "society", name: "社会", nameEn: "Society", emoji: "🏘️", color: "#7E22CE", examFocus: "IELTS", description: "平等、福利、城市化。", stage: "B2", clusters: [{ slug: "civic", name: "社会文化", nameEn: "Civic", emoji: "⚖️" }] },
  { slug: "nature", name: "自然地理", nameEn: "Nature", emoji: "⛰️", color: "#3F6212", examFocus: "CET6", description: "地形、灾害、地理名词。", stage: "B1", clusters: [{ slug: "earth", name: "自然地理", nameEn: "Earth", emoji: "🌋" }] },
  { slug: "city", name: "城市生活", nameEn: "City", emoji: "🏙️", color: "#475569", examFocus: "CET6", description: "通勤、租金、拥堵。", stage: "B1", clusters: [{ slug: "urban-life", name: "城市生活", nameEn: "Urban", emoji: "🚇" }] },
  { slug: "law", name: "法律", nameEn: "Law", emoji: "⚖️", color: "#1E293B", examFocus: "IELTS", description: "法庭、立法、有罪无罪。", stage: "B2", clusters: [{ slug: "justice", name: "法律公正", nameEn: "Justice", emoji: "👩‍⚖️" }] },
  { slug: "media", name: "媒体", nameEn: "Media", emoji: "📰", color: "#9A3412", examFocus: "CET6", description: "新闻、偏见、传播。", stage: "B1", clusters: [{ slug: "news", name: "媒体传播", nameEn: "News", emoji: "📡" }] },
  { slug: "science", name: "科学", nameEn: "Science", emoji: "🔬", color: "#155E75", examFocus: "IELTS", description: "实验、基因、物理化学。", stage: "B2", clusters: [{ slug: "lab", name: "科学实验", nameEn: "Lab", emoji: "🧪" }] },
  { slug: "relationships", name: "人际关系", nameEn: "People", emoji: "🫂", color: "#BE185D", examFocus: "CET4", description: "朋友、信任、妥协。", stage: "A2", clusters: [{ slug: "people", name: "人际关系", nameEn: "People", emoji: "🤝" }] },
  { slug: "ielts-topics", name: "雅思话题词", nameEn: "IELTS topics", emoji: "🎯", color: "#7F1D1D", examFocus: "IELTS", description: "大作文现成词块：全球化、工作生活平衡、文化遗产。", stage: "B2", clusters: [{ slug: "global", name: "雅思话题", nameEn: "Topics", emoji: "🌐" }] },
];

export { roots } from "./roots.js";

export { words } from "./lexicon.js";

export { scenarios } from "./scenarios.js";

export { grammarLessons } from "./grammar.js";

export const levelTests = [
  {
    level: "A1",
    title: "A1 入门测试",
    description: "能认常见名词，会用 be 动词和最简单的请求。",
    passScore: 70,
    questions: [
      { type: "vocab", prompt: "carrot 的意思是？", options: ["土豆", "胡萝卜", "洋葱", "香蕉"], answer: 1, explain: "carrot = 胡萝卜。" },
      { type: "vocab", prompt: "哪一个是水果？", options: ["cabbage", "bus", "apple", "gate"], answer: 2, explain: "apple 是苹果。" },
      { type: "grammar", prompt: "I ____ a student.", options: ["is", "are", "am", "be"], answer: 2, explain: "I 配 am。" },
      { type: "grammar", prompt: "____ apple, please.", options: ["A", "An", "Thes", "Some a"], answer: 1, explain: "an apple。" },
      { type: "listening", prompt: "听句子，选择意思：", audioText: "Can I have some water, please?", options: ["请给我水", "我想退房", "飞机起飞了", "这道菜很辣"], answer: 0, explain: "请求给水。" },
      { type: "scenario", prompt: "想礼貌地请人帮忙，说：", options: ["Help me now!", "Can you help me, please?", "You must help.", "I am help."], answer: 1, explain: "Can you ... please 更礼貌。" },
      { type: "vocab", prompt: "plane 是？", options: ["火车", "飞机", "出租车", "轮船"], answer: 1, explain: "plane = 飞机。" },
      { type: "grammar", prompt: "She ____ happy.", options: ["am", "is", "are", "be"], answer: 1, explain: "she 配 is。" },
    ],
  },
  {
    level: "A2",
    title: "A2 基础测试",
    description: "能完成酒店、机场、餐厅的简单对话，并使用过去时。",
    passScore: 70,
    questions: [
      { type: "vocab", prompt: "reservation 的意思是？", options: ["退房", "预订", "登机口", "账单"], answer: 1, explain: "reservation = 预订。" },
      { type: "scenario", prompt: "餐厅结账时说：", options: ["Check-in, please.", "Could we have the bill, please?", "Go to gate 12.", "I am swimming."], answer: 1, explain: "the bill 是账单。" },
      { type: "grammar", prompt: "Yesterday I ____ to the airport.", options: ["go", "goes", "went", "going"], answer: 2, explain: "go 的过去式 went。" },
      { type: "vocab", prompt: "-able 常表示？", options: ["再一次", "能够……的", "没有", "之前"], answer: 1, explain: "able = capable of。" },
      { type: "listening", prompt: "听句子，选择场景：", audioText: "Please go to gate eighteen. Boarding starts at ten thirty.", options: ["酒店入住", "机场登机", "海边租伞", "点餐"], answer: 1, explain: "gate 和 boarding 是机场。" },
      { type: "grammar", prompt: "The room is ____ the third floor.", options: ["in", "on", "at", "to"], answer: 1, explain: "楼层用 on。" },
      { type: "scenario", prompt: "想要靠窗座位：", options: ["I'd like a window seat.", "I'd like a spicy soup.", "I'd like sunscreen.", "I'd like check-out."], answer: 0, explain: "window seat。" },
      { type: "vocab", prompt: "unhappy 里的 un- 表示？", options: ["再次", "否定", "能够", "充满"], answer: 1, explain: "un- = not。" },
    ],
  },
  {
    level: "B1",
    title: "B1 进阶测试",
    description: "能灵活使用词根、情态动词，并听懂稍长的场景指令。",
    passScore: 70,
    questions: [
      { type: "vocab", prompt: "disable 的结构是？", options: ["re + able", "dis + able", "pre + able", "un + ful"], answer: 1, explain: "dis- 否定 + able。" },
      { type: "grammar", prompt: "You ____ show your passport at the gate.", options: ["must", "must to", "musting", "are must"], answer: 0, explain: "must + 原形。" },
      { type: "scenario", prompt: "海浪很大时，更合适的建议是：", options: ["You should stay near the shore.", "You must eat spicy food.", "Can I have the bill?", "I am a carrot."], answer: 0, explain: "should 提出安全建议。" },
      { type: "listening", prompt: "听句子，选择意思：", audioText: "A double room is available on the third floor. Breakfast is included.", options: ["没有房间了", "三楼有双人房且含早餐", "需要重新值机", "只提供辣的食物"], answer: 1, explain: "available 和 breakfast is included。" },
      { type: "vocab", prompt: "information 属于哪类构词？", options: ["-able", "-tion", "un-", "-less"], answer: 1, explain: "inform + tion。" },
      { type: "grammar", prompt: "We ____ staying near the beach this week.", options: ["is", "am", "are", "be"], answer: 2, explain: "现在进行时 are staying。" },
      { type: "vocab", prompt: "available 更接近？", options: ["好吃的", "可获得的", "超重的", "危险的"], answer: 1, explain: "available = 有空/可用。" },
      { type: "scenario", prompt: "广播不清楚时可以说：", options: ["The announcement is unclear. Could you repeat that?", "I want a cabbage.", "Check-out is spicy.", "The sand is a ticket."], answer: 0, explain: "unclear + repeat 是实用组合。" },
    ],
  },
  {
    level: "B2",
    title: "B2 巩固测试",
    description: "综合词汇、语法和场景，检验能否独立完成旅行沟通。",
    passScore: 75,
    questions: [
      { type: "vocab", prompt: "portable charger 强调的是？", options: ["很贵", "可以携带", "已经损坏", "需要预订"], answer: 1, explain: "port + able，能被携带的。" },
      { type: "grammar", prompt: "If the waves are big, you ____ swim far.", options: ["shouldn't", "shouldn't to", "don't should", "aren't should"], answer: 0, explain: "shouldn't + 原形。" },
      { type: "scenario", prompt: "行李超重，最得体的回应是：", options: ["That's impossible. I leave.", "Oh, I see. Can I take this bag as carry-on?", "Give me discount spicy.", "I am hopping less."], answer: 1, explain: "先确认，再商量手提行李。" },
      { type: "listening", prompt: "听句子，判断说话人想做什么：", audioText: "I'd like to rent two chairs and an umbrella for the day. Is it safe to swim here?", options: ["办理登机", "在海边租设备和确认安全", "点一份沙拉", "询问退房"], answer: 1, explain: "rent chairs / swim 是海滩场景。" },
      { type: "vocab", prompt: "preview 中 pre- 的含义？", options: ["之后", "之前", "没有", "能够"], answer: 1, explain: "pre- = before。" },
      { type: "grammar", prompt: "I didn't ____ the key yesterday.", options: ["returned", "return", "returning", "returns"], answer: 1, explain: "didn't 后用原形。" },
      { type: "vocab", prompt: "hopeless 和 hopeful 的差别主要在？", options: ["前缀 un/re", "后缀 -less / -ful", "词性变成动词", "过去式"], answer: 1, explain: "-ful 充满，-less 没有。" },
      { type: "scenario", prompt: "综合表达：入住时发现房间不安静，可以说：", options: ["I'd like a quieter room if one is available.", "I am vegetable.", "Gate please spicy.", "The bill is a passport."], answer: 0, explain: "quieter + available 是得体请求。" },
    ],
  },
];
