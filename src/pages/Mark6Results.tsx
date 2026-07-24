import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { MatrixBackground } from "@/components/mark6/MatrixBackground";
import { characters } from "@/components/mark6/CharacterData";
import { LotteryBall } from "@/components/mark6/LotteryBall";
import { FrequencyChart } from "@/components/mark6/FrequencyChart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InlineLanguageSwitcher from "@/components/InlineLanguageSwitcher";
import { Printer, ArrowLeft, Sparkles, Zap, AlertTriangle, TrendingUp, BarChart3, Trophy, Volume2, VolumeX, Calendar } from "lucide-react";
import { WhatsAppShareButton } from "@/components/WhatsAppShareButton";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useMark6Speech } from "@/hooks/useMark6Speech";
import { FacebookShareButton } from "@/components/FacebookShareButton";

// ============================================================
// HONG KONG MARK 6 DATA
// ============================================================
const hkMark6Data = {
  redNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
  blueNumbers: [10, 11, 12, 13, 14, 15, 16, 41, 42, 43, 44, 45, 46, 47, 48, 49],
  greenNumbers: [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
  hotFrequency: [8, 12, 24, 32, 49, 38, 19, 42, 16, 28],
  coldFrequency: [3, 17, 29, 33, 41, 45, 47, 11, 22, 35],
  label: { en: "HK Mark 6", "zh-TW": "香港六合彩", "zh-CN": "香港六合彩" },
  numberRange: 49,
};

// ============================================================
// TAIWAN BIG LOTTO DATA
// ============================================================
const twLottoData = {
  redNumbers: [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
  blueNumbers: [3, 4, 9, 10, 14, 15, 20, 21, 25, 26, 31, 32, 36, 37, 41, 42, 47, 48],
  greenNumbers: [5, 6, 11, 16, 17, 22, 27, 28, 33, 38, 39, 43, 44, 49],
  hotFrequency: [1, 10, 22, 38, 45, 5, 16, 27, 33, 42],
  coldFrequency: [7, 14, 26, 35, 44, 48, 49, 3, 19, 31],
  label: { en: "Taiwan Big Lotto", "zh-TW": "台灣大樂透", "zh-CN": "台湾大乐透" },
  numberRange: 49,
};

const getNumberColor = (num: number, gameType: "hk" | "tw"): "red" | "blue" | "green" => {
  const data = gameType === "tw" ? twLottoData : hkMark6Data;
  if (data.redNumbers.includes(num)) return "red";
  if (data.blueNumbers.includes(num)) return "blue";
  return "green";
};

const generateMark6Set = (gameType: "hk" | "tw", bankers?: number[]): number[] => {
  const range = gameType === "tw" ? twLottoData.numberRange : hkMark6Data.numberRange;
  const numbers: number[] = bankers ? [...bankers] : [];
  while (numbers.length < 6) {
    const num = Math.floor(Math.random() * range) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
};

const generateColorRatioSet = (gameType: "hk" | "tw", ratio: [number, number, number]): number[] => {
  const data = gameType === "tw" ? twLottoData : hkMark6Data;
  const [redCount, blueCount, greenCount] = ratio;
  const result: number[] = [];
  
  const availableRed = [...data.redNumbers];
  for (let i = 0; i < redCount; i++) {
    const idx = Math.floor(Math.random() * availableRed.length);
    result.push(availableRed.splice(idx, 1)[0]);
  }
  
  const availableBlue = [...data.blueNumbers];
  for (let i = 0; i < blueCount; i++) {
    const idx = Math.floor(Math.random() * availableBlue.length);
    result.push(availableBlue.splice(idx, 1)[0]);
  }
  
  const availableGreen = [...data.greenNumbers];
  for (let i = 0; i < greenCount; i++) {
    const idx = Math.floor(Math.random() * availableGreen.length);
    result.push(availableGreen.splice(idx, 1)[0]);
  }
  
  return result.sort((a, b) => a - b);
};

const parseColorRatio = (ratioId?: string): [number, number, number] => {
  switch (ratioId) {
    case "2-2-2": return [2, 2, 2];
    case "3-2-1": return [3, 2, 1];
    case "1-3-2": return [1, 3, 2];
    case "custom": 
      const options: [number, number, number][] = [
        [2, 2, 2], [3, 2, 1], [1, 3, 2], [2, 3, 1], [3, 1, 2], [1, 2, 3], [4, 1, 1], [1, 4, 1], [1, 1, 4]
      ];
      return options[Math.floor(Math.random() * options.length)];
    default: return [2, 2, 2];
  }
};

const generatePredictions = (gameType: "hk" | "tw", bankers?: number[], colorRatio?: string): number[][] => {
  if (colorRatio) {
    const ratio = parseColorRatio(colorRatio);
    return Array.from({ length: 10 }, () => generateColorRatioSet(gameType, ratio));
  }
  return Array.from({ length: 10 }, () => generateMark6Set(gameType, bankers));
};

const partnerThemes: Record<string, {
  primary: string;
  secondary: string;
  glow: string;
  gradient: string;
  bgGradient: string;
}> = {
  elon: {
    primary: "#00FF41",
    secondary: "#39FF14",
    glow: "rgba(0, 255, 65, 0.5)",
    gradient: "linear-gradient(135deg, #00FF41 0%, #39FF14 100%)",
    bgGradient: "linear-gradient(135deg, #0a1628 0%, #0d2818 50%, #0a1628 100%)",
  },
  "god-of-gambling": {
    primary: "#FFD700",
    secondary: "#FFA500",
    glow: "rgba(255, 215, 0, 0.5)",
    gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
    bgGradient: "linear-gradient(135deg, #1a1a0a 0%, #2d2a0a 50%, #1a1a0a 100%)",
  },
  "lucky-star": {
    primary: "#FFD700",
    secondary: "#FFA500",
    glow: "rgba(255, 215, 0, 0.5)",
    gradient: "linear-gradient(135deg, #CC0000 0%, #990000 100%)",
    bgGradient: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
  },
  achelois: {
    primary: "#C9B037",
    secondary: "#94A3B8",
    glow: "rgba(201, 176, 55, 0.5)",
    gradient: "linear-gradient(135deg, #C0392B 0%, #A93226 100%)",
    bgGradient: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
  },
  aladdin: {
    primary: "#A855F7",
    secondary: "#9333EA",
    glow: "rgba(168, 85, 247, 0.5)",
    gradient: "linear-gradient(135deg, #A855F7 0%, #9333EA 100%)",
    bgGradient: "linear-gradient(135deg, #1a0a20 0%, #2d0a35 50%, #1a0a20 100%)",
  },
};

// Define partner content
const partnerContent: Record<string, {
  mathModule: { en: string; "zh-TW": string; "zh-CN": string };
  explanation: { en: string; "zh-TW": string; "zh-CN": string };
}> = {
  elon: {
    mathModule: {
      en: "Banker & Leg (Strategic Game Theory)",
      "zh-TW": "膽拖策略 (博弈論)",
      "zh-CN": "胆拖策略 (博弈论)",
    },
    explanation: {
      en: "This model uses your selected Bankers as fixed anchors and calculates the optimal \"Legs\" based on historical air turbulence and game theory patterns.",
      "zh-TW": "此模型使用您選擇的膽碼作為固定錨點，並根據歷史空氣湍流和博弈論模式計算最佳「拖碼」。",
      "zh-CN": "此模型使用您选择的胆码作为固定锚点，并根据历史空气湍流和博弈论模式计算最佳「拖码」。",
    },
  },
  "god-of-gambling": {
    mathModule: {
      en: "Methodology: Chaos Theory Logic",
      "zh-TW": "方法論：混沌理論",
      "zh-CN": "方法论：混沌理论",
    },
    explanation: {
      en: "This model tracks non-linear patterns in random turbulence to find the \"Hidden Order\" in historical draw data using advanced chaos theory algorithms.",
      "zh-TW": "此模型追蹤隨機湍流中的非線性模式，使用先進的混沌理論演算法在歷史開獎數據中尋找「隱藏秩序」。",
      "zh-CN": "此模型追踪随机湍流中的非线性模式，使用先进的混沌理论算法在历史开奖数据中寻找「隐藏秩序」。",
    },
  },
  "lucky-star": {
    mathModule: {
      en: "Methodology: Monte Carlo Simulation Engine",
      "zh-TW": "方法論：蒙特卡羅模擬引擎",
      "zh-CN": "方法论：蒙特卡罗模拟引擎",
    },
    explanation: {
      en: "By running massive random iterations, this model identifies number clusters that statistically survive 1,000,000 virtual draws.",
      "zh-TW": "透過運行大量隨機迭代，此模型識別出在 1,000,000 次虛擬抽獎中統計上存活的號碼群組。",
      "zh-CN": "通过运行大量随机迭代，此模型识别出在 1,000,000 次虚拟抽奖中统计上存活的号码群组。",
    },
  },
  achelois: {
    mathModule: {
      en: "Methodology: Neural Network Entropy",
      "zh-TW": "方法論：神經網絡熵值分析",
      "zh-CN": "方法论：神经网络熵值分析",
    },
    explanation: {
      en: "This model uses deep neural networks to identify stable numerical structures within the chaotic entropy of historical draw data.",
      "zh-TW": "此模型使用深度神經網絡在歷史開獎數據的混沌熵值中識別穩定的數字結構。",
      "zh-CN": "此模型使用深度神经网络在历史开奖数据的混沌熵值中识别稳定的数字结构。",
    },
  },
  aladdin: {
    mathModule: {
      en: "Quantum Spooky Sync (Color Spectrum)",
      "zh-TW": "量子幽靈同步（色譜分佈）",
      "zh-CN": "量子幽灵同步（色谱分布）",
    },
    explanation: {
      en: "Uses color spectrum distribution to track the vibrant patterns of Red, Blue, and Green number zones.",
      "zh-TW": "使用色譜分佈來追蹤紅、藍、綠號碼區域的鮮明模式。",
      "zh-CN": "使用色谱分布来追踪红、蓝、绿号码区域的鲜明模式。",
    },
  },
};

export default function Mark6Results() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  
  const gameType = (searchParams.get("game") || "hk") as "hk" | "tw";
  const partnerId = searchParams.get("partner") || "elon";
  const bankersParam = searchParams.get("bankers");
  const colorRatioParam = searchParams.get("colorRatio");
  const intensityParam = searchParams.get("intensity");
  const patternParam = searchParams.get("pattern");
  const simulationStarsParam = searchParams.get("simulationStars");
  const intuitionLevelParam = searchParams.get("intuitionLevel");
  
  const bankers = bankersParam ? bankersParam.split(",").map(Number) : undefined;
  const colorRatio = colorRatioParam || undefined;
  const intensity = intensityParam ? parseInt(intensityParam) : undefined;
  const pattern = patternParam || undefined;
  const simulationStars = simulationStarsParam ? parseInt(simulationStarsParam) : undefined;
  const intuitionLevel = intuitionLevelParam ? parseInt(intuitionLevelParam) : undefined;

  const activeData = gameType === "tw" ? twLottoData : hkMark6Data;

  const [isProcessing, setIsProcessing] = useState(true);
  const [processingNumbers, setProcessingNumbers] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [predictions, setPredictions] = useState<number[][]>(() => 
    partnerId === "aladdin" ? generatePredictions(gameType, undefined, colorRatio) : generatePredictions(gameType, bankers)
  );
  const [statusIndex, setStatusIndex] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [countdown, setCountdown] = useState(15);
  const [isQuickMode, setIsQuickMode] = useState(false);

  const partner = characters.find((c) => c.id === partnerId) || characters[0];
  const theme = partnerThemes[partnerId] || partnerThemes.elon;

  // Voice controls
  const { speak, speakFullReport, getPartnerMethod, getPartnerName, isSpeaking, stop, isSupported } = useMark6Speech({ 
    lang: language === 'zh-TW' ? 'zh-HK' : language === 'zh-CN' ? 'zh-CN' : 'en-US' 
  });

  const statusMessages = [
    { en: "Analyzing historical patterns...", "zh-TW": "正在分析歷史規律...", "zh-CN": "正在分析历史规律..." },
    { en: "Calculating probability distributions...", "zh-TW": "計算概率分佈...", "zh-CN": "计算概率分布..." },
    { en: "Syncing with lottery data...", "zh-TW": "正在同步彩票數據...", "zh-CN": "正在同步彩票数据..." },
    { en: "Applying AI prediction algorithms...", "zh-TW": "應用 AI 預測演算法...", "zh-CN": "应用 AI 预测演算法..." },
    { en: "Optimizing number combinations...", "zh-TW": "優化號碼組合...", "zh-CN": "优化号码组合..." },
    { en: "Finalizing prediction results...", "zh-TW": "完成預測結果...", "zh-CN": "完成预测结果..." },
  ];

  const content = {
    en: {
      processing: "AI Processing...",
      analyzing: "Analyzing probability patterns",
      reportTitle: "'s Strategic Prediction",
      methodology: "Methodology",
      basisNote: "Based on the last 100 draw results",
      setLabel: "Set",
      printReport: "Print Report",
      returnToGame: "Return to Game",
      disclaimer: "Gambling is harmful to health. This is purely an AI mathematical exercise. Please do not take it seriously or become addicted. We are not responsible for any consequences.",
      yourBankers: "Your Selected Bankers",
      yourColorRatio: "Color Magic Mix",
      colorRatio222: "2 Red / 2 Blue / 2 Green",
      colorRatio321: "3 Red / 2 Blue / 1 Green",
      colorRatio132: "1 Red / 3 Blue / 2 Green",
      colorRatioCustom: "Genie's Custom Mix",
      yourIntensity: "Risk Intensity",
      yourPattern: "Strategy Mode",
      patternCold: "Cold Strategy",
      patternBalanced: "Balanced Flow",
      patternHot: "Hot Streak",
      yourSimulationPower: "Simulation Power",
      simulationDepth: "Simulation Depth",
      yourIntuitionLevel: "Intuition Level",
      intuitionLabels: ["New Moon", "Waxing", "Half Moon", "Gibbous", "Full Moon"],
      friendlyReminder: "Full mathematical calculation may take a few minutes. For a quick random report, click below.",
      fastPassButton: "Skip to Results (Fast Mode)",
      quickModeNote: "Mode: High-Speed AI Heuristics",
      shareWhatsApp: "Check out my AI-generated lucky numbers from DragonGP! Try it here:",
      goToStocks: "Go to AI Stocks Probability",
      gameLabel: "Game",
      listenReport: "Listen to Report",
      stopVoice: "Stop Voice",
    },
    "zh-TW": {
      processing: "AI 處理中...",
      analyzing: "分析概率模式",
      reportTitle: "的策略預測",
      methodology: "方法論",
      basisNote: "根據最近 100 期開獎結果",
      setLabel: "組",
      printReport: "列印報告",
      returnToGame: "返回遊戲",
      disclaimer: "賭博有害身心健康。這純粹是 AI 數學演練，請勿過度認真或沉迷。本站對任何結果不負法律責任。",
      yourBankers: "您選擇的膽碼",
      yourColorRatio: "色球魔法組合",
      colorRatio222: "2 紅 / 2 藍 / 2 綠",
      colorRatio321: "3 紅 / 2 藍 / 1 綠",
      colorRatio132: "1 紅 / 3 藍 / 2 綠",
      colorRatioCustom: "神燈精靈組合",
      yourIntensity: "風險強度",
      yourPattern: "策略模式",
      patternCold: "冷門規律",
      patternBalanced: "平衡流動",
      patternHot: "熱門追蹤",
      yourSimulationPower: "模擬強度",
      simulationDepth: "模擬深度",
      yourIntuitionLevel: "直覺強度",
      intuitionLabels: ["新月", "眉月", "半月", "盈凸月", "滿月"],
      friendlyReminder: "完整數學運算可能需要幾分鐘。如需快速隨機報告，請點擊下方按鈕。",
      fastPassButton: "跳過運算直接查看結果",
      quickModeNote: "模式：高階 AI 快速啟發演算法",
      goToStocks: "前往 AI 股票概率分析",
      shareWhatsApp: "看看我用 DragonGP AI 生成的幸運號碼！在這裡試試:",
      gameLabel: "遊戲",
      listenReport: "收聽報告",
      stopVoice: "停止語音",
    },
    "zh-CN": {
      processing: "AI 处理中...",
      analyzing: "分析概率模式",
      reportTitle: "的策略预测",
      methodology: "方法论",
      basisNote: "根据最近 100 期开奖结果",
      setLabel: "组",
      printReport: "打印报告",
      returnToGame: "返回游戏",
      disclaimer: "赌博有害身心健康。这纯粹是 AI 数学演练，请勿过度认真或沉迷。本站对任何结果不负法律责任。",
      yourBankers: "您选择的胆码",
      yourColorRatio: "色球魔法组合",
      colorRatio222: "2 红 / 2 蓝 / 2 绿",
      colorRatio321: "3 红 / 2 蓝 / 1 绿",
      colorRatio132: "1 红 / 3 蓝 / 2 绿",
      colorRatioCustom: "神灯精灵组合",
      yourIntensity: "风险强度",
      yourPattern: "策略模式",
      patternCold: "冷门规律",
      patternBalanced: "平衡流动",
      patternHot: "热门追踪",
      yourSimulationPower: "模拟强度",
      simulationDepth: "模拟深度",
      yourIntuitionLevel: "直觉强度",
      intuitionLabels: ["新月", "眉月", "半月", "盈凸月", "满月"],
      friendlyReminder: "完整数学运算可能需要几分钟。如需快速随机报告，请点击下方按钮。",
      fastPassButton: "跳过运算直接查看结果",
      quickModeNote: "模式：高阶 AI 快速启发演算法",
      goToStocks: "前往 AI 股票概率分析",
      shareWhatsApp: "看看我用 DragonGP AI 生成的幸运号码！在这里试试:",
      gameLabel: "游戏",
      listenReport: "收听报告",
      stopVoice: "停止语音",
    },
  };

  const t = content[language] || content.en;
  const partnerMath = partnerContent[partnerId] || partnerContent.elon;

  useEffect(() => {
    if (!isProcessing) return;

    const numberInterval = setInterval(() => {
      setProcessingNumbers(generateMark6Set(gameType));
    }, 150);

    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => Math.min(prev + (100 / 180), 100));
    }, 100);

    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 3000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    const completeTimer = setTimeout(() => {
      setIsProcessing(false);
    }, 18000);

    return () => {
      clearInterval(numberInterval);
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      clearInterval(countdownInterval);
      clearTimeout(completeTimer);
    };
  }, [isProcessing, gameType]);

  const handleFastPass = () => {
    setIsQuickMode(true);
    setIsProcessing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReturn = () => {
    navigate("/generate-report");
  };

  // Handle voice play - uses full report with no interruption
  const handleVoicePlay = () => {
    if (isSpeaking) {
      stop();
    } else {
      const partnerName = getPartnerName(partnerId, language);
      const method = getPartnerMethod(partnerId, language);
      console.log('🎤 Playing voice for:', partnerId, 'Method:', method);
      console.log('📊 Predictions:', predictions);
      speakFullReport(partnerId, partnerName, method, gameType, predictions);
    }
  };

  const getBallColor = (num: number, isBanker: boolean = false): string => {
    if (isBanker) {
      return "radial-gradient(circle at 30% 30%, #FFD700, #B8860B 60%, #8B6914 100%)";
    }
    const color = getNumberColor(num, gameType);
    if (color === "red") {
      return "radial-gradient(circle at 30% 30%, #FF4444, #E31937 50%, #B8001E 100%)";
    }
    if (color === "blue") {
      return "radial-gradient(circle at 30% 30%, #4D9FFF, #0066CC 50%, #004A99 100%)";
    }
    return "radial-gradient(circle at 30% 30%, #3DD56D, #00A651 50%, #007A3D 100%)";
  };

  // --- Processing Screen ---
  if (isProcessing) {
    const currentStatus = statusMessages[statusIndex];
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden print:hidden"
        style={{ background: theme.bgGradient }}
      >
        <div className="relative z-10 text-center max-w-lg mx-auto px-4">
          <div 
            className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden"
            style={{
              boxShadow: `0 0 50px ${theme.glow}, 0 0 100px ${theme.glow.replace('0.5', '0.3')}`,
              animation: "pulse 1s ease-in-out infinite",
            }}
          >
            <img src={partner.image} alt={partner.name[language]} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-black mb-2" style={{ color: theme.primary, textShadow: `0 0 30px ${theme.glow}`, fontFamily: "'Georgia', serif" }}>{t.processing}</h1>
          <p className="text-lg mb-6 transition-all duration-300" style={{ color: theme.secondary, textShadow: `0 0 10px ${theme.glow}` }}>
            {currentStatus[language]}
          </p>
          <div className="flex gap-3 justify-center mb-8">
            {processingNumbers.map((num, idx) => (
              <div key={idx} style={{ animation: `spin${idx} 0.5s ease-in-out infinite` }}>
                <LotteryBall number={num} size="lg" />
              </div>
            ))}
          </div>
          <div className="w-full max-w-md mx-auto mb-2">
            <Progress value={processingProgress} className="h-3" style={{ backgroundColor: `${theme.primary}30` }} />
          </div>
          <p className="text-sm text-gray-400 mb-8">{Math.round(processingProgress)}%</p>
          <div className="p-4 rounded-xl mb-6" style={{ backgroundColor: "rgba(30, 41, 59, 0.9)", border: `1px solid ${theme.primary}40`, boxShadow: `0 0 20px ${theme.glow.replace('0.5', '0.1')}` }}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: theme.primary }} />
              <div className="text-left space-y-2">
                <p className="text-sm text-gray-300">{content.en.friendlyReminder}</p>
                <p className="text-sm text-gray-400">{content["zh-TW"].friendlyReminder}</p>
                <p className="text-sm text-gray-500">{content["zh-CN"].friendlyReminder}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 relative z-50">
            <div className="flex flex-col items-center gap-2" style={{ color: theme.primary }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 animate-pulse" style={{ borderColor: countdown > 0 ? theme.primary : '#FFD700', boxShadow: `0 0 30px ${theme.glow}, inset 0 0 20px ${theme.glow.replace('0.5', '0.2')}`, background: `radial-gradient(circle, ${theme.primary}20 0%, transparent 70%)` }}>
                <span className="text-3xl font-black" style={{ textShadow: `0 0 20px ${theme.glow}`, fontFamily: "'Georgia', serif" }}>{countdown > 0 ? countdown : '✓'}</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: theme.secondary }}>
                {countdown > 0 ? (language === 'en' ? `${countdown}s until skip available` : language === 'zh-TW' ? `${countdown} 秒後可跳過` : `${countdown} 秒后可跳过`) : (language === 'en' ? 'Skip ready!' : language === 'zh-TW' ? '可以跳過了！' : '可以跳过了！')}
              </p>
            </div>
            {countdown === 0 && (
              <Button onClick={handleFastPass} className="px-8 py-4 font-black animate-fade-in transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer relative z-50" style={{ background: partnerId === 'elon' ? `linear-gradient(135deg, #00FF41 0%, #39FF14 100%)` : `linear-gradient(135deg, #FFD700 0%, #FFA500 100%)`, color: "#000000", boxShadow: partnerId === 'elon' ? "0 0 40px rgba(0, 255, 65, 0.8), 0 0 80px rgba(0, 255, 65, 0.5)" : "0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 215, 0, 0.5)", fontSize: "1.1rem", border: "3px solid rgba(255, 255, 255, 0.5)", fontFamily: "'Georgia', serif", minWidth: "280px", pointerEvents: "auto" }}>
                <Zap className="w-6 h-6 mr-2" />
                <span className="flex flex-col items-start leading-tight">
                  <span>{t.fastPassButton}</span>
                  <span className="text-xs opacity-80">{language === 'en' ? '跳過運算直接查看結果' : 'Skip to Results (Fast Mode)'}</span>
                </span>
              </Button>
            )}
          </div>
        </div>
        <style>{`
          @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          @keyframes spin0 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes spin1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
          @keyframes spin2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes spin3 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
          @keyframes spin4 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes spin5 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        `}</style>
      </div>
    );
  }

  // --- Results Report ---
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden print:bg-white print:overflow-visible" style={{ background: theme.bgGradient }}>
      <MatrixBackground />
      <div className="print:hidden"><Navbar /></div>
      <main className="flex-1 pt-20 pb-4 relative z-10 print:pt-0 print:pb-2">
        <div className="container mx-auto px-4 max-w-4xl print:px-3 print:pt-[50px] print:mt-0">
          <div className="mb-3 print:hidden"><InlineLanguageSwitcher /></div>

          {/* --- Report Header --- */}
          <div className="p-5 md:p-6 rounded-2xl mb-4 print:p-4 print:mb-3 print:bg-white print:rounded-lg" style={{ background: `linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)`, border: `2px solid ${theme.primary}60`, boxShadow: `0 8px 32px ${theme.glow.replace('0.5', '0.25')}, 0 0 0 1px rgba(255,255,255,0.05) inset` }}>
            <div className="hidden print:block text-right mb-2">
              <span style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: '8pt', color: '#6b7280' }}>
                Report Generated on: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            
            {/* Date and Facebook Share Button */}
            <div className="flex items-center justify-between mb-4 print:mb-2">
              <div className="flex items-center gap-2 text-sm text-[#f5e6c8]/60 print:text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date().toLocaleDateString(language === 'en' ? 'en-US' : language === 'zh-TW' ? 'zh-HK' : 'zh-CN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              {/* Facebook Share Button */}
              <FacebookShareButton 
                url={window.location.href}
                quote={`My AI-generated lucky numbers from DragonGP! 🎰 ${partner?.name?.[language] || ''} predicted: ${predictions[0]?.join(', ') || ''}`}
                size="sm"
                showText={false}
                className="print:hidden"
              />
            </div>

            <div className="flex items-center gap-4 mb-5 print:gap-3 print:mb-3">
              <div className="w-16 h-16 sm:w-18 md:w-20 md:h-20 max-w-[100px] sm:max-w-[120px] md:max-w-[150px] rounded-full overflow-hidden flex-shrink-0 print:w-12 print:h-12" style={{ boxShadow: `0 0 25px ${theme.glow}, 0 4px 15px rgba(0,0,0,0.3)`, border: `3px solid ${theme.primary}80`, aspectRatio: '1 / 1' }}>
                <img src={partner.image} alt={partner.name[language]} className="w-full h-full object-cover max-w-[150px] max-h-[150px]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-black mb-1 tracking-tight print:text-xl print:text-gray-900"
                    style={{
                      color: theme.primary,
                      textShadow: `0 0 30px ${theme.glow}, 0 2px 4px rgba(0,0,0,0.3)`,
                      fontFamily: "'Georgia', serif",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {partner.name[language]}{t.reportTitle}
                  </h1>
                  
                  {/* Voice Button with Status Text */}
                  {isSupported && (
                    <button
                      onClick={handleVoicePlay}
                      className={`p-2 rounded-full transition-all duration-300 flex items-center gap-1.5 print:hidden ${
                        isSpeaking 
                          ? 'bg-red-500/20 border border-red-500/50 animate-pulse' 
                          : 'hover:bg-white/10'
                      }`}
                      title={isSpeaking ? t.stopVoice : t.listenReport}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-5 h-5" style={{ color: theme.primary }} />
                          <span className="text-xs font-medium" style={{ color: theme.primary }}>
                            {t.stopVoice}
                          </span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-5 h-5" style={{ color: theme.primary }} />
                          <span className="text-xs font-medium" style={{ color: theme.primary }}>
                            {t.listenReport}
                          </span>
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* Game Badge */}
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold print:bg-gray-200 print:text-gray-800"
                    style={{
                      background: gameType === "tw" 
                        ? "linear-gradient(135deg, #FF6B35 0%, #FF4500 100%)"
                        : "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                      color: "#000000",
                      boxShadow: "0 0 15px rgba(255, 215, 0, 0.3)",
                    }}
                  >
                    <Trophy className="w-3 h-3 inline mr-1" />
                    {activeData.label[language] || activeData.label.en}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full print:bg-gray-100 print:border print:border-gray-300" style={{ background: `linear-gradient(135deg, ${theme.primary}25 0%, ${theme.primary}10 100%)`, border: `1px solid ${theme.primary}40` }}>
                  <BarChart3 className="w-4 h-4 print:w-3 print:h-3 print:text-gray-600" style={{ color: theme.secondary }} />
                  <span className="text-sm font-semibold print:text-gray-700" style={{ color: theme.secondary }}>{partnerMath.mathModule[language]}</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-xl mb-4 print:p-2 print:mb-3 print:bg-gray-50 print:border print:border-gray-200" style={{ background: `linear-gradient(135deg, ${theme.primary}12 0%, ${theme.primary}05 100%)`, border: `1px solid ${theme.primary}25`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05)` }}>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 print:text-gray-600" style={{ color: theme.primary }} />
                <p className="text-sm leading-relaxed print:text-gray-700" style={{ color: "#D1D5DB" }}>{partnerMath.explanation[language]}</p>
              </div>
            </div>

            {/* --- User Selections --- */}
            {bankers && bankers.length > 0 && (
              <div className="flex items-center gap-2 mb-3 p-2 rounded-lg print:mb-2" style={{ backgroundColor: `${theme.primary}10`, border: `1px solid ${theme.primary}30` }}>
                <span className="text-xs print:text-black" style={{ color: theme.primary }}>{t.yourBankers}:</span>
                <div className="flex gap-1">
                  {bankers.map((num) => (
                    <div key={num} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold print:w-6 print:h-6" style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)", color: "#000000", boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)" }}>{num}</div>
                  ))}
                </div>
              </div>
            )}
            {pattern && partnerId === "god-of-gambling" && (
              <div className="flex items-center gap-3 mb-3 p-3 rounded-lg print:mb-2" style={{ backgroundColor: "rgba(255, 215, 0, 0.15)", border: "2px solid rgba(255, 215, 0, 0.5)", boxShadow: "0 0 20px rgba(255, 215, 0, 0.2)" }}>
                <span className="text-sm font-bold" style={{ color: "#FFD700" }}>{t.yourPattern}:</span>
                <div className="px-4 py-2 rounded-full font-bold text-sm" style={{ background: pattern === "cold" ? "linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)" : pattern === "hot" ? "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)" : "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)", color: pattern === "balanced" ? "#000000" : "#FFFFFF", boxShadow: pattern === "cold" ? "0 0 15px rgba(96, 165, 250, 0.5)" : pattern === "hot" ? "0 0 15px rgba(239, 68, 68, 0.5)" : "0 0 15px rgba(255, 215, 0, 0.5)" }}>
                  {pattern === "cold" ? t.patternCold : pattern === "hot" ? t.patternHot : t.patternBalanced}
                </div>
              </div>
            )}
            {colorRatio && partnerId === "aladdin" && (
              <div className="flex items-center gap-3 mb-3 p-3 rounded-lg print:mb-2" style={{ backgroundColor: "rgba(168, 85, 247, 0.15)", border: "2px solid rgba(168, 85, 247, 0.5)", boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)" }}>
                <span className="text-sm font-bold" style={{ color: "#A855F7" }}>{t.yourColorRatio}:</span>
                <div className="flex items-center gap-2">
                  {(() => {
                    const ratio = parseColorRatio(colorRatio);
                    return (
                      <>
                        {Array.from({ length: ratio[0] }).map((_, idx) => (<div key={`r-${idx}`} className="w-5 h-5 rounded-full" style={{ background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)" }} />))}
                        {Array.from({ length: ratio[1] }).map((_, idx) => (<div key={`b-${idx}`} className="w-5 h-5 rounded-full" style={{ background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)" }} />))}
                        {Array.from({ length: ratio[2] }).map((_, idx) => (<div key={`g-${idx}`} className="w-5 h-5 rounded-full" style={{ background: "linear-gradient(135deg, #22C55E 0%, #16A34A 100%)" }} />))}
                      </>
                    );
                  })()}
                </div>
                <div className="px-3 py-1 rounded-full font-bold text-xs" style={{ background: "linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)", color: "#FFFFFF", boxShadow: "0 0 15px rgba(168, 85, 247, 0.5)" }}>
                  {colorRatio === "2-2-2" ? t.colorRatio222 : colorRatio === "3-2-1" ? t.colorRatio321 : colorRatio === "1-3-2" ? t.colorRatio132 : t.colorRatioCustom}
                </div>
              </div>
            )}
            {simulationStars && partnerId === "lucky-star" && (
              <div className="flex items-center gap-3 mb-3 p-3 rounded-lg print:mb-2" style={{ backgroundColor: "rgba(255, 215, 0, 0.1)", border: "2px solid rgba(255, 215, 0, 0.5)", boxShadow: "0 0 20px rgba(255, 215, 0, 0.2)" }}>
                <span className="text-sm font-bold" style={{ color: "#FFD700" }}>{t.yourSimulationPower}:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (<span key={star} className="text-lg" style={{ color: star <= simulationStars ? "#FFD700" : "#404040", textShadow: star <= simulationStars ? "0 0 8px rgba(255, 215, 0, 0.8)" : "none" }}>★</span>))}
                </div>
                <div className="px-3 py-1 rounded-full font-bold text-xs" style={{ background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)", color: "#1a1a1a", boxShadow: "0 0 15px rgba(255, 215, 0, 0.5)" }}>
                  {language === "en" ? `${["100K", "250K", "500K", "750K", "1M"][simulationStars - 1]} Simulations` : `${["10萬", "25萬", "50萬", "75萬", "100萬"][simulationStars - 1]}次模擬`}
                </div>
              </div>
            )}
            {intuitionLevel && partnerId === "achelois" && (
              <div className="flex items-center gap-3 mb-3 p-3 rounded-lg print:mb-2" style={{ backgroundColor: "rgba(148, 163, 184, 0.1)", border: "2px solid rgba(201, 176, 55, 0.5)", boxShadow: "0 0 20px rgba(201, 176, 55, 0.15)" }}>
                <span className="text-sm font-bold" style={{ color: "#C9B037" }}>{t.yourIntuitionLevel}:</span>
                <div className="flex items-center gap-1">
                  {["🌑", "🌒", "🌓", "🌔", "🌕"].map((moon, idx) => (<span key={idx} className="text-lg" style={{ opacity: idx + 1 <= intuitionLevel ? 1 : 0.3, filter: idx + 1 <= intuitionLevel ? "drop-shadow(0 0 4px rgba(230, 126, 34, 0.8))" : "none" }}>{idx + 1 <= intuitionLevel ? ["🌑", "🌒", "🌓", "🌔", "🌕"][idx] : "🌑"}</span>))}
                </div>
                <div className="px-3 py-1 rounded-full font-bold text-xs" style={{ background: "linear-gradient(135deg, #E67E22 0%, #D35400 100%)", color: "#FFFFFF", boxShadow: "0 0 15px rgba(230, 126, 34, 0.4)" }}>{t.intuitionLabels[intuitionLevel - 1]}</div>
              </div>
            )}
            {isQuickMode && (
              <div className="text-center py-2 px-3 rounded-lg mb-3 print:py-1 print:mb-2" style={{ backgroundColor: "rgba(245, 158, 11, 0.2)", border: "1px solid rgba(245, 158, 11, 0.5)" }}>
                <Zap className="w-4 h-4 inline mr-2" style={{ color: "#F59E0B" }} />
                <span className="text-sm font-medium" style={{ color: "#F59E0B" }}>{t.quickModeNote}</span>
              </div>
            )}
            <div className="text-center py-2 px-3 rounded-lg mb-3 print:py-1 print:mb-2" style={{ backgroundColor: `${theme.primary}10`, border: `1px solid ${theme.primary}30` }}>
              <Zap className="w-3 h-3 inline mr-1" style={{ color: theme.primary }} />
              <span className="text-xs print:text-black" style={{ color: "#C0C0C0" }}>{t.basisNote}</span>
            </div>

            {/* --- Predictions Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 print:!grid print:!grid-cols-2 print:!gap-2 predictions-grid" id="predictions-container">
              {predictions.map((set, setIdx) => (
                <div key={setIdx} className="flex items-center gap-2 p-2 rounded-xl print:!flex print:!visible print:p-1.5 print:rounded-lg print:bg-white print:border-2 print:border-gray-400 prediction-row" data-set-index={setIdx + 1} style={{ background: partnerId === "achelois" ? "rgba(148, 163, 184, 0.1)" : `linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.7) 100%)`, border: partnerId === "achelois" ? "1px solid rgba(201, 176, 55, 0.3)" : `1px solid ${theme.primary}20` }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 set-badge print:!flex print:!visible print:!w-6 print:!h-6 print:!text-sm print:!bg-gray-300 print:!text-gray-900 print:!font-black print:!border-2 print:!border-gray-500" style={{ background: `linear-gradient(135deg, ${theme.primary}40 0%, ${theme.primary}20 100%)`, color: theme.primary, fontFamily: "'Georgia', serif", border: `1px solid ${theme.primary}50` }}>{setIdx + 1}</div>
                  <div className="flex gap-1.5 sm:gap-2 flex-nowrap justify-start flex-1 print:!flex print:!visible print:gap-1.5 lottery-ball-container">
                    {set.map((num, numIdx) => {
                      const color = getNumberColor(num, gameType);
                      const printBgColor = color === "red" ? "#DC2626" : color === "blue" ? "#2563EB" : "#16A34A";
                      const bankerColor = "#EAB308";
                      const finalBg = bankers?.includes(num) ? bankerColor : printBgColor;
                      const textColor = bankers?.includes(num) ? "#000000" : "#FFFFFF";
                      return (
                        <div key={numIdx} className="lottery-ball rounded-full flex items-center justify-center font-bold w-9 h-9 text-sm print:!flex print:!visible print:!w-8 print:!h-8" data-number={num} data-print-bg={finalBg} data-print-text={textColor} style={{ background: `radial-gradient(circle at 30% 25%, ${finalBg}CC 0%, ${finalBg} 50%, ${finalBg}DD 100%)`, boxShadow: `0 4px 15px ${finalBg}80`, fontFamily: "'Georgia', serif" }}>
                          <span className="relative z-10 font-bold print:!font-black" style={{ color: textColor }}>{num}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Frequency Chart --- */}
          <div className="mb-4 print:mb-2 print:break-inside-avoid print:page-break-inside-avoid print:scale-90 print:origin-top">
            <FrequencyChart predictions={predictions} />
          </div>

          {/* --- Disclaimer --- */}
          <div className="p-3 rounded-xl mb-4 text-center print:hidden" style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)" }}>
            <p className="text-xs leading-relaxed" style={{ color: "#FCA5A5", fontFamily: "'Georgia', serif" }}>⚠️ {t.disclaimer}</p>
          </div>

          {/* --- Action Buttons --- */}
          <div className="flex flex-col gap-3 print:hidden action-buttons">
            <div className="flex flex-row gap-1.5 sm:gap-2 justify-center flex-wrap">
              <Button onClick={handlePrint} className="flex-1 min-w-[80px] max-w-[110px] sm:min-w-[100px] sm:max-w-[140px] px-1.5 sm:px-2 py-2 sm:py-2.5 text-[0.65rem] sm:text-xs font-bold" style={{ background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)", color: "#FFFFFF", boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)" }}>
                <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />{t.printReport}
              </Button>
              <WhatsAppShareButton message="" className="flex-1 min-w-[80px] max-w-[110px] sm:min-w-[100px] sm:max-w-[140px]" size="sm" />
              <Button onClick={handleReturn} className="flex-1 min-w-[80px] max-w-[110px] sm:min-w-[100px] sm:max-w-[140px] px-1.5 sm:px-2 py-2 sm:py-2.5 text-[0.65rem] sm:text-xs font-bold" style={{ background: "linear-gradient(135deg, #CC0000 0%, #990000 100%)", color: "#FFFFFF", boxShadow: "0 0 15px rgba(204, 0, 0, 0.4)", border: "none" }}>
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />{t.returnToGame}
              </Button>
            </div>
            <Link to="/ai-stocks" className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold text-base rounded-xl shadow-lg shadow-green-500/30 transition-all duration-300 active:scale-[0.98]">
              <TrendingUp className="w-5 h-5 flex-shrink-0" /><span className="text-center leading-tight">{t.goToStocks}</span>
            </Link>
          </div>

          <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-center">
            <p className="italic" style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: '8pt', color: '#9ca3af', letterSpacing: '0.3px' }}>Disclaimer: For entertainment only. Strategic Insights by dragongp.ai | Powered by Gemini AI</p>
          </div>
        </div>
      </main>
      <div className="print:hidden"><Footer /></div>

      {/* --- Print Styles --- */}
      <style>{`
        @media (max-width: 640px) {
          .lottery-ball-container .w-8, .lottery-ball-container .w-9 { width: 1.75rem !important; height: 1.75rem !important; font-size: 0.7rem !important; }
          .action-buttons button, .action-buttons a { padding: 0.5rem 0.75rem !important; font-size: 0.7rem !important; min-width: 80px !important; max-width: 110px !important; }
        }
        @media print {
          @page { size: A4; margin: 6mm; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
          html, body { background: white !important; color: #1f2937 !important; margin: 0 !important; padding: 0 !important; }
          .min-h-screen, main, .container { background: white !important; background-image: none !important; }
          #predictions-container, .predictions-grid { display: grid !important; visibility: visible !important; grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; }
          .prediction-row { display: flex !important; visibility: visible !important; padding: 6px 8px !important; border-radius: 8px !important; background: #f9fafb !important; border: 2px solid #9ca3af !important; flex-wrap: nowrap !important; align-items: center !important; }
          .set-badge { display: flex !important; visibility: visible !important; width: 22px !important; height: 22px !important; min-width: 22px !important; font-size: 11px !important; font-weight: 900 !important; background: #d1d5db !important; color: #1f2937 !important; border: 2px solid #6b7280 !important; align-items: center !important; justify-content: center !important; border-radius: 50% !important; }
          .lottery-ball-container { display: flex !important; visibility: visible !important; gap: 4px !important; justify-content: flex-start !important; flex-wrap: nowrap !important; }
          .lottery-ball { display: flex !important; visibility: visible !important; width: 28px !important; height: 28px !important; min-width: 28px !important; min-height: 28px !important; font-size: 12px !important; font-weight: 900 !important; align-items: center !important; justify-content: center !important; border-radius: 50% !important; border: 2px solid rgba(0,0,0,0.3) !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
          .lottery-ball[data-print-bg="#DC2626"] { background: #DC2626 !important; }
          .lottery-ball[data-print-bg="#2563EB"] { background: #2563EB !important; }
          .lottery-ball[data-print-bg="#16A34A"] { background: #16A34A !important; }
          .lottery-ball[data-print-bg="#EAB308"] { background: #EAB308 !important; }
          .lottery-ball span { display: block !important; visibility: visible !important; font-weight: 900 !important; font-size: 12px !important; text-shadow: none !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .lottery-ball[data-print-text="#FFFFFF"] span { color: #FFFFFF !important; }
          .lottery-ball[data-print-text="#000000"] span { color: #000000 !important; }
          .print\\:text-gray-900, .print\\:text-gray-800, .print\\:text-gray-700, .print\\:text-gray-600 { color: #1f2937 !important; }
          .container { max-width: 100% !important; padding: 0 4mm !important; }
          main { padding-top: 2mm !important; padding-bottom: 2mm !important; }
          .p-5, .p-6 { padding: 8px !important; }
          .mb-4, .mb-5 { margin-bottom: 6px !important; }
          .mb-3 { margin-bottom: 4px !important; }
          .print\\:break-inside-avoid { transform: scale(0.7); transform-origin: top center; margin-bottom: 2px !important; }
          .print\\:hidden, nav, header, .action-buttons, button, a[href*="ai-stocks"], a[href*="mark6-game"], .fixed { display: none !important; visibility: hidden !important; }
          .print\\:block { display: block !important; visibility: visible !important; }
          .print\\:break-inside-avoid, .print\\:page-break-inside-avoid { break-inside: avoid !important; page-break-inside: avoid !important; }
          .hidden.print\\:block.mt-8 { margin-top: 8px !important; padding-top: 4px !important; }
          .w-18, .w-20, .md\\.w-20 { width: 40px !important; height: 40px !important; }
          .text-2xl, .md\\:text-3xl { font-size: 16pt !important; }
          .rounded-2xl { background: white !important; border: 1px solid #d1d5db !important; }
        }
      `}</style>
    </div>
  );
}