import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Brain, TrendingUp, Activity, Shield, Sparkles, 
  Zap, Moon, Star, Dice6, Volume2, VolumeX, Play, 
  Info, CheckCircle, ArrowRight, Bot, Mic, BarChart3,
  Crown, Rocket, Target, Award, Gem
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const translations = {
  en: {
    pageTitle: "How It Works",
    backHome: "Back to Home",
    listenPage: "🔊 Listen to Page",
    stopListening: "⏹ Stop",
    
    // Choice Gateway
    chooseYourPath: "Choose Your Path",
    mark6CardTitle: "🎰 Science of Luck",
    mark6CardSubtitle: "Mark6 AI Methodology",
    stockCardTitle: "📈 Logic of Markets",
    stockCardSubtitle: "Stock AI Methodology",
    explore: "Explore →",
    
    // How It Works Flow
    flowTitle: "⚡ Get Started in 3 Simple Steps",
    flowStep1: "Choose Your AI Partner",
    flowStep1Desc: "Select from 5 unique AI models, each with a distinct mathematical approach.",
    flowStep2: "Configure & Analyze",
    flowStep2Desc: "Set your preferences and let the AI run advanced simulations.",
    flowStep3: "Get Insights",
    flowStep3Desc: "Receive your personalized prediction report with recommended numbers.",
    
    // Mark6 Section
    mark6Title: "🎲 Mark6 AI Methodology",
    mark6Subtitle: "Where mathematics meets entertainment — our AI engine combines advanced statistical models with fun, engaging predictions.",
    
    // 5 Characters - Enhanced
    elonTitle: "Elon's Strategic Vision",
    elonMethod: "Banker & Leg Game Theory",
    elonDesc: "Strategic game theory applied to identify optimal banker-leg relationships in historical draw patterns.",
    elonTag: "🎯 Strategic",
    
    godTitle: "God of Gambling's Insight",
    godMethod: "Chaos Theory Logic",
    godDesc: "Advanced chaos theory algorithms that reveal hidden structures within random draw data.",
    godTag: "🌀 Chaos",
    
    aladdinTitle: "Aladdin's Quantum Wisdom",
    aladdinMethod: "Quantum Spooky Sync",
    aladdinDesc: "Quantum entanglement principles applied to synchronize with cosmic randomness and identify number correlations.",
    aladdinTag: "⚛️ Quantum",
    
    luckyTitle: "Lucky Star's Fortune",
    luckyMethod: "Monte Carlo Engine",
    luckyDesc: "Massive random iterations (1,000,000+ virtual draws) to identify statistically significant number clusters.",
    luckyTag: "⭐ Monte Carlo",
    
    acheloisTitle: "Achelois's Lunar Wisdom",
    acheloisMethod: "Lunar Cycle Recognition",
    acheloisDesc: "Lunar phase analysis revealing correlations between moon cycles and historical draw outcomes.",
    acheloisTag: "🌙 Lunar",
    
    mark6Disclaimer: "🎯 Entertainment Only: All predictions are generated for entertainment purposes. Please play responsibly.",
    learnMore: "Learn More →",
    
    // Stock Section - Enhanced
    methodologyTitle: "📊 AI Stock Analysis Methodology",
    methodologySubtitle: "Deep learning meets quantitative finance — our engine delivers multi-dimensional market insights.",
    
    cnnTitle: "CNN Pattern Recognition",
    cnnDesc: "Advanced candlestick pattern analysis to identify market reversal signals and sustained trends.",
    cnnTag: "📊 Pattern",
    
    sentimentTitle: "Sentiment Intelligence",
    sentimentDesc: "Real-time global news and social media monitoring to quantify market fear & greed.",
    sentimentTag: "📰 Sentiment",
    
    volatilityTitle: "Volatility Prediction",
    volatilityDesc: "GARCH models for optimal risk control and price range forecasting (24h to 7 days).",
    volatilityTag: "📉 Risk",
    
    fundamentalTitle: "Fundamental Analysis",
    fundamentalDesc: "Automated parsing of financial reports and macro indicators to assess intrinsic value.",
    fundamentalTag: "💰 Value",
    
    neutralSubtitle: "⚖️ Pure Data, Zero Bias — We provide transparent AI insights, you make the decisions.",
    
    // Comparison Table - Enhanced
    compareTitle: "⚔️ Mark6 vs Stocks: AI Approach Comparison",
    compareFeature: "Feature",
    compareMark6: "🎰 Mark6 AI",
    compareStocks: "📈 Stocks AI",
    compareData: "Data Source",
    compareMark6Data: "Historical Draws (100+)",
    compareStocksData: "Live Market + News",
    compareModel: "Core Model",
    compareMark6Model: "Monte Carlo + Probability",
    compareStocksModel: "CNN + LSTM + GARCH",
    compareOutput: "Output",
    compareMark6Output: "10 Number Sets",
    compareStocksOutput: "Price + Sentiment",
    
    // CTA Section
    ctaTitle: "Ready to Explore?",
    ctaSub: "Start your journey with AI-powered predictions today.",
    ctaButton: "🚀 Get Started Now",
  },
  "zh-TW": {
    pageTitle: "運作原理",
    backHome: "返回首頁",
    listenPage: "🔊 收聽頁面",
    stopListening: "⏹ 停止",
    
    chooseYourPath: "選擇您的路徑",
    mark6CardTitle: "🎰 運氣的科學",
    mark6CardSubtitle: "六合彩 AI 運作原理",
    stockCardTitle: "📈 市場的邏輯",
    stockCardSubtitle: "股票 AI 運作原理",
    explore: "探索 →",
    
    flowTitle: "⚡ 三步驟開始使用",
    flowStep1: "選擇 AI 夥伴",
    flowStep1Desc: "從 5 個獨特 AI 模型中選擇，每個都有不同的數學方法。",
    flowStep2: "設定與分析",
    flowStep2Desc: "設定您的偏好，讓 AI 執行高級模擬。",
    flowStep3: "獲取洞見",
    flowStep3Desc: "接收您的專屬預測報告與推薦號碼組合。",
    
    mark6Title: "🎲 六合彩 AI 運作原理",
    mark6Subtitle: "數學與娛樂的結合 — 我們的 AI 引擎結合先進統計模型與趣味預測。",
    
    elonTitle: "Elon 戰略視野",
    elonMethod: "莊閒博弈論",
    elonDesc: "應用策略博弈論分析莊閒關係，識別歷史開獎數據中的最優規律。",
    elonTag: "🎯 戰略",
    
    godTitle: "賭神洞察",
    godMethod: "混沌理論邏輯",
    godDesc: "先進的混沌理論演算法，揭示隨機開獎數據中的隱藏結構。",
    godTag: "🌀 混沌",
    
    aladdinTitle: "阿拉丁量子智慧",
    aladdinMethod: "量子糾纏同步",
    aladdinDesc: "利用量子糾纏原理與宇宙隨機性同步，識別數字相關性。",
    aladdinTag: "⚛️ 量子",
    
    luckyTitle: "幸運星命運",
    luckyMethod: "蒙特卡羅引擎",
    luckyDesc: "大量隨機迭代 (1,000,000+ 次虛擬抽獎) 識別統計顯著的數字群組。",
    luckyTag: "⭐ 蒙地卡羅",
    
    acheloisTitle: "月光女神智慧",
    acheloisMethod: "月相週期識別",
    acheloisDesc: "月相分析揭示月亮週期與歷史開獎結果的相關性。",
    acheloisTag: "🌙 月相",
    
    mark6Disclaimer: "🎯 僅供娛樂：所有預測僅供娛樂用途。請理性投注。",
    learnMore: "了解更多 →",
    
    methodologyTitle: "📊 AI 股票分析方法論",
    methodologySubtitle: "深度學習與計量金融的結合 — 多維度市場洞察。",
    
    cnnTitle: "CNN 模式識別",
    cnnDesc: "先進的 K 線圖模式分析，識別市場反轉信號與持續趨勢。",
    cnnTag: "📊 模式",
    
    sentimentTitle: "情緒智能",
    sentimentDesc: "即時全球新聞與社交媒體監測，量化市場恐懼與貪婪。",
    sentimentTag: "📰 情緒",
    
    volatilityTitle: "波動性預測",
    volatilityDesc: "GARCH 模型優化風險控制，預測未來 24 小時至 7 天的價格區間。",
    volatilityTag: "📉 風險",
    
    fundamentalTitle: "基本面分析",
    fundamentalDesc: "自動解析財報數據與宏觀指標，評估內在價值。",
    fundamentalTag: "💰 價值",
    
    neutralSubtitle: "⚖️ 純淨數據，零偏見 — 我們提供透明的 AI 洞察，您自己做決策。",
    
    compareTitle: "⚔️ 六合彩 vs 股票：AI 方法比較",
    compareFeature: "功能",
    compareMark6: "🎰 六合彩 AI",
    compareStocks: "📈 股票 AI",
    compareData: "數據來源",
    compareMark6Data: "歷史開獎 (100+ 期)",
    compareStocksData: "即時市場 + 新聞",
    compareModel: "核心模型",
    compareMark6Model: "蒙特卡羅 + 機率論",
    compareStocksModel: "CNN + LSTM + GARCH",
    compareOutput: "輸出結果",
    compareMark6Output: "10 組號碼",
    compareStocksOutput: "價格 + 情緒",
    
    ctaTitle: "準備好探索了嗎？",
    ctaSub: "今天就開始您的 AI 預測之旅。",
    ctaButton: "🚀 立即開始",
  },
  "zh-CN": {
    pageTitle: "运作原理",
    backHome: "返回首页",
    listenPage: "🔊 收听页面",
    stopListening: "⏹ 停止",
    
    chooseYourPath: "选择您的路径",
    mark6CardTitle: "🎰 运气的科学",
    mark6CardSubtitle: "六合彩 AI 运作原理",
    stockCardTitle: "📈 市场的逻辑",
    stockCardSubtitle: "股票 AI 运作原理",
    explore: "探索 →",
    
    flowTitle: "⚡ 三步驟开始使用",
    flowStep1: "选择 AI 伙伴",
    flowStep1Desc: "从 5 个独特 AI 模型中选择，每个都有不同的数学方法。",
    flowStep2: "设定与分析",
    flowStep2Desc: "设定您的偏好，让 AI 执行高级模拟。",
    flowStep3: "获取洞见",
    flowStep3Desc: "接收您的专属预测报告与推荐号码组合。",
    
    mark6Title: "🎲 六合彩 AI 运作原理",
    mark6Subtitle: "数学与娱乐的结合 — 我们的 AI 引擎结合先进统计模型与趣味预测。",
    
    elonTitle: "Elon 战略视野",
    elonMethod: "庄闲博弈论",
    elonDesc: "应用策略博弈论分析庄闲关系，识别历史开奖数据中的最优规律。",
    elonTag: "🎯 战略",
    
    godTitle: "赌神洞察",
    godMethod: "混沌理论逻辑",
    godDesc: "先进的混沌理论算法，揭示随机开奖数据中的隐藏结构。",
    godTag: "🌀 混沌",
    
    aladdinTitle: "阿拉丁量子智慧",
    aladdinMethod: "量子纠缠同步",
    aladdinDesc: "利用量子纠缠原理与宇宙随机性同步，识别数字相关性。",
    aladdinTag: "⚛️ 量子",
    
    luckyTitle: "幸运星命运",
    luckyMethod: "蒙特卡洛引擎",
    luckyDesc: "大量随机迭代 (1,000,000+ 次虚拟抽奖) 识别统计显著的数字群组。",
    luckyTag: "⭐ 蒙特卡洛",
    
    acheloisTitle: "月光女神智慧",
    acheloisMethod: "月相周期识别",
    acheloisDesc: "月相分析揭示月亮周期与历史开奖结果的相关性。",
    acheloisTag: "🌙 月相",
    
    mark6Disclaimer: "🎯 仅供娱乐：所有预测仅供娱乐用途。请理性投注。",
    learnMore: "了解更多 →",
    
    methodologyTitle: "📊 AI 股票分析方法论",
    methodologySubtitle: "深度学习与计量金融的结合 — 多维度市场洞察。",
    
    cnnTitle: "CNN 模式识别",
    cnnDesc: "先进的 K 线图模式分析，识别市场反转信号与持续趋势。",
    cnnTag: "📊 模式",
    
    sentimentTitle: "情绪智能",
    sentimentDesc: "实时全球新闻与社交媒体监测，量化市场恐惧与贪婪。",
    sentimentTag: "📰 情绪",
    
    volatilityTitle: "波动性预测",
    volatilityDesc: "GARCH 模型优化风险控制，预测未来 24 小时至 7 天的价格区间。",
    volatilityTag: "📉 风险",
    
    fundamentalTitle: "基本面分析",
    fundamentalDesc: "自动解析财报数据与宏观指标，评估内在价值。",
    fundamentalTag: "💰 价值",
    
    neutralSubtitle: "⚖️ 纯净数据，零偏见 — 我们提供透明的 AI 洞察，您自己做决策。",
    
    compareTitle: "⚔️ 六合彩 vs 股票：AI 方法比较",
    compareFeature: "功能",
    compareMark6: "🎰 六合彩 AI",
    compareStocks: "📈 股票 AI",
    compareData: "数据来源",
    compareMark6Data: "历史开奖 (100+ 期)",
    compareStocksData: "实时市场 + 新闻",
    compareModel: "核心模型",
    compareMark6Model: "蒙特卡洛 + 概率论",
    compareStocksModel: "CNN + LSTM + GARCH",
    compareOutput: "输出结果",
    compareMark6Output: "10 组号码",
    compareStocksOutput: "价格 + 情绪",
    
    ctaTitle: "准备好探索了吗？",
    ctaSub: "今天就开始您的 AI 预测之旅。",
    ctaButton: "🚀 立即开始",
  }
};

