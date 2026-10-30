/* =========================================================
   ve创作 — 时空灵感：故事数据（纯原生 JavaScript，无框架无库）

   【固定分类白名单】
   CATEGORIES = ["说再见","回家","群星闪耀","没人知道的角落","硬币的两面","一纸之令"]
   筛选条仅从此白名单生成（外加第一个"全部"），不允许其他分类名。

   【编辑红线 / 收录原则】
   - 一纸之令：只收"制度改变生活"的历史故事和社会进步成果，不收现实争议时事；
     其中罪案只收已结案、有权威来源的历史名案/翻案故事，不收血腥猎奇。
   - 硬币的两面：收商业史和小人物与钱的故事，不收投资建议。
   - 全部栏目：不收肉食、皮草、动物制品消费类内容。
   - 与动物相关的故事只收录保护、共生、灭绝警示类。
   ve创作只是信息集合地，原文表达与观点归作者所有，不代表官方立场，
   也未获得所有作者的转载许可。
   ========================================================= */

const CATEGORIES = ["说再见", "回家", "群星闪耀", "没人知道的角落", "硬币的两面", "一纸之令"];

const STORIES = [
  // ---------- 说再见（物种灭绝与永别）----------
  {
    id: "martha",
    category: "说再见",
    title: "最后一只旅鸽：玛莎",
    desc: "旅鸽曾是北美数量最多的鸟，种群估计达 30-50 亿只；因商业猎杀与栖息地破坏，短短几十年从遮天蔽日到彻底消失。1914 年 9 月 1 日，最后一只旅鸽玛莎在辛辛那提动物园去世，宣告物种灭绝——这是人类造成的有记录的第一次物种灭绝，也是环保运动的警示里程碑。",
    tags: ["1914 · 美国辛辛那提", "物种灭绝", "环保警示"],
    image: "https://aka.doubaocdn.com/s/FU2FT2JD3G",
    caption: "图源：史密森尼国家自然历史博物馆（标本照片）",
    link: "https://www.si.edu/collections/snapshot/last-passenger-pigeon",
    sources: [
      { name: "辛辛那提动物园", url: "https://cincinnatizoo.org/animals-archive/project-passenger-pigeon/" },
      { name: "史密森尼杂志", url: "https://www.smithsonianmag.com/smithsonian-institution/martha-the-worlds-last-passenger-pigeon-67196038/" }
    ]
  },
  {
    id: "dodo",
    category: "说再见",
    title: "渡渡鸟：人类认识它不到百年，它就消失了",
    desc: "渡渡鸟是毛里求斯岛特有的不会飞的鸟类，1598 年荷兰水手首次有文字记载。因无天敌、性格温顺又不会飞，被人类捕杀并引入外来物种，短短不到一百年便彻底灭绝，1681 年左右见最后一只活鸟。它成为“人类导致物种灭绝”的最早象征之一。",
    tags: ["1598 · 毛里求斯", "物种灭绝", "人类影响"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Dodo.jpg?width=800",
    caption: "图源：Wikimedia Commons · 奥斯曼·埃尔德米尔绘（历史插图）· Public domain",
    link: "https://www.britannica.com/animal/dodo",
    sources: [
      { name: "大英百科全书", url: "https://www.britannica.com/animal/dodo" }
    ]
  },
  {
    id: "baiji",
    category: "说再见",
    title: "白鱀豚：长江女神的告别",
    desc: "白鱀豚是长江特有的淡水海豚，被称为“长江女神”。2006 年科考考察未能发现任何活体白鱀豚，2007 年国际自然保护联盟将其列为“灭绝”。这是人类活动导致的第一种鲸豚类物种灭绝，也成为长江保护的深刻警示。",
    tags: ["2006 · 长江", "物种灭绝", "淡水海豚"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Lipotes_vexillifer.jpg?width=800",
    caption: "图源：Wikimedia Commons · Kearney et al. · 公众领域",
    link: "https://www.iucnredlist.org/species/12119/50367793",
    sources: [
      { name: "IUCN 红色名录", url: "https://www.iucnredlist.org/species/12119/50367793" }
    ]
  },
  // ---------- 回家（物种回归与保护成功）----------
  {
    id: "crested-ibis",
    category: "回家",
    title: "朱鹮：从最后7只到全球万只",
    desc: "朱鹮曾被认为已经灭绝，1981 年在陕西洋县重新发现仅存 7 只野生朱鹮。经过人工繁育与放归，全球朱鹮数量已突破万只，成为世界上珍稀鸟类保护的成功案例之一。",
    tags: ["1981 · 陕西洋县", "珍稀鸟类", "保护成功"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Nipponia_nippon.jpg?width=800",
    caption: "图源：Wikimedia Commons · 公众领域",
    link: "https://www.iucnredlist.org/species/106002335/155516442",
    sources: [
      { name: "IUCN 红色名录", url: "https://www.iucnredlist.org/species/106002335/155516442" }
    ]
  },
  {
    id: "pere-david-deer",
    category: "回家",
    title: "麋鹿：流亡百年，重归故土",
    desc: "麋鹿原产中国，19世纪末因战争与猎杀在中国绝迹，仅存少量被流散到欧洲动物园。1985 年，20 只麋鹿从英国温莎动物园重返中国南海苑，此后陆续放归野外，逐步回归故土。",
    tags: ["1985 · 重返中国", "物种回归", "保护成功"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Elaphurus_davidianus.jpg?width=800",
    caption: "图源：Wikimedia Commons · 公众领域",
    link: "https://www.iucnredlist.org/species/7066/155516075",
    sources: [
      { name: "IUCN 红色名录", url: "https://www.iucnredlist.org/species/7066/155516075" }
    ]
  },
  {
    id: "chiru",
    category: "回家",
    title: "藏羚羊：从濒危到近危",
    desc: "藏羚羊曾因抢夺绒毛而大量被猎，种群锐减。经过青藏高原保护与反偷猎行动，2016 年 IUCN 将其等级从“濒危”下调为“近危”，是中国野生动物保护的里程碑。",
    tags: ["青藏高原", "濒危降级", "反偷猎"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Pantholops_hodgsonii.jpg?width=800",
    caption: "图源：Wikimedia Commons · 公众领域",
    link: "https://www.iucnredlist.org/species/16242/155515894",
    sources: [
      { name: "IUCN 红色名录", url: "https://www.iucnredlist.org/species/16242/155515894" }
    ]
  },
  {
    id: "yangtze-finless-porpoise",
    category: "回家",
    title: "长江江豚：微笑天使的回声",
    desc: "长江江豚是长江中下游特有的淡水鲸豚类，因“微笑”脸庞被称为“微笑天使”。经过十年禁渔与栖息地保护，2022 年长江江豚种群数量较 2017 年增长约 23%，成为长江生态修复的希望。",
    tags: ["长江", "淡水海豚", "十年禁渔"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Neophocaena_asiaeorientalis.jpg?width=800",
    caption: "图源：Wikimedia Commons · 公众领域",
    link: "https://www.iucnredlist.org/species/198696/155516444",
    sources: [
      { name: "IUCN 红色名录", url: "https://www.iucnredlist.org/species/198696/155516444" }
    ]
  },
  // ---------- 群星闪耀（文化遗产、科技、文明光辉）----------
  {
    id: "dunhuang",
    category: "群星闪耀",
    title: "敦煌莫高窟：沙漠里的千年画廊",
    desc: "敦煌莫高窟始建于公元 366 年，现存洞窟 735 个，保存壁画 4.5 万余平方米、彩塑 2400 余尊，是世界上规模最大的佛教艺术宝库之一。1900 年藏经洞被发现，数万件文献此后流散世界各地；如今壁画与彩塑仍面临风化、褪色的长期保护难题。1987 年，莫高窟被列入《世界遗产名录》。",
    tags: ["366 年始建 · 敦煌", "文化遗产", "壁画保护"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Dunhuang%20Mogao%20Ku%202013.12.31%2012-30-18.jpg?width=800",
    caption: "图源：Wikimedia Commons · Zhangzhugang · CC BY-SA 4.0",
    link: "https://www.dha.ac.cn/",
    sources: [
      { name: "UNESCO 世界遗产", url: "https://whc.unesco.org/en/list/440/" }
    ]
  },
  {
    id: "leshan-buddha",
    category: "群星闪耀",
    title: "乐山大佛：一个人的愿望，九十年的工程",
    desc: "乐山大佛始建于唐开元年间（713 年），由僧侣海通发起，希望以佛力平息河水、保佑船只安全。海通自己未见竣工，后人接力，整整耗时九十年才雕成。高达 71 米的坐佛坐在岷江、大渡河、青衣江三水汇合处，1996 年随峨眉山列入《世界遗产名录》。",
    tags: ["713 年始建 · 四川", "石窟雕塑", "世界遗产"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Leshan_Giant_Buddha.jpg?width=800",
    caption: "图源：Wikimedia Commons · 公众领域",
    link: "https://whc.unesco.org/en/list/898/",
    sources: [
      { name: "UNESCO 世界遗产", url: "https://whc.unesco.org/en/list/898/" }
    ]
  },
  {
    id: "tu-youyou",
    category: "群星闪耀",
    title: "屠呦呦与青蒿素：一株青蒿，千年之约",
    desc: "屠呦呦从古典医学典籍《肘后方》中找到灵感，以青蒿提取青蒿素，成功治疗疟疾。青蒿素联合疗法使全球疟疾死亡率大幅下降，2015 年屠呦呦获得诺贝尔生理学或医学奖，是中草药现代药物研发的里程碑。",
    tags: ["1970s · 北京", "中草药", "诺贝尔奖"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tu_Youyou.jpg?width=800",
    caption: "图源：Wikimedia Commons · 公众领域",
    link: "https://www.nobelprize.org/prizes/medicine/2015/summary/",
    sources: [
      { name: "诺贝尔奖官网", url: "https://www.nobelprize.org/prizes/medicine/2015/summary/" }
    ]
  },
  {
    id: "deep-sea-vent",
    category: "群星闪耀",
    title: "深海热泉：1977年，阳光之外的生命",
    desc: "1977 年，科学家在加拉帕戈斯群岛海底发现深海热泉群，黑烟囱周围聚集着大管虫、蛤蜊等奇异生物。它们不依赖阳光与光合作用，而是依靠化能合成生存，彻底改变了人类对“生命必需光照”的认知。",
    tags: ["1977 · 深海", "化能合成", "深海生物"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hydrothermal_vent.jpg?width=800",
    caption: "图源：Wikimedia Commons · NOAA · Public domain",
    link: "https://ocean.noaa.gov/",
    sources: [
      { name: "美国海洋与大气管理局", url: "https://ocean.noaa.gov/" }
    ]
  },
  {
    id: "easter-island",
    category: "群星闪耀",
    title: "复活节岛：摩艾石像与生态警示",
    desc: "复活节岛上矗立着近千座摩艾巨石像，由拉帕努伊人在数百年间雕刻运送。岛屿资源曾因过度砍伐与种族冲突濒临崩溃，成为“人口与环境关系”的经典研究案例，也提醒人们节制与共生的重要性。",
    tags: ["拉帕努伊 · 智利", "考古", "生态警示"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Moai_at_Ahu_Tongariki.jpg?width=800",
    caption: "图源：Wikimedia Commons · 公众领域",
    link: "https://whc.unesco.org/en/list/715/",
    sources: [
      { name: "UNESCO 世界遗产", url: "https://whc.unesco.org/en/list/715/" }
    ]
  },
  // ---------- 没人知道的角落（鲜为人知的生灵与地方）----------
  {
    id: "asian-elephant",
    category: "没人知道的角落",
    title: "亚洲象“短鼻家族”北游记",
    desc: "2020 年，一群亚洲象从云南西双版纳出发北迁，一路走过 500 多公里，最终在玉溪附近落脚。它们沿途被当地政府与民众保护引导，这场象群北游成为人与野生动物共生的当代缩影，也折射栖息地碎片化的课题。",
    tags: ["2020 · 云南", "亚洲象", "人象共生"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Asian_elephant.jpg?width=800",
    caption: "图源：Wikimedia Commons · 公众领域",
    link: "https://www.iucnredlist.org/species/7140/155516018",
    sources: [
      { name: "IUCN 红色名录", url: "https://www.iucnredlist.org/species/7140/155516018" }
    ]
  },
  // ---------- 一纸之令（制度与法律改变生活）----------
  {
    id: "finland-everymans-right",
    category: "一纸之令",
    title: "芬兰“每个人的权利”：大自然属于每个人",
    desc: "芬兰的“每个人的权利”（Allemansrätten）是一项不成文的习惯法原则：无论土地归谁所有，公众都有权在自然中行走、野营、采摘浆果与蘑菇。这项制度让大自然真正属于每个人，也培养了芬兰人对环境的敬畏与保护意识。",
    tags: ["芬兰", "自然权利", "习惯法"],
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Forest_in_Finland.jpg?width=800",
    caption: "图源：Wikimedia Commons · 公众领域",
    link: "https://www.metsa.fi/",
    sources: [
      { name: "芬兰林业局", url: "https://www.metsa.fi/" }
    ]
  },
  // ---------- 追加：占位图片，待替换实拍图 ----------
  {
    id: "california-condor",
    category: "回家",
    title: "加州神鹫：从27只到五百只",
    desc: "1987年，加州神鹫在野外只剩27只，科学家把它们全部捕获进行人工繁育。经过三十多年放归，今天野外和圈养的神鹫已超过500只——这是人类最敢赌一把的物种拯救实验。",
    tags: ["1987·美国加州", "猛禽", "人工繁育"],
    image: "https://picsum.photos/800/600?random=101",
    caption: "图源：公开资料（待替换实拍图）",
    link: "https://www.fws.gov/",
    sources: [
      { name: "美国鱼类及野生动物管理局", url: "https://www.fws.gov/" },
      { name: "新华网", url: "https://www.news.cn/" }
    ]
  },
  {
    id: "yangtze-sturgeon",
    category: "说再见",
    title: "长江鲟：没有等到回家的那一天",
    desc: "2022年，科学家宣布长江鲟野外灭绝。这种在长江里生活了一亿五千万年的鱼，最后一次野生繁殖记录停在多年前——它和白鱀豚、白鲟一起，成了母亲河来不及说出口的告别。",
    tags: ["2022·长江", "鱼类", "野外灭绝"],
    image: "https://picsum.photos/800/600?random=102",
    caption: "图源：公开资料（待替换实拍图）",
    link: "http://www.cafi.ac.cn/",
    sources: [
      { name: "中国水产科学研究院长江水产研究所", url: "http://www.cafi.ac.cn/" },
      { name: "新华网", url: "https://www.news.cn/" }
    ]
  },
  {
    id: "zhang-guimei",
    category: "群星闪耀",
    title: "张桂梅：大山里的女高校长",
    desc: "2008年，张桂梅在云南华坪创办全国第一所免费女子高中。十几年间，她把1800多个大山里的女孩送进了大学——她用一支粉笔，改写了一代人的命运。",
    tags: ["2008·云南华坪", "教育", "女性力量"],
    image: "https://picsum.photos/800/600?random=103",
    caption: "图源：公开资料（待替换实拍图）",
    link: "http://www.people.com.cn/",
    sources: [
      { name: "人民日报", url: "http://www.people.com.cn/" },
      { name: "新华网", url: "https://www.news.cn/" }
    ]
  },
  {
    id: "yuan-longping",
    category: "群星闪耀",
    title: "袁隆平：让所有人远离饥饿",
    desc: "1973年，袁隆平团队实现杂交水稻\"三系配套\"，让水稻产量大幅提升。此后半个世纪，杂交水稻在数十个国家推广——他毕生的愿望是\"禾下乘凉\"。",
    tags: ["1973·杂交水稻", "粮食安全", "科学家"],
    image: "https://picsum.photos/800/600?random=104",
    caption: "图源：公开资料（待替换实拍图）",
    link: "https://www.cas.cn/",
    sources: [
      { name: "中国科学院", url: "https://www.cas.cn/" },
      { name: "新华网", url: "https://www.news.cn/" }
    ]
  },
  {
    id: "bhutan-gnh",
    category: "没人知道的角落",
    title: "不丹：用\"幸福\"代替GDP的国家",
    desc: "1972年，不丹国王提出\"国民幸福总值\"（GNH），拒绝以牺牲环境和文化为代价的工业化。这个喜马拉雅山里的小国，把森林覆盖率写进了宪法——至少60%的国土必须永远是森林。",
    tags: ["1972·不丹", "GNH", "小国大智慧"],
    image: "https://picsum.photos/800/600?random=105",
    caption: "图源：公开资料（待替换实拍图）",
    link: "https://www.gov.bt/",
    sources: [
      { name: "不丹政府", url: "https://www.gov.bt/" },
      { name: "联合国", url: "https://www.un.org/" }
    ]
  },
  {
    id: "iceland-althing",
    category: "没人不知道的角落",
    title: "冰岛议会：一千一百年前的露天会议",
    desc: "公元930年，冰岛人在辛格维利尔谷地召开了第一次议会——阿尔庭（Althing）。它被认为是世界上现存最古老的议会，那时候人们站在露天的石头上辩论法律，一千多年后这个传统还在。",
    tags: ["930年·冰岛", "世界最老议会", "民主源头"],
    image: "https://picsum.photos/800/600?random=106",
    caption: "图源：公开资料（待替换实拍图）",
    link: "https://www.althingi.is/",
    sources: [
      { name: "冰岛议会", url: "https://www.althingi.is/" },
      { name: "联合国教科文组织", url: "https://whc.unesco.org/" }
    ]
  },
  {
    id: "anti-food-waste-law",
    category: "一纸之令",
    title: "反食品浪费法：吃光盘子里的东西写进了法律",
    desc: "2021年4月29日，《中华人民共和国反食品浪费法》正式施行。从这一天起，点餐浪费可被收费、直播吃播浪费可被处罚——\"光盘\"从道德倡议变成了法律义务。",
    tags: ["2021·中国", "反食品浪费", "立法"],
    image: "https://picsum.photos/800/600?random=107",
    caption: "图源：公开资料（待替换实拍图）",
    link: "http://www.npc.gov.cn/",
    sources: [
      { name: "全国人大常委会", url: "http://www.npc.gov.cn/" },
      { name: "新华网", url: "https://www.news.cn/" }
    ]
  },
  {
    id: "sea-otter",
    category: "回家",
    title: "海獭：从皮毛贸易的幸存者到森林的守护者",
    desc: "18-19世纪的皮毛贸易把太平洋海獭推到灭绝边缘，1911年国际协议禁止捕猎后，它们才慢慢回来。如今海獭吃海胆、保护海藻林，被称为\"海洋森林的园丁\"。",
    tags: ["1911·太平洋", "海獭", "海洋生态"],
    image: "https://picsum.photos/800/600?random=108",
    caption: "图源：公开资料（待替换实拍图）",
    link: "https://www.fws.gov/",
    sources: [
      { name: "美国鱼类及野生动物管理局", url: "https://www.fws.gov/" },
      { name: "新华网", url: "https://www.news.cn/" }
    ]
  },
  {
    id: "duozhuayu",
    category: "硬币的两面",
    title: "多抓鱼：让一本书被读五次",
    desc: "2017年，一对年轻人在上海创办多抓鱼——用户把旧书卖给平台，消毒翻新后再卖给下一个人。一本《百年孤独》可以被五个不同的人读完再读，循环经济在二手书店里长出了模样。",
    tags: ["2017·上海", "二手循环", "创业"],
    image: "https://picsum.photos/800/600?random=109",
    caption: "图源：公开资料（待替换实拍图）",
    link: "https://www.douzhuayu.com/",
    sources: [
      { name: "多抓鱼官网", url: "https://www.douzhuayu.com/" },
      { name: "新华网", url: "https://www.news.cn/" }
    ]
  },
  {
    id: "new-zealand-animal-welfare",
    category: "一纸之令",
    title: "新西兰：用法律承诺\"善待动物\"的路线图",
    desc: "2022年，新西兰政府发布动物福利路线图，承诺在2035年前逐步淘汰所有哺乳动物科学实验，并推动农场动物福利立法——一个国家第一次用政策文件写下\"动物是有感知的生命\"。",
    tags: ["2022·新西兰", "动物福利", "立法"],
    image: "https://picsum.photos/800/600?random=110",
    caption: "图源：公开资料（待替换实拍图）",
    link: "https://www.govt.nz/",
    sources: [
      { name: "新西兰政府", url: "https://www.govt.nz/" },
      { name: "联合国", url: "https://www.un.org/" }
    ]
  }
];
