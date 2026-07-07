import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { VoiceInput } from "@/components/voice/VoiceInput";
import { ReadAloudButton } from "@/components/voice/ReadAloudButton";
import { AudioControls } from "@/components/voice/AudioControls";
import { GatewaySelector } from "@/components/ai/GatewaySelector";
import { QuickAddButton } from "@/components/stocks/QuickAddButton";
import { useAIGateway } from "@/contexts/AIGatewayContext";
import { detectStock } from "@/lib/stockDetector";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InlineLanguageSwitcher from "@/components/InlineLanguageSwitcher";
import MobileMark6Footer from "@/components/MobileMark6Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, AlertTriangle, Check, X, Star, Zap, Volume2 } from "lucide-react";
import yearOfHorseImg from "@/assets/year-of-horse.png";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "@/hooks/useCredits";
import { OutOfCreditsPopup } from "@/components/OutOfCreditsPopup";
import SignUpDialog from "@/components/SignUpDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type MarketType = "US" | "HK" | "TW";

const translations = {
  en: {
    pageTitle: "AI Stock Analysis",
    placeholder: "Enter Stock Symbol...",
    analyze: "Analyze",
    examples: "Examples:",
    exampleText: "NVDA, 0700.HK, 2330.TW",
    awaitingInput: "Enter a stock symbol above and click Analyze to view AI predictions",
    invalidSymbol: "Invalid stock symbol. Please go back and enter a correct symbol.",
    disclaimerTitle: "Disclaimer",
    disclaimerText: "Notice: This AI Probability Analysis is for educational and 'Mental Gym' purposes only. It uses mathematical models (RSI, MACD) to summarize market data. It does not constitute financial advice or a recommendation to buy or sell any security. All trading involves risk; please exercise your 'Principle of Self-Decision' and consult a licensed professional before making any investment.",
    acceptContinue: "Accept & Continue",
    cancel: "Cancel",
    fetchError: "Failed to fetch stock data. Please check the symbol and try again.",
    goToWatchlist: "Go to My Watchlist",
    pleaseSignIn: "Please sign in to continue with your analysis.",
    outOfCredits: "You have run out of credits. Please add more to continue.",
    welcomeMessage: "Welcome to DragonGP AI Stock Analysis. Please enter a stock symbol to begin.",
  },
  "zh-TW": {
    pageTitle: "AI 股票分析",
    placeholder: "輸入股票代碼...",
    analyze: "開始分析",
    examples: "例如：",
    exampleText: "NVDA, 0700.HK, 2330.TW",
    awaitingInput: "請在上方輸入股票代碼並點擊「開始分析」查看 AI 預測",
    invalidSymbol: "無效的股票代碼。請返回並輸入正確的代碼。",
    disclaimerTitle: "免責聲明",
    disclaimerText: "聲明：此 AI 概率分析僅供教育及「心靈體操」之用。本系統利用數學模型（RSI、MACD）對市場數據進行匯總，並不構成任何財務建議或買賣證券的推薦。所有交易均存在風險；請踐行您的「自主決策原則」，並在做出任何投資決定前諮詢專業持牌顧問。",
    acceptContinue: "接受並繼續",
    cancel: "取消",
    fetchError: "無法獲取股票數據。請檢查代碼並重試。",
    goToWatchlist: "查看我的自選股",
    pleaseSignIn: "請登入以繼續您的分析。",
    outOfCredits: "您的點數已用完。請加值以繼續。",
    welcomeMessage: "歡迎來到 DragonGP AI 股票分析。請輸入股票代碼開始。",
  },
  "zh-CN": {
    pageTitle: "AI 股票分析",
    placeholder: "输入股票代码...",
    analyze: "开始分析",
    examples: "例如：",
    exampleText: "NVDA, 0700.HK, 2330.TW",
    awaitingInput: "请在上方输入股票代码并点击「开始分析」查看 AI 预测",
    invalidSymbol: "无效的股票代码。请返回并输入正确的代码。",
    disclaimerTitle: "免责声明",
    disclaimerText: "声明：此 AI 概率分析仅供教育及「心灵体操」之用。本系统利用数学模型（RSI、MACD）对市场数据进行汇总，并不构成任何财务建议或买卖证券的推荐。所有交易均存在风险；请践行您的「自主决策原则」，并在做出任何投资决定前咨询专业持牌顾问。",
    acceptContinue: "接受并继续",
    cancel: "取消",
    fetchError: "无法获取股票数据。请检查代码并重试。",
    goToWatchlist: "查看我的自选股",
    pleaseSignIn: "请登录以继续您的分析。",
    outOfCredits: "您的点数已用完。请充值以继续。",
    welcomeMessage: "欢迎来到 DragonGP AI 股票分析。请输入股票代码开始。",
  },
};

