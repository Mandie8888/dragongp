import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, TrendingUp, Activity, Shield, Sparkles, Zap, Moon, Star, Dice6 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const translations = {
  en: {
    pageTitle: "How It Works",
    backHome: "Back to Home",
    
    // Choice Gateway
    chooseYourPath: "Choose Your Path",
    mark6CardTitle: "Science of Luck",
    mark6CardSubtitle: "Mark6 AI Methodology",
    stockCardTitle: "Logic of Markets",
    stockCardSubtitle: "Stock AI Methodology",
    
    // Mark6 Section
    mark6Title: "Mark6 AI Methodology",
    mark6Subtitle: "Our AI Mark6 engine combines mathematical models with entertainment-focused predictions. This is purely for fun and entertainment purposes only.",
    
    // 5 Characters
    elonTitle: "Elon's Strategic Prediction",
    elonMethod: "Banker & Leg Strategic Game Theory",
    elonDesc: "This model applies strategic game theory to analyze banker-leg relationships, identifying patterns in historical draw data.",
    
    godTitle: "God of Gambling's Divine Vision",
    godMethod: "Chaos Theory Logic",
    godDesc: "This model identifies hidden structures within random draw data by analyzing historical air turbulence patterns.",
    
    aladdinTitle: "Aladdin's Magic Lamp",
    aladdinMethod: "Quantum Spooky Sync",
    aladdinDesc: "Leveraging quantum entanglement principles, this model synchronizes with cosmic randomness to identify number correlations.",
    
    luckyTitle: "Lucky Star's Cosmic Fortune",
    luckyMethod: "Monte Carlo Simulation Engine",
    luckyDesc: "By running massive random iterations, this model identifies number clusters that statistically survive 1,000,000 virtual draws.",
    
    acheloisTitle: "Achelois's Moonlight Wisdom",
    acheloisMethod: "Lunar Cycle Pattern Recognition",
    acheloisDesc: "This model analyzes historical draws in relation to lunar phases, identifying patterns that correlate with moon cycles.",
    
    mark6Disclaimer: "Entertainment Only: All predictions are generated for entertainment purposes. Gambling involves risk. Please play responsibly.",
    
    // Stock Section
    methodologyTitle: "AI Stock Analysis Methodology",
    methodologySubtitle: "Our AI stock engine integrates deep learning with quantitative financial models to provide multi-dimensional market insights.",
    
    cnnTitle: "CNN Trend Analysis",
    cnnDesc: "Analyzes candlestick visual patterns to identify market reversal signals and sustained trends.",
    
    sentimentTitle: "Sentiment Analysis Engine",
    sentimentDesc: "Monitors global news and social media in real-time to quantify \"Fear & Greed\" regarding specific tickers.",
    
    volatilityTitle: "Volatility Prediction",
    volatilityDesc: "Utilizes GARCH models to optimize risk control and forecast potential price ranges for the next 24 hours to 7 days.",
    
    fundamentalTitle: "Fundamental Quant",
    fundamentalDesc: "Automatically parses financial reports and macroeconomic indicators to assess intrinsic value and growth potential.",
    
    neutralTitle: "AI Stock Data Analysis Methodology",
    neutralSubtitle: "This platform adheres to a principle of neutrality, aiming to transform professional AI technology into accessible data references. Final decisions should be made independently by the user.",
    
    sentimentQuantTitle: "Sentiment Quantization",
    sentimentQuantDesc: "Monitors market heat via AI without providing buy/sell advice, helping users identify \"Crowd Sentiment\".",
    
    patternTitle: "Multi-dimensional Pattern Recognition",
    patternDesc: "Uses CNN models to present \"statistical similarities\" in historical data rather than predicting future outcomes.",
    
    riskTitle: "Volatility Risk Assessment",
    riskDesc: "Quantifies risk ranges using GARCH models to alert users to potential volatility and strengthen risk awareness."
  },
  "zh-TW": {
    pageTitle: "運作原理",
    backHome: "返回首頁",
    
    // Choice Gateway
    chooseYourPath: "選擇您的路徑",
    mark6CardTitle: "運氣的科學",
    mark6CardSubtitle: "六合彩 AI 運作原理",
    stockCardTitle: "市場的邏輯",
    stockCardSubtitle: "股票 AI 運作原理",
    
    // Mark6 Section
    mark6Title: "六合彩 AI 運作原理",
    mark6Subtitle: "我們的 AI 六合彩引擎結合數學模型與娛樂導向預測。僅供娛樂用途。",
    
    // 5 Characters
    elonTitle: "Elon 戰略預測",
    elonMethod: "莊閒博弈論",
    elonDesc: "此模型應用策略博弈論分析莊閒關係，識別歷史開獎數據中的規律。",
    
    godTitle: "賭神天眼",
    godMethod: "混沌理論邏輯",
    godDesc: "此模型通過分析歷史氣流擾動模式，識別隨機開獎數據中的隱藏結構。",
    
    aladdinTitle: "阿拉丁神燈",
    aladdinMethod: "量子糾纏同步",
    aladdinDesc: "利用量子糾纏原理，此模型與宇宙隨機性同步，識別數字相關性。",
    
    luckyTitle: "幸運星宇宙運勢",
    luckyMethod: "蒙特卡羅模擬引擎",
    luckyDesc: "通過運行大量隨機迭代，此模型識別在 1,000,000 次虛擬抽獎中統計存活的數字群組。",
    
    acheloisTitle: "月光女神智慧",
    acheloisMethod: "月相週期模式識別",
    acheloisDesc: "此模型分析歷史開獎與月相的關係，識別與月亮週期相關的規律。",
    
    mark6Disclaimer: "僅供娛樂：所有預測僅供娛樂用途。賭博涉及風險，請理性投注。",
    
    // Stock Section
    methodologyTitle: "AI 股票分析方法論",
    methodologySubtitle: "我們的 AI 股市引擎結合了深度學習與計量金融模型，為投資者提供多維度的市場洞察。",
    
    cnnTitle: "卷積神經網絡 (CNN) 趨勢分析",
    cnnDesc: "透過分析 K 線圖的視覺模式，識別市場反轉信號與持續趨勢。",
    
    sentimentTitle: "情緒分析引擎",
    sentimentDesc: "實時監測全球新聞與社交媒體，量化市場對特定股票的恐懼與貪婪情緒。",
    
    volatilityTitle: "波動性預測模型",
    volatilityDesc: "利用 GARCH 模型優化風險控制，預測未來 24 小時至 7 天的潛在價格區間。",
    
    fundamentalTitle: "基本面量化",
    fundamentalDesc: "自動抓取財報數據，結合宏觀經濟指標，評估股票的內在價值與成長潛力。",
    
    neutralTitle: "AI 股市數據分析方法論",
    neutralSubtitle: "本平台堅持中立原則，旨在將專業級 AI 技術轉化為易於理解的數據參考。最終決策應由用戶根據個人情況獨立做出。",
    
    sentimentQuantTitle: "市場情緒量化",
    sentimentQuantDesc: "透過 AI 監測市場熱度，而非提供买卖建議，幫助用戶識別當前的「群體情緒」。",
    
    patternTitle: "多維度模式識別",
    patternDesc: "利用 CNN 模型分析歷史數據形狀，為用戶呈現「統計上的相似性」，而非預測未來結果。",
    
    riskTitle: "波動性風險評估",
    riskDesc: "利用 GARCH 模型量化風險區間，提醒用戶潛在的市場波動，強化風險意識。"
  },
  "zh-CN": {
    pageTitle: "运作原理",
    backHome: "返回首页",
    
    // Choice Gateway
    chooseYourPath: "选择您的路径",
    mark6CardTitle: "运气的科学",
    mark6CardSubtitle: "六合彩 AI 运作原理",
    stockCardTitle: "市场的逻辑",
    stockCardSubtitle: "股票 AI 运作原理",
    
    // Mark6 Section
    mark6Title: "六合彩 AI 运作原理",
    mark6Subtitle: "我们的 AI 六合彩引擎结合数学模型与娱乐导向预测。仅供娱乐用途。",
    
    // 5 Characters
    elonTitle: "Elon 战略预测",
    elonMethod: "庄闲博弈论",
    elonDesc: "此模型应用策略博弈论分析庄闲关系，识别历史开奖数据中的规律。",
    
    godTitle: "赌神天眼",
    godMethod: "混沌理论逻辑",
    godDesc: "此模型通过分析历史气流扰动模式，识别随机开奖数据中的隐藏结构。",
    
    aladdinTitle: "阿拉丁神灯",
    aladdinMethod: "量子纠缠同步",
    aladdinDesc: "利用量子纠缠原理，此模型与宇宙随机性同步，识别数字相关性。",
    
    luckyTitle: "幸运星宇宙运势",
    luckyMethod: "蒙特卡洛模拟引擎",
    luckyDesc: "通过运行大量随机迭代，此模型识别在 1,000,000 次虚拟抽奖中统计存活的数字群组。",
    
    acheloisTitle: "月光女神智慧",
    acheloisMethod: "月相周期模式识别",
    acheloisDesc: "此模型分析历史开奖与月相的关系，识别与月亮周期相关的规律。",
    
    mark6Disclaimer: "仅供娱乐：所有预测仅供娱乐用途。赌博涉及风险，请理性投注。",
    
    // Stock Section
    methodologyTitle: "AI 股票分析方法论",
    methodologySubtitle: "我们的 AI 股市引擎结合了深度学习与计量金融模型，为投资者提供多维度的市场洞察。",
    
    cnnTitle: "卷积神经网络 (CNN) 趋势分析",
    cnnDesc: "通过分析 K 线图的视觉模式，识别市场反转信号与持续趋势。",
    
    sentimentTitle: "情绪分析引擎",
    sentimentDesc: "实时监测全球新闻与社交媒体，量化市场对特定股票的恐惧与贪婪情绪。",
    
    volatilityTitle: "波动性预测模型",
    volatilityDesc: "利用 GARCH 模型优化风险控制，预测未来 24 小时至 7 天的潜在价格区间。",
    
    fundamentalTitle: "基本面量化",
    fundamentalDesc: "自动抓取财报数据，结合宏观经济指标，评估股票的内在价值与成长潜力。",
    
    neutralTitle: "AI 股市数据分析方法论",
    neutralSubtitle: "本平台坚持中立原则，旨在将专业级 AI 技术转化为易于理解的数据参考。最终决策应由用户根据个人情况独立做出。",
    
    sentimentQuantTitle: "市场情绪量化",
    sentimentQuantDesc: "通过 AI 监测市场热度，而非提供买卖建议，帮助用户识别当前的「群体情绪」。",
    
    patternTitle: "多维度模式识别",
    patternDesc: "利用 CNN 模型分析历史数据形状，为用户呈现「统计上的相似性」，而非预测未来结果。",
    
    riskTitle: "波动性风险评估",
    riskDesc: "利用 GARCH 模型量化风险区间，提醒用户潜在的市场波动，强化风险意识。"
  }
};

