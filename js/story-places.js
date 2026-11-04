/* =========================================================
   ve创作 — 故事发生地（用于首页「故事发生的地方」地图）

   数据与 js/stories.js 的 24 篇故事一一对应：
   id 对应故事 id，place 为城市级地点，lat/lng 为近似坐标，
   year 为故事发生（或被记录）的年份。

   说明：坐标为城市/地区级近似值，仅用于示意，不用于导航。
   ========================================================= */

window.STORY_PLACES = [
  { id: "martha", place: "美国 · 辛辛那提", lat: 39.14, lng: -84.51, year: "1914", title: "最后一只旅鸽：玛莎" },
  { id: "dodo", place: "毛里求斯", lat: -20.16, lng: 57.50, year: "1681", title: "渡渡鸟" },
  { id: "baiji", place: "中国 · 长江", lat: 30.59, lng: 114.30, year: "2006", title: "白鱀豚：长江女神的告别" },
  { id: "crested-ibis", place: "中国 · 陕西洋县", lat: 33.22, lng: 107.55, year: "1981", title: "朱鹮：从最后 7 只到全球万只" },
  { id: "pere-david-deer", place: "中国 · 江苏大丰", lat: 33.20, lng: 120.63, year: "1986", title: "麋鹿：流亡百年，重归故土" },
  { id: "chiru", place: "中国 · 可可西里", lat: 35.60, lng: 93.06, year: "1990s", title: "藏羚羊：从濒危到近危" },
  { id: "yangtze-finless-porpoise", place: "中国 · 长江中游", lat: 30.30, lng: 112.20, year: "1990", title: "长江江豚：微笑天使的回声" },
  { id: "dunhuang", place: "中国 · 甘肃敦煌", lat: 40.14, lng: 94.66, year: "366", title: "敦煌莫高窟" },
  { id: "leshan-buddha", place: "中国 · 四川乐山", lat: 29.55, lng: 103.77, year: "713", title: "乐山大佛" },
  { id: "tu-youyou", place: "中国 · 北京", lat: 39.90, lng: 116.40, year: "1972", title: "屠呦呦与青蒿素" },
  { id: "deep-sea-vent", place: "加拉帕戈斯 · 深海热泉", lat: 0.00, lng: -86.00, year: "1977", title: "深海热泉" },
  { id: "easter-island", place: "智利 · 复活节岛", lat: -27.11, lng: -109.35, year: "1200", title: "复活节岛：摩艾石像与生态警示" },
  { id: "asian-elephant", place: "中国 · 西双版纳", lat: 22.00, lng: 100.80, year: "2021", title: "亚洲象「短鼻家族」北游记" },
  { id: "finland-everymans-right", place: "芬兰 · 赫尔辛基", lat: 60.17, lng: 24.94, year: "1990s", title: "芬兰「每个人的权利」" },
  { id: "california-condor", place: "美国 · 加州", lat: 34.45, lng: -119.75, year: "1987", title: "加州神鹫" },
  { id: "yangtze-sturgeon", place: "中国 · 长江上游", lat: 31.00, lng: 110.00, year: "2022", title: "长江鲟：没有等到回家的那一天" },
  { id: "zhang-guimei", place: "中国 · 云南华坪", lat: 26.63, lng: 101.27, year: "2008", title: "张桂梅：大山里的女高校长" },
  { id: "yuan-longping", place: "中国 · 湖南长沙", lat: 28.19, lng: 112.98, year: "1973", title: "袁隆平：让所有人远离饥饿" },
  { id: "bhutan-gnh", place: "不丹 · 廷布", lat: 27.47, lng: 89.64, year: "1972", title: "不丹：用「幸福」代替 GDP" },
  { id: "iceland-althing", place: "冰岛 · 辛格维利尔", lat: 64.26, lng: -21.13, year: "930", title: "冰岛议会" },
  { id: "anti-food-waste-law", place: "中国 · 北京", lat: 39.95, lng: 116.32, year: "2021", title: "反食品浪费法" },
  { id: "sea-otter", place: "美国 · 加州海岸", lat: 36.60, lng: -121.90, year: "1911", title: "海獭" },
  { id: "duozhuayu", place: "中国 · 北京", lat: 39.85, lng: 116.48, year: "2017", title: "多抓鱼" },
  { id: "new-zealand-animal-welfare", place: "新西兰 · 惠灵顿", lat: -41.29, lng: 174.78, year: "2015", title: "新西兰：用法律承诺「善待动物」" }
];