// Auto-detect market from symbol
function detectMarket(symbol: string): MarketType {
  const trimmed = symbol.trim().toUpperCase();
  if (trimmed.endsWith(".HK")) return "HK";
  if (trimmed.endsWith(".TW")) return "TW";
  return "US";
}

// Validate stock symbol
function validateSymbol(symbol: string): boolean {
  const trimmed = symbol.trim();
  if (!trimmed || trimmed.length < 1) return false;
  
  if (/^[A-Za-z]{1,5}$/.test(trimmed)) return true;
  if (/^[0-9]{4}\.HK$/i.test(trimmed)) return true;
  if (/^[0-9]{4}\.TW$/i.test(trimmed)) return true;
  if (/^[0-9]{4}$/.test(trimmed)) return true;
  return false;
}

// Normalize symbol for Yahoo Finance API
function normalizeSymbol(symbol: string): { symbol: string; market: MarketType } {
  const trimmed = symbol.trim().toUpperCase();
  
  if (trimmed.endsWith(".HK")) {
    return { symbol: trimmed, market: "HK" };
  }
  if (trimmed.endsWith(".TW")) {
    return { symbol: trimmed, market: "TW" };
  }
  if (/^[0-9]{4}$/.test(trimmed)) {
    return { symbol: `${trimmed}.HK`, market: "HK" };
  }
  return { symbol: trimmed, market: "US" };
}

export default function AIStocks() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { creditBalance, loading: creditsLoading, consumeCredit, fetchProfile } = useCredits();
  const { currentGateway } = useAIGateway();
  const t = translations[language] || translations.en;
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [pendingSymbol, setPendingSymbol] = useState("");
  const [pendingMarket, setPendingMarket] = useState<MarketType>("US");
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [showOutOfCreditsPopup, setShowOutOfCreditsPopup] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);

  // Speak welcome message
 const [isSpeaking, setIsSpeaking] = useState(false);