const HowItWorks = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-8">
        {/* Page Header */}
        <div className="container mx-auto px-6 max-w-6xl mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gradient-gold mb-2">
            {t.pageTitle}
          </h1>
          <p className="text-center text-foreground/60 text-lg">
            {t.chooseYourPath}
          </p>
        </div>

        {/* Choice Gateway - Two Large Cards */}
        <section className="container mx-auto px-6 max-w-5xl mb-16">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Mark6 Card - Gold Theme */}
            <button
              onClick={() => scrollToSection('mark6-section')}
              className="group relative overflow-hidden rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #B8860B 100%)',
                boxShadow: '0 10px 40px rgba(255, 215, 0, 0.3)'
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                <Dice6 className="w-full h-full text-white" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {t.mark6CardTitle}
                </h2>
                <p className="text-white/80 text-base">
                  {t.mark6CardSubtitle}
                </p>
                <div className="mt-4 flex items-center text-white/90 group-hover:translate-x-2 transition-transform">
                  <span className="font-medium">Explore</span>
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </div>
              </div>
            </button>

            {/* Stock Card - Navy Blue Theme */}
            <button
              onClick={() => scrollToSection('stock-section')}
              className="group relative overflow-hidden rounded-2xl p-8 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #1A237E 0%, #283593 50%, #3949AB 100%)',
                boxShadow: '0 10px 40px rgba(26, 35, 126, 0.3)'
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                <TrendingUp className="w-full h-full text-white" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {t.stockCardTitle}
                </h2>
                <p className="text-white/80 text-base">
                  {t.stockCardSubtitle}
                </p>
                <div className="mt-4 flex items-center text-white/90 group-hover:translate-x-2 transition-transform">
                  <span className="font-medium">Explore</span>
                  <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* Mark6 AI Methodology Section - Gold Theme */}
        <section 
          id="mark6-section" 
          className="py-16 scroll-mt-20"
          style={{
            background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)'
          }}
        >
          <div className="container mx-auto px-6 max-w-6xl">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ 
                  background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {t.mark6Title}
              </h2>
              <p className="text-lg max-w-4xl mx-auto text-gray-300">
                {t.mark6Subtitle}
              </p>
            </div>
            
            {/* 5 Characters Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Elon */}
              <div 
                className="rounded-xl p-6 border transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: 'rgba(255, 215, 0, 0.1)', 
                  borderColor: 'rgba(255, 215, 0, 0.3)' 
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 215, 0, 0.2)' }}>
                    <Zap className="w-6 h-6" style={{ color: '#FFD700' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{t.elonTitle}</h3>
                    <p className="text-sm" style={{ color: '#FFD700' }}>{t.elonMethod}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{t.elonDesc}</p>
              </div>

              {/* God of Gambling */}
              <div 
                className="rounded-xl p-6 border transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: 'rgba(218, 165, 32, 0.1)', 
                  borderColor: 'rgba(218, 165, 32, 0.3)' 
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(218, 165, 32, 0.2)' }}>
                    <Dice6 className="w-6 h-6" style={{ color: '#DAA520' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{t.godTitle}</h3>
                    <p className="text-sm" style={{ color: '#DAA520' }}>{t.godMethod}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{t.godDesc}</p>
              </div>

              {/* Aladdin */}
              <div 
                className="rounded-xl p-6 border transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: 'rgba(138, 43, 226, 0.1)', 
                  borderColor: 'rgba(138, 43, 226, 0.3)' 
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(138, 43, 226, 0.2)' }}>
                    <Sparkles className="w-6 h-6" style={{ color: '#8A2BE2' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{t.aladdinTitle}</h3>
                    <p className="text-sm" style={{ color: '#8A2BE2' }}>{t.aladdinMethod}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{t.aladdinDesc}</p>
              </div>

              {/* Lucky Star */}
              <div 
                className="rounded-xl p-6 border transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: 'rgba(192, 192, 192, 0.1)', 
                  borderColor: 'rgba(192, 192, 192, 0.3)' 
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(192, 192, 192, 0.2)' }}>
                    <Star className="w-6 h-6" style={{ color: '#C0C0C0' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{t.luckyTitle}</h3>
                    <p className="text-sm" style={{ color: '#C0C0C0' }}>{t.luckyMethod}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{t.luckyDesc}</p>
              </div>

              {/* Achelois */}
              <div 
                className="rounded-xl p-6 border transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: 'rgba(255, 191, 0, 0.1)', 
                  borderColor: 'rgba(255, 191, 0, 0.3)' 
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 191, 0, 0.2)' }}>
                    <Moon className="w-6 h-6" style={{ color: '#FFBF00' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{t.acheloisTitle}</h3>
                    <p className="text-sm" style={{ color: '#FFBF00' }}>{t.acheloisMethod}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{t.acheloisDesc}</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}>
              <p className="text-sm" style={{ color: '#FFD700' }}>
                ⚠️ {t.mark6Disclaimer}
              </p>
            </div>
          </div>
        </section>

        {/* Stock AI Methodology Section - Card-Based Layout Matching Mark6 */}
        <section 
          id="stock-section" 
          className="py-16 scroll-mt-20 relative overflow-hidden" 
          style={{ backgroundColor: '#121212' }}
        >
          {/* Stock Candle Chart Watermark Background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
            <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
              {/* Green candles (up/bull) */}
              <rect x="50" y="150" width="10" height="100" fill="#2ECC71" />
              <line x1="55" y1="110" x2="55" y2="150" stroke="#2ECC71" strokeWidth="2" />
              <line x1="55" y1="250" x2="55" y2="290" stroke="#2ECC71" strokeWidth="2" />
              
              <rect x="150" y="180" width="10" height="70" fill="#2ECC71" />
              <rect x="350" y="120" width="10" height="120" fill="#2ECC71" />
              <rect x="550" y="160" width="10" height="80" fill="#2ECC71" />
              <rect x="750" y="140" width="10" height="70" fill="#2ECC71" />
              <rect x="950" y="100" width="10" height="130" fill="#2ECC71" />
              <rect x="1100" y="130" width="10" height="90" fill="#2ECC71" />
              
              {/* Red candles (down/bear) */}
              <rect x="100" y="200" width="10" height="80" fill="#E74C3C" />
              <rect x="250" y="160" width="10" height="110" fill="#E74C3C" />
              <rect x="450" y="180" width="10" height="70" fill="#E74C3C" />
              <rect x="650" y="200" width="10" height="90" fill="#E74C3C" />
              <rect x="850" y="170" width="10" height="100" fill="#E74C3C" />
              <rect x="1000" y="190" width="10" height="60" fill="#E74C3C" />
              
              {/* Trend lines */}
              <path d="M30 320 Q200 260, 400 180 T800 160 T1180 100" stroke="#2ECC71" strokeWidth="1.5" fill="none" opacity="0.4" />
              <path d="M30 370 Q300 320, 600 290 T1000 260 T1180 230" stroke="#E74C3C" strokeWidth="1.5" fill="none" opacity="0.4" />
            </svg>
          </div>

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            {/* Section Header - Matching Mark6 Style */}
            <div className="text-center mb-12">
              <h2 
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ 
                  background: 'linear-gradient(90deg, #2ECC71, #27AE60)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {t.methodologyTitle}
              </h2>
              <p className="text-lg max-w-4xl mx-auto text-gray-300">
                {t.methodologySubtitle}
              </p>
            </div>
            
            {/* 4 Methodology Cards Grid - Matching Mark6 Layout */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
              {/* CNN Trend Analysis Card */}
              <div 
                className="rounded-xl p-6 border transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: 'rgba(46, 204, 113, 0.1)', 
                  borderColor: 'rgba(46, 204, 113, 0.3)' 
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(46, 204, 113, 0.2)' }}>
                    <Brain className="w-6 h-6" style={{ color: '#2ECC71' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{t.cnnTitle}</h3>
                    <p className="text-sm" style={{ color: '#2ECC71' }}>
                      {language === 'en' ? 'Candlestick Pattern Recognition' : language === 'zh-TW' ? 'K線形態識別' : 'K线形态识别'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{t.cnnDesc}</p>
              </div>

              {/* Sentiment Analysis Card */}
              <div 
                className="rounded-xl p-6 border transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: 'rgba(231, 76, 60, 0.1)', 
                  borderColor: 'rgba(231, 76, 60, 0.3)' 
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(231, 76, 60, 0.2)' }}>
                    <Activity className="w-6 h-6" style={{ color: '#E74C3C' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{t.sentimentTitle}</h3>
                    <p className="text-sm" style={{ color: '#E74C3C' }}>
                      {language === 'en' ? 'Fear & Greed Index' : language === 'zh-TW' ? '恐懼與貪婪指數' : '恐惧与贪婪指数'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{t.sentimentDesc}</p>
              </div>

              {/* Volatility Prediction Card */}
              <div 
                className="rounded-xl p-6 border transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: 'rgba(46, 204, 113, 0.1)', 
                  borderColor: 'rgba(46, 204, 113, 0.3)' 
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(46, 204, 113, 0.2)' }}>
                    <Shield className="w-6 h-6" style={{ color: '#2ECC71' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{t.volatilityTitle}</h3>
                    <p className="text-sm" style={{ color: '#2ECC71' }}>
                      {language === 'en' ? 'GARCH Risk Control' : language === 'zh-TW' ? 'GARCH 風險控制' : 'GARCH 风险控制'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{t.volatilityDesc}</p>
              </div>

              {/* Fundamental Quant Card */}
              <div 
                className="rounded-xl p-6 border transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: 'rgba(231, 76, 60, 0.1)', 
                  borderColor: 'rgba(231, 76, 60, 0.3)' 
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(231, 76, 60, 0.2)' }}>
                    <TrendingUp className="w-6 h-6" style={{ color: '#E74C3C' }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{t.fundamentalTitle}</h3>
                    <p className="text-sm" style={{ color: '#E74C3C' }}>
                      {language === 'en' ? 'Intrinsic Value Assessment' : language === 'zh-TW' ? '內在價值評估' : '内在价值评估'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">{t.fundamentalDesc}</p>
              </div>
            </div>

            {/* Disclaimer - Matching Mark6 Style */}
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(46, 204, 113, 0.1)' }}>
              <p className="text-sm" style={{ color: '#2ECC71' }}>
                📊 {t.neutralSubtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Back to Home Button */}
        <div className="flex justify-center mt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-sm text-foreground/60 hover:text-foreground hover:bg-transparent"
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
