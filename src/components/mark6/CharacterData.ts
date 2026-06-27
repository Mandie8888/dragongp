import elonImg from "@/assets/characters/elon.png";
import godOfGamblingImg from "@/assets/characters/god-of-gambling.png";
import luckyStarImg from "@/assets/characters/lucky-star.png";
import acheloisImg from "@/assets/characters/achelois.png";
import aladdinImg from "@/assets/characters/aladdin.png";

export interface Character {
  id: string;
  image: string;
  name: {
    en: string;
    "zh-TW": string;
    "zh-CN": string;
  };
  mathModule: {
    en: string;
    "zh-TW": string;
    "zh-CN": string;
  };
  description: {
    en: string;
    "zh-TW": string;
    "zh-CN": string;
  };
  style: string;
}

export const characters: Character[] = [
  {
    id: "elon",
    image: elonImg,
    name: {
      en: "Elon",
      "zh-TW": "馬神",
      "zh-CN": "马神",
    },
    mathModule: {
      en: "Banker & Leg Game Theory",
      "zh-TW": "莊家與腳博弈論",
      "zh-CN": "庄家与脚博弈论",
    },
    description: {
      en: "Elon is a modern enigma; no one truly knows his origin—though some whisper he arrived from Mars. Driven by a passion for Game Theory, he envisions a future where robots handle the labor while he builds foundations that span the universe. His analytical focus is on strategic distribution, utilizing the Banker & Leg model to find logic within the chaos.",
      "zh-TW": "馬神是現代謎團；沒有人真正知道他的起源——儘管有人低語說他來自火星。出於對博弈論的熱情，他構想了一個機器人處理勞動的未來，而他則建造橫跨宇宙的基礎。他的分析重點是策略分配，利用莊家與腳模型在混沌中尋找邏輯。",
      "zh-CN": "马神是现代谜团；没有人真正知道他的起源——尽管有人低语说他来自火星。出于对博弈论的热情，他构想了一个机器人处理劳动的未来，而他则建造横跨宇宙的基础。他的分析重点是策略分配，利用庄家与脚模型在混沌中寻找逻辑。",
    },
    style: "High-tech, futuristic, Mars-ready",
  },
  {
    id: "god-of-gambling",
    image: godOfGamblingImg,
    name: {
      en: "God of Gambling",
      "zh-TW": "賭神",
      "zh-CN": "赌神",
    },
    mathModule: {
      en: "Consecutive Numbers & Trailing Digits",
      "zh-TW": "連號與尾數分析",
      "zh-CN": "连号与尾数分析",
    },
    description: {
      en: "The original legend from the streets of Hong Kong, his journey began in humble poverty. Despite his title, he is a man of profound justice and compassion, treating everyone as a friend. He looks for patterns of connection, specializing in Consecutive Numbers and Trailing Digits—mathematical signs of love and companionship in the data.",
      "zh-TW": "來自香港街頭的原始傳奇，他的旅程始於卑微的貧窮。儘管有這個稱號，他是一個具有深刻正義感和同情心的人，把每個人都當作朋友。他尋找連接的模式，專門研究連號和尾數——數據中愛和友誼的數學符號。",
      "zh-CN": "来自香港街头的原始传奇，他的旅程始于卑微的贫穷。尽管有这个称号，他是一个具有深刻正义感和同情心的人，把每个人都当作朋友。他寻找连接的模式，专门研究连号和尾数——数据中爱和友谊的数学符号。",
    },
    style: "Traditional King of the Casino vibe",
  },
  {
    id: "lucky-star",
    image: luckyStarImg,
    name: {
      en: "Lucky Star",
      "zh-TW": "幸運星",
      "zh-CN": "幸运星",
    },
    mathModule: {
      en: "Monte Carlo 1M Simulation",
      "zh-TW": "蒙特卡羅百萬模擬",
      "zh-CN": "蒙特卡罗百万模拟",
    },
    description: {
      en: "The Grandpa of Star brings pure explosive luck and high-volume simulation. Using Monte Carlo methods with 1 million iterations, he calculates probability through sheer computational power. His approach combines frequency analysis of Hot & Cold numbers with massive statistical sampling.",
      "zh-TW": "星爺帶來純粹的爆發式運氣和大量模擬。使用蒙特卡羅方法進行一百萬次迭代，他通過純粹的計算能力計算概率。他的方法結合了熱門和冷門號碼的頻率分析與大規模統計抽樣。",
      "zh-CN": "星爷带来纯粹的爆发式运气和大量模拟。使用蒙特卡罗方法进行一百万次迭代，他通过纯粹的计算能力计算概率。他的方法结合了热门和冷门号码的频率分析与大规模统计抽样。",
    },
    style: "Pure explosive luck and high-volume simulation",
  },
  {
    id: "achelois",
    image: acheloisImg,
    name: {
      en: "Achelois",
      "zh-TW": "月光女神",
      "zh-CN": "月光女神",
    },
    mathModule: {
      en: "Lunar Cycle & Neural Entropy",
      "zh-TW": "月亮週期與神經熵",
      "zh-CN": "月亮周期与神经熵",
    },
    description: {
      en: "An ancient Greek deity whose name has echoed since 2000 BCE, Achelois is the 'washer of pain' who seeks to help the honest and the good. Much like the cycles of the moon, she views the world through balance. Her model focuses on the Property of Numbers, meticulously analyzing the distribution of Odd/Even and High/Low values.",
      "zh-TW": "一位自公元前2000年以來就迴響著名字的古希臘神祇，月光女神是「洗滌痛苦者」，尋求幫助誠實和善良的人。就像月亮的週期一樣，她通過平衡來看待世界。她的模型專注於數字的屬性，細緻地分析奇/偶和高/低值的分佈。",
      "zh-CN": "一位自公元前2000年以来就回响着名字的古希腊神祇，月光女神是「洗涤痛苦者」，寻求帮助诚实和善良的人。就像月亮的周期一样，她通过平衡来看待世界。她的模型专注于数字的属性，细致地分析奇/偶和高/低值的分布。",
    },
    style: "Mystical, calm, and high-frequency",
  },
  {
    id: "aladdin",
    image: aladdinImg,
    name: {
      en: "Aladdin",
      "zh-TW": "阿拉丁",
      "zh-CN": "阿拉丁",
    },
    mathModule: {
      en: "Quantum Spooky Sync (Color Spectrum)",
      "zh-TW": "量子幽靈同步（色譜分佈）",
      "zh-CN": "量子幽灵同步（色谱分布）",
    },
    description: {
      en: "Hailing from the ancient Middle East, Aladdin spent centuries hidden within his magic lamp. He is a generous spirit who wishes to grant three mathematical insights to those with a good heart. He finds beauty in the visual array, specializing in the Color Spectrum Distribution, where he tracks the vibrant patterns of Red, Blue, and Green colors.",
      "zh-TW": "來自古代中東，阿拉丁在他的神燈裡藏了幾個世紀。他是一個慷慨的靈魂，希望給予有善心的人三個數學見解。他在視覺陣列中發現美，專門研究色譜分佈，追蹤紅、藍、綠顏色的鮮明模式。",
      "zh-CN": "来自古代中东，阿拉丁在他的神灯里藏了几个世纪。他是一个慷慨的灵魂，希望给予有善心的人三个数学见解。他在视觉阵列中发现美，专门研究色谱分布，追踪红、蓝、绿颜色的鲜明模式。",
    },
    style: "Color-based logic",
  },
];