const speakWelcome = () => {
  // Prevent multiple simultaneous speech
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    return;
  }

  const lang = language === 'zh-TW' ? 'zh' : language === 'zh-CN' ? 'zh' : 'en';
  const isChinese = lang === 'zh';
  
  const text = isChinese 
    ? '歡迎來到 DragonGP AI 股票分析平台。請在上方輸入股票代碼，例如 NVDA、TSLA、0700.HK 或 2330.TW，然後點擊開始分析按鈕，即可獲得 AI 驅動的技術分析和預測。'
    : 'Welcome to DragonGP AI Stock Analysis Platform. Please enter a stock symbol above, such as NVDA, TSLA, 0700.HK, or 2330.TW, then click the Analyze button to get AI-powered technical analysis and predictions.';
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'zh-TW' ? 'zh-HK' : language === 'zh-CN' ? 'zh-CN' : 'en-US';
  utterance.rate = 0.85;
  utterance.pitch = 1;
  
  utterance.onstart = () => setIsSpeaking(true);
  utterance.onend = () => setIsSpeaking(false);
  utterance.onerror = () => setIsSpeaking(false);
  
  window.speechSynthesis.speak(utterance);
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const rawSymbol = inputValue.trim().toUpperCase();
    
    if (!validateSymbol(rawSymbol)) {
      setErrorMessage(t.invalidSymbol);
      setShowError(true);
      return;
    }

    const { symbol: normalizedSymbol, market } = normalizeSymbol(rawSymbol);

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      localStorage.setItem("pending_stock_symbol", normalizedSymbol);
      localStorage.setItem("pending_stock_market", market);
      setShowSignUpDialog(true);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("credit_balance")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      setErrorMessage(t.fetchError);
      setShowError(true);
      return;
    }

    if (!profileData || profileData.credit_balance <= 0) {
      setShowOutOfCreditsPopup(true);
      return;
    }

    setPendingSymbol(normalizedSymbol);
    setPendingMarket(market);
    setShowDisclaimer(true);
  };

  const handleAcceptDisclaimer = async () => {
    setShowDisclaimer(false);
    setIsLoading(true);
    
    try {
      const creditSuccess = await consumeCredit();
      if (!creditSuccess) {
        setShowOutOfCreditsPopup(true);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("fetch-stock-data", {
        body: { symbol: pendingSymbol, market: pendingMarket },
      });

      if (error || data?.error) {
        console.error("Error fetching stock data:", error || data?.error);
        setErrorMessage(t.fetchError);
        setShowError(true);
        setIsLoading(false);
        return;
      }

      const basePrice = data.price;
      const rsi = typeof data.rsi === "number" ? data.rsi : 50;
      const macd = typeof data.macd === "number" ? data.macd : 0;
      const macdSignal = typeof data.macdSignal === "number" ? data.macdSignal : 0;
      const macdHistogram = typeof data.macdHistogram === "number" ? data.macdHistogram : 0;

      const rsiBias = (rsi - 50) / 50;
      const macdBias = Math.max(-1, Math.min(1, macdHistogram));
      const directionScore = rsiBias * 0.6 + macdBias * 0.4;
      const prob = Math.round(50 + directionScore * 30);
      const buyPct = Math.max(20, Math.min(80, Math.round(50 + directionScore * 25)));
      const sellPct = Math.max(10, Math.min(70, Math.round(50 - directionScore * 25)));
      const holdPct = Math.max(0, 100 - buyPct - sellPct);

      const reportData = {
        ticker: data.symbol,
        name: data.companyName,
        price: data.price,
        change: data.changePercent,
        rsi,
        macd,
        macdSignal,
        macdHistogram,
        probability: prob,
        highTarget: parseFloat((basePrice * 1.15).toFixed(2)),
        lowTarget: parseFloat((basePrice * 0.88).toFixed(2)),
        high52Week: parseFloat((basePrice * 1.35).toFixed(2)),
        low52Week: parseFloat((basePrice * 0.65).toFixed(2)),
        volume: data.volume,
        buyPercent: buyPct,
        holdPercent: holdPct,
        sellPercent: sellPct,
        aiSummary: "",
        currency: data.currency,
        market: pendingMarket,
        dayHigh: data.dayHigh || data.high,
        dayLow: data.dayLow || data.low,
        previousClose: data.previousClose || (data.price - data.change),
        companyDescription: data.longBusinessSummary || null,
        sector: data.sector || null,
        industry: data.industry || null,
        marketCap: data.marketCap || null,
        dividendYield: data.dividendYield,
        forwardDividendRate: data.forwardDividendRate || null,
        forwardDividendYield: data.forwardDividendYield || null,
        declaredDividendPerShare: data.declaredDividendPerShare || null,
        exDividendDate: data.exDividendDate || null,
        trailingPE: data.trailingPE,
      };

      setIsLoading(false);
      const summaryText = `${data.companyName || data.symbol} 分析完成。價格: ${data.price} ${data.currency || 'USD'}，RSI: ${rsi.toFixed(1)}，MACD: ${macd.toFixed(2)}，AI預測概率: ${prob}%。${buyPct}% 買入，${holdPct}% 持有，${sellPct}% 賣出。`;
      setAnalysisResult(summaryText);
      setIsAnalysisComplete(true);
      navigate("/report", { state: { reportData } });
    } catch (err) {
      console.error("Error:", err);
      setErrorMessage(t.fetchError);
      setShowError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden max-w-[100vw] overflow-x-hidden pb-16 md:pb-0 bg-background">
      <Navbar />
      
      <AlertDialog open={showError} onOpenChange={setShowError}>
        <AlertDialogContent className="glass border-destructive/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              {t.invalidSymbol.split('.')[0]}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[1.1rem] text-muted-foreground">
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowError(false)}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <OutOfCreditsPopup
        open={showOutOfCreditsPopup}
        onOpenChange={setShowOutOfCreditsPopup}
        onBuyCoffee={() => {
          setShowOutOfCreditsPopup(false);
          navigate("/pricing");
        }}
        onViewPlans={() => {
          setShowOutOfCreditsPopup(false);
          navigate("/pricing");
        }}
      />

      <AlertDialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <AlertDialogContent className="glass gold-border max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary text-xl flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              {t.disclaimerTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[1.05rem] text-muted-foreground leading-relaxed">
              {t.disclaimerText}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="bg-muted text-foreground hover:bg-muted/80 border-none">
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAcceptDisclaimer}
              className="bg-gradient-gold text-navy font-bold hover:opacity-90"
            >
              <Check className="w-4 h-4 mr-2" />
              {t.acceptContinue}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <main className="flex-1 pt-16 pb-2 px-4 overflow-hidden flex flex-col">
        <div className="text-center mb-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-gold font-display">
            {t.pageTitle}
          </h1>
        </div>

        <div className="flex items-start justify-center gap-4 md:gap-6 mb-4 max-w-3xl mx-auto w-full">
          <div className="flex-shrink-0">
            <img
              src={yearOfHorseImg}
              alt="Year of Horse Brings Fortune"
              className="w-24 h-32 md:w-32 md:h-44 object-cover rounded-xl gold-border shadow-gold"
            />
          </div>

          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex justify-start px-2 py-1 rounded-lg w-fit" style={{ border: '2px solid #DC2626' }}>
              <InlineLanguageSwitcher />
            </div>

            <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl glass w-fit" style={{ border: '2px solid #DC2626' }}>
              <span className="text-xs font-bold" style={{ color: '#D4AF37' }}>
                {language === "zh-TW" ? "積分" : language === "zh-CN" ? "积分" : "Credits"}
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: '#D4AF37', textShadow: '0 0 8px rgba(212,175,55,0.6)' }}
              >
                {creditBalance}
              </span>
              <Button
                onClick={() => navigate("/pricing")}
                size="sm"
                className="font-bold text-xs py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Zap className="w-3 h-3 mr-1" />
                {language === "zh-TW" ? "充值" : language === "zh-CN" ? "充值" : "TOP-UP"}
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto w-full mb-4 max-w-[100vw] overflow-x-hidden">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-3">
            <div className="relative w-full">
              <Search className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-5 h-5 md:w-8 md:h-8 z-10 pointer-events-none" style={{ color: '#D4AF37' }} />
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t.placeholder}
                className="w-full pl-10 md:pl-16 pr-12 md:pr-16 h-[50px] md:h-[70px] text-[16px] md:text-[1.8rem] font-bold bg-card rounded-xl uppercase text-foreground placeholder:italic placeholder:text-black placeholder:font-normal placeholder:text-[0.8rem] md:placeholder:text-base focus:ring-0 focus:outline-none"
                style={{
                  caretColor: '#D4AF37',
                  textTransform: 'uppercase',
                  fontSize: '16px',
                  lineHeight: 'normal',
                  border: '3px solid #D4AF37',
                  boxShadow: '0 0 0 1px rgba(212,175,55,0.3)',
                  fontStyle: 'normal',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 12px 2px rgba(212,175,55,0.4)';
                  e.currentTarget.style.backgroundColor = '#FFFDF5';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 1px rgba(212,175,55,0.3)';
                  e.currentTarget.style.backgroundColor = '';
                }}
                disabled={isLoading}
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={() => setInputValue("")}
                  className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-6 h-6 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 transition-colors z-20"
                >
                  <X className="w-3.5 h-3.5 md:w-5 md:h-5 text-destructive" />
                </button>
              )}
            </div>
          </form>

          {/* Control Row - Voice Input, Speaker, Gateway, Quick Add */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <VoiceInput 
              onResult={(text) => {
                setInputValue(text);
                const symbol = detectStock(text);
                if (symbol && symbol !== text.toUpperCase()) {
                  setInputValue(symbol);
                  setTimeout(() => {
                    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                    handleSubmit(fakeEvent);
                  }, 300);
                }
              }}
              onStockDetected={(symbol) => {
                setInputValue(symbol);
                setTimeout(() => {
                  const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                  handleSubmit(fakeEvent);
                }, 300);
              }}
              className="h-10 w-10"
              lang={language === 'zh-TW' ? 'zh-HK' : language === 'zh-CN' ? 'zh-CN' : 'en-US'}
            />
            
            {/* Speaker Button - Always visible */}
            {/* Speaker Button - Toggle on/off */}
<Button
  variant="outline"
  size="icon"
  className="h-10 w-10"
  onClick={() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakWelcome();
    }
  }}
  title={isSpeaking ? "Stop speaking" : "Read welcome message"}