const HowItWorks = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language] || translations.en;
  const [isSpeaking, setIsSpeaking] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const speakPage = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      return;
    }

    const contentElements = document.querySelectorAll('main p, main h1, main h2, main h3');
    let fullText = '';
    contentElements.forEach(el => {
      const text = el.textContent?.trim();
      if (text && text.length > 20) {
        fullText += text + '. ';
      }
    });

    if (!window.speechSynthesis) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(fullText);
    const voices = window.speechSynthesis.getVoices();
    const voiceLang = language === 'zh-TW' ? 'zh-HK' : language === 'zh-CN' ? 'zh-CN' : 'en-US';
    utterance.lang = voiceLang;
    
    let selectedVoice = voices.find(v => v.lang.includes(voiceLang));
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.includes('en'));
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-8">
        {/* Page Header with Voice Button */}
        <div className="container mx-auto px-6 max-w-6xl mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent mb-2">
                {t.pageTitle}
              </h1>
              <p className="text-slate-400 text-lg">
                {t.chooseYourPath}
              </p>
            </div>
            <button
              onClick={speakPage}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all font-medium ${
                isSpeaking 
                  ? 'bg-red-500/20 border border-red-500/50 text-red-400 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-amber-400 hover:from-amber-500/30 hover:to-yellow-500/30'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>{t.stopListening}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>{t.listenPage}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Choice Gateway - Two Large Cards with Vibrant Colors */}
        <section className="container mx-auto px-6 max-w-5xl mb-16">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mark6 Card - Gold/Amber Gradient */}
            <button
              onClick={() => scrollToSection('mark6-section')}
              className="group relative overflow-hidden rounded-2xl p-10 text-left transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #F59E0B 40%, #D97706 80%, #B45309 100%)',
                boxShadow: '0 20px 60px rgba(245, 158, 11, 0.4)'
              }}
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {t.mark6CardTitle}
                </h2>
                <p className="text-white/80 text-base mb-4">
                  {t.mark6CardSubtitle}
                </p>
                <div className="inline-flex items-center text-white/90 group-hover:translate-x-2 transition-transform font-medium">
                  <span>{t.explore}</span>
                </div>
              </div>
            </button>

            {/* Stock Card - Navy/Blue Gradient */}
            <button
              onClick={() => scrollToSection('stock-section')}
              className="group relative overflow-hidden rounded-2xl p-10 text-left transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #1E40AF 0%, #2563EB 40%, #3B82F6 70%, #60A5FA 100%)',
                boxShadow: '0 20px 60px rgba(37, 99, 235, 0.4)'
              }}
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {t.stockCardTitle}
                </h2>
                <p className="text-white/80 text-base mb-4">
                  {t.stockCardSubtitle}
                </p>
                <div className="inline-flex items-center text-white/90 group-hover:translate-x-2 transition-transform font-medium">
                  <span>{t.explore}</span>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* How It Works Flow - 3 Steps with Bright Colors */}
        <section className="container mx-auto px-6 max-w-5xl mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
              {t.flowTitle}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Bot, title: t.flowStep1, desc: t.flowStep1Desc, color: 'from-amber-400 to-yellow-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
              { icon: Mic, title: t.flowStep2, desc: t.flowStep2Desc, color: 'from-blue-400 to-cyan-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
              { icon: BarChart3, title: t.flowStep3, desc: t.flowStep3Desc, color: 'from-emerald-400 to-green-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' }
            ].map((step, idx) => (
              <div key={idx} className={`relative p-8 rounded-2xl border ${step.border} ${step.bg} text-center group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl`}>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold flex items-center justify-center text-sm shadow-lg">
                  {idx + 1}
                </div>
                <div className="mt-4 flex justify-center">
                  <step.icon className={`w-12 h-12 bg-gradient-to-r ${step.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`} />
                </div>
                <h3 className="font-bold text-white text-lg mt-3">{step.title}</h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table - Vibrant Colors */}
        <section className="container mx-auto px-6 max-w-5xl mb-16">
          <div className="rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
            <div className="text-center py-5 bg-gradient-to-r from-slate-800/80 to-slate-900/80 border-b border-slate-700/50">
              <h2 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">
                {t.compareTitle}
              </h2>
            </div>
            <div className="grid grid-cols-3 divide-x divide-slate-700/50">
              <div className="p-4 text-center font-bold text-slate-400 bg-slate-900/50"> {t.compareFeature}</div>
              <div className="p-4 text-center font-bold text-amber-400 bg-gradient-to-r from-amber-500/10 to-yellow-500/10">{t.compareMark6}</div>
              <div className="p-4 text-center font-bold text-blue-400 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">{t.compareStocks}</div>
              
              <div className="p-4 text-sm text-slate-400 bg-slate-900/30 border-t border-slate-700/50">{t.compareData}</div>
              <div className="p-4 text-sm text-white text-center bg-slate-900/30 border-t border-slate-700/50">{t.compareMark6Data}</div>
              <div className="p-4 text-sm text-white text-center bg-slate-900/30 border-t border-slate-700/50">{t.compareStocksData}</div>
              
              <div className="p-4 text-sm text-slate-400 bg-slate-900/30 border-t border-slate-700/50">{t.compareModel}</div>
              <div className="p-4 text-sm text-white text-center bg-slate-900/30 border-t border-slate-700/50">{t.compareMark6Model}</div>
              <div className="p-4 text-sm text-white text-center bg-slate-900/30 border-t border-slate-700/50">{t.compareStocksModel}</div>
              
              <div className="p-4 text-sm text-slate-400 bg-slate-900/30 border-t border-slate-700/50 rounded-bl-2xl">{t.compareOutput}</div>
              <div className="p-4 text-sm text-white text-center bg-slate-900/30 border-t border-slate-700/50">{t.compareMark6Output}</div>
              <div className="p-4 text-sm text-white text-center bg-slate-900/30 border-t border-slate-700/50 rounded-br-2xl">{t.compareStocksOutput}</div>
            </div>
          </div>
        </section>

        {/* Mark6 AI Methodology Section - Vibrant Gold Theme */}
        <section 
          id="mark6-section" 
          className="py-20 scroll-mt-20 relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #0f0a00 0%, #1a0f00 30%, #2d1a00 60%, #1a0f00 100%)'
          }}
        >
          {/* Gold particles background */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-10 left-10 w-2 h-2 bg-amber-400 rounded-full blur-sm" />
            <div className="absolute top-20 right-20 w-3 h-3 bg-yellow-400 rounded-full blur-sm" />
            <div className="absolute bottom-10 left-1/3 w-2 h-2 bg-amber-500 rounded-full blur-sm" />
            <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-yellow-300 rounded-full blur-md" />
          </div>
          
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent mb-4">
                {t.mark6Title}
              </h2>
              <p className="text-lg max-w-4xl mx-auto text-amber-200/70">
                {t.mark6Subtitle}
              </p>
            </div>
            
            {/* 5 Characters Grid - Enhanced with Tags */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                { icon: Zap, title: t.elonTitle, method: t.elonMethod, desc: t.elonDesc, tag: t.elonTag, color: 'from-amber-400 to-yellow-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
                { icon: Dice6, title: t.godTitle, method: t.godMethod, desc: t.godDesc, tag: t.godTag, color: 'from-purple-400 to-pink-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
                { icon: Sparkles, title: t.aladdinTitle, method: t.aladdinMethod, desc: t.aladdinDesc, tag: t.aladdinTag, color: 'from-violet-400 to-purple-500', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
                { icon: Star, title: t.luckyTitle, method: t.luckyMethod, desc: t.luckyDesc, tag: t.luckyTag, color: 'from-cyan-400 to-blue-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
                { icon: Moon, title: t.acheloisTitle, method: t.acheloisMethod, desc: t.acheloisDesc, tag: t.acheloisTag, color: 'from-sky-400 to-indigo-500', bg: 'bg-sky-500/10', border: 'border-sky-500/30' }
              ].map((char, idx) => (
                <div 
                  key={idx}
                  className={`rounded-2xl p-6 border ${char.border} bg-slate-900/40 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-2xl hover:border-${char.color.split(' ')[0].replace('from-', '')}`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${char.color} bg-opacity-20`}>
                      <char.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{char.title}</h3>
                      <p className={`text-sm bg-gradient-to-r ${char.color} bg-clip-text text-transparent font-medium`}>{char.method}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{char.desc}</p>
                  <div className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-700/50">
                    {char.tag}
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="text-center p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20">
              <p className="text-sm text-amber-400/80">
                {t.mark6Disclaimer}
              </p>
            </div>
          </div>
        </section>

        {/* Stock AI Methodology Section - Vibrant Blue Theme */}
        <section 
          id="stock-section" 
          className="py-20 scroll-mt-20 relative overflow-hidden" 
          style={{
            background: 'linear-gradient(180deg, #0a0f1a 0%, #0a1628 30%, #0f1f3a 60%, #0a1628 100%)'
          }}
        >
          {/* Stock Candle Chart Watermark - Enhanced */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
            <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
              <rect x="50" y="150" width="12" height="120" fill="#2ECC71" />
              <rect x="150" y="180" width="12" height="90" fill="#2ECC71" />
              <rect x="350" y="120" width="12" height="140" fill="#2ECC71" />
              <rect x="550" y="160" width="12" height="100" fill="#2ECC71" />
              <rect x="750" y="140" width="12" height="90" fill="#2ECC71" />
              <rect x="950" y="100" width="12" height="150" fill="#2ECC71" />
              <rect x="1100" y="130" width="12" height="110" fill="#2ECC71" />
              <rect x="100" y="200" width="12" height="100" fill="#E74C3C" />
              <rect x="250" y="160" width="12" height="130" fill="#E74C3C" />
              <rect x="450" y="180" width="12" height="90" fill="#E74C3C" />
              <rect x="650" y="200" width="12" height="110" fill="#E74C3C" />
              <rect x="850" y="170" width="12" height="120" fill="#E74C3C" />
              <rect x="1000" y="190" width="12" height="80" fill="#E74C3C" />
              <path d="M30 320 Q200 260, 400 180 T800 160 T1180 100" stroke="#2ECC71" strokeWidth="2" fill="none" opacity="0.6" />
              <path d="M30 370 Q300 320, 600 290 T1000 260 T1180 230" stroke="#E74C3C" strokeWidth="2" fill="none" opacity="0.6" />
            </svg>
          </div>

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent mb-4">
                {t.methodologyTitle}
              </h2>
              <p className="text-lg max-w-4xl mx-auto text-blue-200/70">
                {t.methodologySubtitle}
              </p>
            </div>
            
            {/* 4 Methodology Cards - Enhanced */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-10">
              {[
                { icon: Brain, title: t.cnnTitle, desc: t.cnnDesc, tag: t.cnnTag, color: 'from-emerald-400 to-green-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
                { icon: Activity, title: t.sentimentTitle, desc: t.sentimentDesc, tag: t.sentimentTag, color: 'from-red-400 to-orange-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
                { icon: Shield, title: t.volatilityTitle, desc: t.volatilityDesc, tag: t.volatilityTag, color: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
                { icon: TrendingUp, title: t.fundamentalTitle, desc: t.fundamentalDesc, tag: t.fundamentalTag, color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className={`rounded-2xl p-6 border ${item.border} bg-slate-900/40 backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-2xl`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r ${item.color} bg-opacity-20`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
                  <div className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-700/50">
                    {item.tag}
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="text-center p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-400/80">
                {t.neutralSubtitle}
              </p>
            </div>
          </div>
        </section>

        {/* NEW: CTA Section - Call to Action */}
        <section className="container mx-auto px-6 max-w-5xl mt-16 mb-8">
          <div className="relative overflow-hidden rounded-3xl p-12 text-center bg-gradient-to-r from-amber-600/20 via-yellow-600/10 to-amber-600/20 border border-amber-500/30">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <Crown className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {t.ctaTitle}
              </h2>
              <p className="text-slate-400 text-lg mb-6">
                {t.ctaSub}
              </p>
              <button
                onClick={() => navigate("/generate-report")}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold text-lg shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] transition-all"
              >
                {t.ctaButton}
              </button>
            </div>
          </div>
        </section>

        {/* Back to Home Button */}
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t.backHome}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;