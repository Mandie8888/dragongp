import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCredits } from "@/hooks/useCredits";
import { CreditsDepletedPopup } from "@/components/CreditsDepletedPopup";
import SignUpDialog from "@/components/SignUpDialog";
import { AIReportCard } from "@/components/report/AIReportCard";
import { StockSearchBar, validateTicker, MarketType, currencySymbols, currencyCodes, getCompanyName } from "@/components/report/StockSearchBar";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Shield, RefreshCw, AlertTriangle, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ReportData {
  marketData: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: string;
    high: number;
    low: number;
    companyName?: string;
    exchange?: string;
    currency?: string;
  };
  technicals: {
    rsi: number;
    macd: number;
    macdSignal: number;
    macdHistogram: number;
  };
  analysis: {
    probability: number;
    direction: "bullish" | "bearish" | "neutral";
    summary: string;
  };
}

// Sticky Footer Disclaimer Component
function StickyDisclaimer() {
  const { language } = useLanguage();

  const disclaimerContent = {
    en: {
      title: "Important Safety Disclaimer",
      line1: "This AI Probability Analysis is for educational and 'Mental Gym' entertainment purposes ONLY.",
      line2: "We do NOT hold any financial advisory, investment, or gaming licenses.",
      line3: "This is NOT financial advice. All trading/gaming decisions are your own responsibility.",
      line4: "Past performance does not guarantee future results. You are the lead player.",
    },
    "zh-TW": {
      title: "重要安全聲明",
      line1: "此 AI 概率分析僅供教育及「心靈體操」娛樂之用。",
      line2: "我們不持有任何金融顧問、投資或博弈牌照。",
      line3: "這不是財務建議。所有交易/博弈決策均由您自行負責。",
      line4: "過往表現不代表未來結果。您是主導玩家。",
    },
    "zh-CN": {
      title: "重要安全声明",
      line1: "此 AI 概率分析仅供教育及'心灵体操'娱乐之用。",
      line2: "我们不持有任何金融顾问、投资或博弈牌照。",
      line3: "这不是财务建议。所有交易/博弈决策均由您自行负责。",
      line4: "过往表现不代表未来结果。您是主导玩家。",
    },
  };

  const t = disclaimerContent[language] || disclaimerContent.en;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.5)]"
      style={{ 
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        borderTop: '1px solid rgba(192, 192, 192, 0.3)'
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-start gap-3 max-w-4xl mx-auto">
          <div className="flex-shrink-0 mt-0.5">
            <div className="p-1.5 rounded-full" style={{ backgroundColor: 'rgba(220, 38, 38, 0.2)' }}>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-red-400 mb-1">{t.title}</p>
            <div className="text-[10px] text-[#C0C0C0] leading-relaxed space-y-0.5">
              <p>{t.line1}</p>
              <p className="font-medium text-white">{t.line2}</p>
              <p>{t.line3} {t.line4}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GenerateReport() {
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const {
    profile,
    loading,
    creditBalance,
    totalReportsGenerated,
    tier,
    showOutOfCredits,
    setShowOutOfCredits,
    checkCanGenerate,
    consumeCredit,
    handleCheckout,
  } = useCredits();

  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [searchedSymbol, setSearchedSymbol] = useState<string>("");
  const [searchedMarket, setSearchedMarket] = useState<MarketType>("US");
  const [initialSymbol, setInitialSymbol] = useState<string>("");
  const [initialMarket, setInitialMarket] = useState<MarketType>("US");

  // Handle URL parameter for pre-filled symbol from trending
  useEffect(() => {
    const symbolParam = searchParams.get("symbol");
    if (symbolParam) {
      setInitialSymbol(symbolParam);
    }
  }, [searchParams]);

  const content = {
    en: {
      title: "AI Mark6 Game Probability",
      subtitle: "Cognitive Engagement Exercise",
      creditsLabel: "Credits Available",
      reportsLabel: "Reports Generated",
      tierLabel: "Current Tier",
      generateButton: "Generate Report",
      generating: "Analyzing...",
      regenerate: "Generate New Report",
      backButton: "Back to Home",
      notLoggedIn: "Please sign up or log in to generate reports",
      topUp: "TOP-UP",
      signUp: "Sign Up",
      noCreditsWarning: "You need credits to generate a report",
      summaryBullish: "Based on current technical indicators, the momentum suggests a bullish bias with RSI showing moderate strength and MACD confirming upward momentum.",
      summaryBearish: "Technical analysis indicates bearish pressure with RSI approaching oversold territory and MACD signaling potential downside continuation.",
      summaryNeutral: "The market is currently in consolidation. RSI sits in neutral territory while MACD shows minimal divergence, suggesting sideways movement.",
    },
    "zh-TW": {
      title: "AI 六合神器 或然率",
      subtitle: "認知參與練習",
      creditsLabel: "可用積分",
      reportsLabel: "已生成報告",
      tierLabel: "當前等級",
      generateButton: "生成報告",
      generating: "分析中...",
      regenerate: "生成新報告",
      backButton: "返回首頁",
      notLoggedIn: "請註冊或登入以生成報告",
      topUp: "充值",
      signUp: "註冊",
      noCreditsWarning: "您需要積分才能生成報告",
      summaryBullish: "根據當前技術指標，動能顯示看漲偏向，RSI 呈現適度強度，MACD 確認上升動能。",
      summaryBearish: "技術分析表明存在看跌壓力，RSI 接近超賣區域，MACD 信號可能繼續下行。",
      summaryNeutral: "市場目前處於整理階段。RSI 位於中性區域，MACD 顯示最小背離，暗示橫盤走勢。",
    },
    "zh-CN": {
      title: "AI 六合神器 或然率",
      subtitle: "认知参与练习",
      creditsLabel: "可用积分",
      reportsLabel: "已生成报告",
      tierLabel: "当前等级",
      generateButton: "生成报告",
      generating: "分析中...",
      regenerate: "生成新报告",
      backButton: "返回首页",
      notLoggedIn: "请注册或登录以生成报告",
      topUp: "充值",
      signUp: "注册",
      noCreditsWarning: "您需要积分才能生成报告",
      summaryBullish: "根据当前技术指标，动能显示看涨偏向，RSI 呈现适度强度，MACD 确认上升动能。",
      summaryBearish: "技术分析表明存在看跌压力，RSI 接近超卖区域，MACD 信号可能继续下行。",
      summaryNeutral: "市场目前处于整理阶段。RSI 位于中性区域，MACD 显示最小背离，暗示横盘走势。",
    },
  };

  const t = content[language] || content.en;

  // Fetch real stock data from edge function
  const fetchStockData = async (symbol: string, market: MarketType) => {
    const { data, error } = await supabase.functions.invoke('fetch-stock-data', {
      body: { symbol, market }
    });
    
    if (error) {
      console.error('Error fetching stock data:', error);
      throw new Error('Failed to fetch stock data');
    }
    
    return data;
  };

  // Build technicals from server-computed standardized indicators (RSI-14, MACD 12/26/9 daily).
  const generateTechnicalAnalysis = (stockData: any): ReportData => {
    const rsi = typeof stockData.rsi === "number" ? stockData.rsi : 50;
    const macd = typeof stockData.macd === "number" ? stockData.macd : 0;
    const macdSignal = typeof stockData.macdSignal === "number" ? stockData.macdSignal : 0;
    const macdHistogram = typeof stockData.macdHistogram === "number" ? stockData.macdHistogram : 0;

    // Deterministic direction + probability — no randomness, so both domains agree.
    let direction: "bullish" | "bearish" | "neutral";
    const rsiBias = (rsi - 50) / 50;
    const macdBias = Math.max(-1, Math.min(1, macdHistogram));
    const score = rsiBias * 0.6 + macdBias * 0.4; // -1..+1

    if (score > 0.15) direction = "bullish";
    else if (score < -0.15) direction = "bearish";
    else direction = "neutral";

    const probability = Math.round(50 + Math.abs(score) * 30); // 50..80

    const summaryMap = {
      bullish: t.summaryBullish,
      bearish: t.summaryBearish,
      neutral: t.summaryNeutral,
    };

    return {
      marketData: {
        symbol: stockData.symbol,
        price: stockData.price,
        change: stockData.change,
        changePercent: stockData.changePercent,
        volume: stockData.volume,
        high: stockData.high,
        low: stockData.low,
        companyName: stockData.companyName,
        exchange: stockData.exchange,
        currency: stockData.currency,
      },
      technicals: {
        rsi,
        macd,
        macdSignal,
        macdHistogram,
      },
      analysis: {
        probability,
        direction,
        summary: summaryMap[direction],
      },
    };
  };

  // Handle click on disabled button (no credits)
  const handleDisabledClick = () => {
    setShowOutOfCredits(true);
  };

  const handleSearch = async (symbol: string, market: MarketType) => {
    // Security check: Must have credits
    if (creditBalance === 0) {
      setShowOutOfCredits(true);
      return;
    }

    const canGenerate = await checkCanGenerate();
    if (!canGenerate.can_generate) {
      setShowOutOfCredits(true);
      return;
    }

    setIsGenerating(true);
    setSearchedSymbol(symbol);
    setSearchedMarket(market);
    
    // Consume a credit first
    const success = await consumeCredit();
    
    if (success) {
      // Log the search anonymously for trending (no user_id — privacy)
      await supabase.from("ticker_searches").insert({
        symbol: symbol,
        market: market,
        user_id: null,
      });


      try {
        // Fetch real stock data from the edge function
        const stockData = await fetchStockData(symbol, market);
        
        // Generate the report with real data
        const data = generateTechnicalAnalysis(stockData);
        setReportData(data);
        setGeneratedAt(new Date());
      } catch (error) {
        console.error('Error generating report:', error);
        // Could add error handling UI here
      }
    }

    setIsGenerating(false);
  };

  const handleRegenerate = async () => {
    if (searchedSymbol) {
      await handleSearch(searchedSymbol, searchedMarket);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F172A' }}>
        <Loader2 className="w-12 h-12 text-[#C0C0C0] animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F172A' }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 pt-16">
          <div 
            className="max-w-md w-full p-8 rounded-lg"
            style={{ 
              backgroundColor: '#1E293B',
              border: '1px solid #C0C0C0'
            }}
          >
            <p className="text-[#C0C0C0] mb-6 text-center text-lg">{t.notLoggedIn}</p>
            <Button 
              onClick={() => setShowSignUpDialog(true)} 
              className="w-full py-3 bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black font-bold hover:opacity-90"
            >
              {t.signUp}
            </Button>
          </div>
        </div>
        <Footer />
        <SignUpDialog open={showSignUpDialog} onOpenChange={setShowSignUpDialog} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F172A' }}>
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-1 pt-16 pb-32">
        <div className="container mx-auto px-4 py-6">
          
          {/* Stats Bar - Sticky at top, Compact Horizontal Row */}
          <div className="sticky top-16 z-30 bg-[#0F172A]/95 backdrop-blur-sm py-3 -mx-4 px-4 mb-6 border-b border-[#334155]/50">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Credits Available with TOP-UP Button */}
              <div 
                className="flex items-center gap-3 px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: '#1E293B',
                  border: '1px solid #C0C0C0'
                }}
              >
                <span className="text-sm text-[#C0C0C0]">{t.creditsLabel}</span>
                <span className="text-xl font-bold text-white">{creditBalance}</span>
                
                {/* TOP-UP Button - Sharp Green with Enhanced Glow when 0 credits */}
                <Button
                  onClick={() => navigate("/pricing")}
                  className={`ml-3 px-7 py-3 h-auto text-lg font-black tracking-wide ${
                    creditBalance === 0 ? 'animate-urgent-glow' : 'animate-glow-pulse'
                  }`}
                  style={{
                    backgroundColor: '#22C55E',
                    color: '#000000',
                  }}
                >
                  <Zap className="w-6 h-6 mr-2" />
                  {t.topUp}
                </Button>
              </div>

              {/* Reports Generated */}
              <div 
                className="flex items-center gap-3 px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: '#1E293B',
                  border: '1px solid #C0C0C0'
                }}
              >
                <span className="text-sm text-[#C0C0C0]">{t.reportsLabel}</span>
                <span className="text-xl font-bold text-white">{totalReportsGenerated}</span>
              </div>

              {/* Current Tier - Gold Accent */}
              <div 
                className="flex items-center gap-3 px-4 py-2 rounded-lg"
                style={{ 
                  backgroundColor: '#1E293B',
                  border: '1px solid #C0C0C0'
                }}
              >
                <span className="text-sm text-[#C0C0C0]">{t.tierLabel}</span>
                <span className="text-xl font-bold capitalize" style={{ color: '#FFD700' }}>{tier}</span>
              </div>
            </div>
          </div>

          {/* Large Stock Analysis Area */}
          <div className="max-w-4xl mx-auto">
            {reportData ? (
              <div className="space-y-6">
                <AIReportCard 
                  data={reportData} 
                  loading={isGenerating}
                  generatedAt={generatedAt || undefined}
                  market={searchedMarket}
                />

                {/* Search bar for new symbol */}
                <div 
                  className="p-4 rounded-lg"
                  style={{ 
                    backgroundColor: '#1E293B',
                    border: '1px solid #C0C0C0'
                  }}
                >
                  <StockSearchBar 
                    onSearch={handleSearch}
                    isLoading={isGenerating}
                    disabled={creditBalance === 0}
                    onDisabledClick={handleDisabledClick}
                    initialValue=""
                  />
                </div>

                {/* Regenerate button */}
                <div className="flex justify-center">
                  <Button
                    onClick={() => {
                      if (creditBalance === 0) {
                        handleDisabledClick();
                      } else {
                        handleRegenerate();
                      }
                    }}
                    disabled={isGenerating}
                    className={`px-8 py-3 font-bold transition-opacity ${
                      creditBalance === 0
                        ? 'bg-gray-600 text-gray-400 cursor-pointer opacity-70'
                        : 'bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black hover:opacity-90'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t.generating}
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2" />
                        {t.regenerate} ({searchedSymbol})
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              /* Initial state - Investment Cockpit */
              <div 
                className="p-8 rounded-xl"
                style={{ 
                  backgroundColor: '#1E293B',
                  border: '1px solid #C0C0C0'
                }}
              >
                {/* Title Section */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#FFD700' }}>
                    {t.title}
                  </h1>
                  <p className="text-[#C0C0C0] text-lg">{t.subtitle}</p>
                </div>

                {/* No credits warning */}
                {creditBalance === 0 && (
                  <div 
                    className="p-4 rounded-lg text-center mb-6"
                    style={{ 
                      backgroundColor: 'rgba(220, 38, 38, 0.15)',
                      border: '1px solid rgba(220, 38, 38, 0.5)'
                    }}
                  >
                    <p className="text-red-400 font-medium">{t.noCreditsWarning}</p>
                  </div>
                )}

                {/* Stock Search Bar - The Centerpiece */}
                <div className="mb-8">
                  <StockSearchBar 
                    onSearch={handleSearch}
                    isLoading={isGenerating}
                    disabled={creditBalance === 0}
                    onDisabledClick={handleDisabledClick}
                    initialValue={initialSymbol}
                  />
                </div>

                {/* Brief Disclaimer */}
                <div 
                  className="p-4 rounded-lg"
                  style={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(192, 192, 192, 0.3)'
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4 text-[#C0C0C0]" />
                    <span className="text-sm font-semibold text-white">About This Tool / 關於此工具 / 关于此工具</span>
                  </div>
                  
                  <p className="text-sm text-[#C0C0C0] leading-relaxed">
                    This AI tool uses mathematical models (RSI, MACD) to create probability simulations for educational "Mental Gym" purposes. See the persistent disclaimer below for full safety information.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sticky Footer Disclaimer - Always Visible */}
      <StickyDisclaimer />

      {/* Standard Site Footer */}
      <Footer />

      {/* Credits Depleted Popup */}
      <CreditsDepletedPopup
        open={showOutOfCredits}
        onOpenChange={setShowOutOfCredits}
      />
    </div>
  );
}