>
  {isSpeaking ? (
    <VolumeX className="h-4 w-4 text-red-500" />
  ) : (
    <Volume2 className="h-4 w-4" />
  )}
</Button>
            
            <GatewaySelector variant="minimal" />
            <QuickAddButton className="h-10" />
            
            {analysisResult && (
              <>
                <ReadAloudButton 
                  text={analysisResult} 
                  className="h-10"
                  lang={language === 'zh-TW' ? 'zh-HK' : language === 'zh-CN' ? 'zh-CN' : 'en-US'}
                />
                <AudioControls 
                  text={analysisResult} 
                  className="ml-1"
                  lang={language === 'zh-TW' ? 'zh-HK' : language === 'zh-CN' ? 'zh-CN' : 'en-US'}
                />
              </>
            )}
          </div>

          <p className="text-center text-[1rem] md:text-[1.2rem] font-bold text-destructive mb-2">
            {t.awaitingInput}
          </p>

          <p className="text-center text-[1rem] md:text-[1.15rem] text-muted-foreground mb-4">
            <span className="text-primary font-semibold">{t.examples}</span> {t.exampleText}
          </p>

          <div className="flex flex-col items-center gap-3">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !inputValue.trim()}
              className={`w-full max-w-xs h-[50px] md:h-[60px] px-8 text-[1.1rem] md:text-[1.4rem] font-bold rounded-xl shadow-lg bg-gradient-gold text-navy hover:opacity-90 transition-all ${
                inputValue.trim()
                  ? 'animate-pulse shadow-gold ring-2 ring-primary/50'
                  : 'shadow-gold/20'
              }`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
              ) : (
                t.analyze
              )}
            </Button>

            <Link
              to="/watchlist"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 glass gold-border hover:bg-primary/10 text-primary text-[0.9rem] md:text-[1rem] font-medium rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Star className="w-4 h-4" />
              {t.goToWatchlist}
            </Link>
          </div>
        </div>

        <div className="flex-1"></div>
      </main>

      <Footer />
      <MobileMark6Footer />
      <SignUpDialog open={showSignUpDialog} onOpenChange={setShowSignUpDialog} redirectTo="/ai-stocks" />
    </div>
  );
}