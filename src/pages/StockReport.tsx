import { useEffect, useRef, useState } from "react";
import QuickFeedbackPopup, { useReportViewTracker } from "@/components/QuickFeedbackPopup";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HorseLogoSVG from "@/components/report/HorseLogoSVG";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RSIGauge } from "@/components/report/RSIGauge";
import { MACDIndicator } from "@/components/report/MACDIndicator";
import { EnhancedAIAnalysis } from "@/components/report/EnhancedAIAnalysis";
import { ReportHeader } from "@/components/report/ReportHeader";
import { ReportFooter } from "@/components/report/ReportFooter";
import { ExecutiveThesis } from "@/components/report/ExecutiveThesis";
import { FinancialMultiplesGrid } from "@/components/report/FinancialMultiplesGrid";
import { SectorContext } from "@/components/report/SectorContext";
import { InvestmentRiskDisclosure } from "@/components/report/InvestmentRiskDisclosure";
import { PeerComparisonTable } from "@/components/report/PeerComparisonTable";
import { BullBearSummaryBox } from "@/components/report/BullBearSummaryBox";
import { RecommendationSidebar } from "@/components/report/RecommendationSidebar";
import { BullBearScenario } from "@/components/report/BullBearScenario";
import { PricePerformanceChart } from "@/components/report/PricePerformanceChart";
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Image, 
  AlertTriangle, 
  ChevronDown, 
  Heart, 
  ArrowRight, 
  FileDown, 
  Sparkles,
  Volume2,
  Play,
  Pause,
  Square
} from "lucide-react";
import { WhatsAppShareButton } from "@/components/WhatsAppShareButton";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useSpeech } from "@/hooks/useSpeech";
import { FacebookShareButton } from "@/components/FacebookShareButton";

interface ReportData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  rsi: number;
  macd: number;
  macdSignal: number;
  macdHistogram: number;
  probability: number;
  highTarget: number;
  lowTarget: number;
  high52Week: number;
  low52Week: number;
  volume: string;
  buyPercent: number;
  holdPercent: number;
  sellPercent: number;
  aiSummary: string;
  currency: string;
  market: string;
  dayHigh?: number;
  dayLow?: number;
  previousClose?: number;
  companyDescription?: string;
  sector?: string | null;
  industry?: string | null;
  marketCap?: number | null;
  dividendYield?: number | null;
  forwardDividendRate?: number | null;
  forwardDividendYield?: number | null;
  declaredDividendPerShare?: number | null;
  exDividendDate?: string | null;
  trailingPE?: number | null;
}

const translations = {
  en: {
    pageTitle: "AI Stock Analysis Report",
    selectAnother: "Select Another Stock",
    printPDF: "Print",
    savePDF: "Download PDF",
    saveImage: "Save as Image",
    printNotSupported: "Printing is not supported in this browser. Please use the 'Save as Image' button or try a different browser.",
    generatingPDF: "Generating PDF...",
    pdfGenerated: "PDF downloaded successfully!",
    pdfFailed: "Failed to generate PDF. Please try 'Save as Image' instead.",
    livePrice: "Live Price",
    high52Week: "52-Week High",
    low52Week: "52-Week Low",
    volume: "Volume",
    technicalIndicators: "Technical Indicators",
    aiProbabilityPricing: "AI Probability Pricing",
    decisionMatrix: "Decision Matrix",
    aiRecommendation: "AI Recommendation",
    buyTarget: "Buy Target",
    sellTarget: "Sell Target",
    buy: "Buy",
    hold: "Hold",
    sell: "Sell",
    disclaimer: "Notice: This AI Probability Analysis is for educational and 'Mental Gym' purposes only. It uses mathematical models (RSI, MACD) to summarize market data. It does not constitute financial advice or a recommendation to buy or sell any security. All trading involves risk; please exercise your 'Principle of Self-Decision' and consult a licensed professional before making any investment.",
    goToMark6: "Go to AI Mark6 Probability Game Now",
    shareWhatsApp: "Check out this AI Stock Analysis from DragonGp.Ai! Try it here:",
    marketData: "Market Data",
    bullishMomentum: "Strong bullish momentum detected based on mathematical models.",
    oversoldConditions: "Market shows oversold conditions, indicating potential rebound opportunity.",
    neutralTrend: "Neutral trend observed; caution advised.",
    scrollDown: "Scroll Down for Full Report / 向下移動查看完整報告",
    aiAnalysisLogic: "AI Analysis Logic",
    rsiExplanation: "Measures if the stock is overextended (overbought/oversold).",
    macdExplanation: "Measures the strength and direction of the current trend.",
    saveToWatchlist: "Save to Watchlist",
    savedToWatchlist: "Saved to Watchlist!",
    aiLogicBuy: "The AI recommends BUY because RSI indicates the stock is currently undervalued and showing bullish momentum.",
    aiLogicSell: "The AI recommends SELL because RSI indicates the stock is overbought and may face downward pressure.",
    aiLogicHold: "The AI recommends HOLD as indicators show neutral conditions; wait for clearer signals.",
    watchlistCTA: "Want to add to your Watch List? (Max 10)",
    watchlistFull: "Watch List full. Please remove a stock first.",
    marketDepth: "Market Depth",
    bid: "Bid",
    ask: "Ask",
    dayRange: "Day Range",
    prevClose: "Prev. Close",
    marketOpen: "Market Open",
    marketClosed: "Market Closed",
    companyProfile: "Company Profile",
    noDividends: "No Dividends",
    readReport: "Read Report",
    speaking: "Speaking...",
    paused: "Paused",
    ready: "Ready",
    play: "Play",
    pauseCtrl: "Pause",
    stop: "Stop",
  },
  "zh-TW": {
    pageTitle: "AI 股票分析報告",
    selectAnother: "再查詢其他股票",
    printPDF: "列印",
    savePDF: "下載 PDF",
    saveImage: "儲存為圖片",
    printNotSupported: "此瀏覽器不支援列印功能。請使用「儲存為圖片」按鈕或嘗試其他瀏覽器。",
    generatingPDF: "正在生成 PDF...",
    pdfGenerated: "PDF 下載成功！",
    pdfFailed: "PDF 生成失敗，請改用「儲存為圖片」。",
    livePrice: "即時價格",
    high52Week: "52週高點",
    low52Week: "52週低點",
    volume: "成交量",
    technicalIndicators: "技術指標",
    aiProbabilityPricing: "AI 概率定價",
    decisionMatrix: "決策矩陣",
    aiRecommendation: "AI 建議",
    buyTarget: "買入目標",
    sellTarget: "賣出目標",
    buy: "買入",
    hold: "持有",
    sell: "賣出",
    disclaimer: "聲明：此 AI 概率分析僅供教育及「心靈體操」之用。本系統利用數學模型（RSI、MACD）對市場數據進行匯總，並不構成任何財務建議或買賣證券的推薦。所有交易均存在風險；請踐行您的「自主決策原則」，並在做出任何投資決定前諮詢專業持牌顧問。",
    goToMark6: "立即前往 AI 六合彩概率遊戲",
    shareWhatsApp: "看看 DragonGp.Ai 的 AI 股票分析！在這裡試試:",
    marketData: "市場數據",
    bullishMomentum: "根據數學模型偵測到強勁的看漲勢頭。",
    oversoldConditions: "市場顯示超賣狀態，具備反彈潛力。",
    neutralTrend: "趨勢中性；建議謹慎觀察。",
    scrollDown: "向下滾動查看完整報告 / Scroll Down for Full Report",
    aiAnalysisLogic: "AI 分析邏輯",
    rsiExplanation: "衡量股票是否超買或超賣。",
    macdExplanation: "衡量當前趨勢的強度與方向。",
    saveToWatchlist: "加入自選股",
    savedToWatchlist: "已加入自選股！",
    aiLogicBuy: "AI 建議買入，因 RSI 顯示該股目前被低估且呈現看漲動能。",
    aiLogicSell: "AI 建議賣出，因 RSI 顯示該股超買，可能面臨下行壓力。",
    aiLogicHold: "AI 建議持有，指標顯示中性狀態；等待更明確的信號。",
    watchlistCTA: "想加入您的自選股名單嗎？(最多10個)",
    watchlistFull: "自選股名單已滿，請先刪除一個。",
    marketDepth: "市場深度",
    bid: "買盤",
    ask: "賣盤",
    dayRange: "日內範圍",
    prevClose: "前收盤價",
    marketOpen: "交易中",
    marketClosed: "已收盤",
    companyProfile: "公司簡介",
    noDividends: "不派息",
    readReport: "朗讀報告",
    speaking: "朗讀中...",
    paused: "暫停",
    ready: "就緒",
    play: "播放",
    pauseCtrl: "暫停",
    stop: "停止",
  },
  "zh-CN": {
    pageTitle: "AI 股票分析报告",
    selectAnother: "再查询其他股票",
    printPDF: "打印",
    savePDF: "下载 PDF",
    saveImage: "保存为图片",
    printNotSupported: "此浏览器不支持打印功能。请使用「保存为图片」按钮或尝试其他浏览器。",
    generatingPDF: "正在生成 PDF...",
    pdfGenerated: "PDF 下载成功！",
    pdfFailed: "PDF 生成失败，请改用「保存为图片」。",
    livePrice: "实时价格",
    high52Week: "52周高点",
    low52Week: "52周低点",
    volume: "成交量",
    technicalIndicators: "技术指标",
    aiProbabilityPricing: "AI 概率定价",
    decisionMatrix: "决策矩阵",
    aiRecommendation: "AI 建议",
    buyTarget: "买入目标",
    sellTarget: "卖出目标",
    buy: "买入",
    hold: "持有",
    sell: "卖出",
    disclaimer: "声明：此 AI 概率分析仅供教育及「心灵体操」之用。本系统利用数学模型（RSI、MACD）对市场数据进行汇总，并不构成任何财务建议或买卖证券的推荐。所有交易均存在风险；请践行您的「自主决策原则」，并在做出任何投资决定前咨询专业持牌顾问。",
    goToMark6: "立即前往 AI 六合彩概率游戏",
    shareWhatsApp: "看看 DragonGp.Ai 的 AI 股票分析！在这里试试:",
    marketData: "市场数据",
    bullishMomentum: "根据数学模型侦测到强劲的看涨势头。",
    oversoldConditions: "市场显示超卖状态，具备反弹潜力。",
    neutralTrend: "趋势中性；建议谨慎观察。",
    scrollDown: "向下滚动查看完整报告 / Scroll Down for Full Report",
    aiAnalysisLogic: "AI 分析逻辑",
    rsiExplanation: "衡量股票是否超买或超卖。",
    macdExplanation: "衡量当前趋势的强度与方向。",
    saveToWatchlist: "加入自选股",
    savedToWatchlist: "已加入自选股！",
    aiLogicBuy: "AI 建议买入，因 RSI 显示该股目前被低估且呈现看涨动能。",
    aiLogicSell: "AI 建议卖出，因 RSI 显示该股超买，可能面临下行压力。",
    aiLogicHold: "AI 建议持有，指标显示中性状态；等待更明确的信号。",
    watchlistCTA: "想加入您的自选股名单吗？(最多10个)",
    watchlistFull: "自选股名单已满，请先删除一个。",
    marketDepth: "市场深度",
    bid: "买盘",
    ask: "卖盘",
    dayRange: "日内范围",
    prevClose: "前收盘价",
    marketOpen: "交易中",
    marketClosed: "已收盘",
    companyProfile: "公司简介",
    noDividends: "不派息",
    readReport: "朗读报告",
    speaking: "朗读中...",
    paused: "暂停",
    ready: "就绪",
    play: "播放",
    pauseCtrl: "暂停",
    stop: "停止",
  },
};

export default function StockReport() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { incrementViews, shouldShowFeedback } = useReportViewTracker();

  // Voice controls for report
  // Enhanced report text for TTS with all key details
const getReportText = () => {
  const data = reportData;
  if (!data) return '';
  
  const lang = language === 'zh-TW' ? 'zh' : language === 'zh-CN' ? 'zh' : 'en';
  const isChinese = lang === 'zh';
  
  // Determine RSI status
  let rsiStatus = '';
  let rsiInterpretation = '';
  if (data.rsi !== undefined) {
    if (data.rsi > 70) {
      rsiStatus = isChinese ? '超買' : 'Overbought';
      rsiInterpretation = isChinese ? '短期可能回調' : 'Potential pullback expected';
    } else if (data.rsi < 30) {
      rsiStatus = isChinese ? '超賣' : 'Oversold';
      rsiInterpretation = isChinese ? '可能出現反彈' : 'Potential rebound expected';
    } else {
      rsiStatus = isChinese ? '中性' : 'Neutral';
      rsiInterpretation = isChinese ? '動能平衡' : 'Balanced momentum';
    }
  }
  
  // Determine MACD status
  let macdStatus = '';
  let macdInterpretation = '';
  if (data.macd !== undefined) {
    if (data.macd > 0.5) {
      macdStatus = isChinese ? '看好' : 'Bullish';
      macdInterpretation = isChinese ? '多頭動能增強' : 'Bullish momentum increasing';
    } else if (data.macd < -0.5) {
      macdStatus = isChinese ? '看淡' : 'Bearish';
      macdInterpretation = isChinese ? '空頭動能增強' : 'Bearish momentum increasing';
    } else {
      macdStatus = isChinese ? '中性' : 'Neutral';
      macdInterpretation = isChinese ? '方向未明' : 'Direction unclear';
    }
  }
  
  // Determine overall recommendation
  let recommendation = '';
  let recommendationReason = '';
  if (data.rsi !== undefined && data.rsi < 30) {
    recommendation = isChinese ? '買入' : 'BUY';
    recommendationReason = isChinese ? '超賣區間，可考慮分批買入' : 'Oversold zone, consider accumulating';
  } else if (data.rsi !== undefined && data.rsi > 70) {
    recommendation = isChinese ? '賣出' : 'SELL';
    recommendationReason = isChinese ? '超買區間，可考慮分批獲利' : 'Overbought zone, consider taking profits';
  } else if (data.buyPercent > 55) {
    recommendation = isChinese ? '買入' : 'BUY';
    recommendationReason = isChinese ? 'AI模型看好，買入信號較強' : 'AI model favors upside';
  } else if (data.sellPercent > 55) {
    recommendation = isChinese ? '賣出' : 'SELL';
    recommendationReason = isChinese ? 'AI模型看淡，賣出信號較強' : 'AI model favors downside';
  } else {
    recommendation = isChinese ? '持有' : 'HOLD';
    recommendationReason = isChinese ? '中性信號，等待更明確方向' : 'Neutral signals, wait for clarity';
  }
  
  // Build the detailed report text
  const parts = [];
  
  // 1. Company and ticker
  parts.push(`${data.name || data.ticker} (${data.ticker})`);
  
  // 2. Price and change
  const changeText = data.change !== undefined ? (data.change > 0 ? `上漲 ${data.change.toFixed(2)}%` : `下跌 ${Math.abs(data.change).toFixed(2)}%`) : '';
  parts.push(`${isChinese ? '目前股價' : 'Current price'} ${data.currency || '$'}${data.price?.toFixed(2) || 'N/A'}，${changeText}`);
  
  // 3. RSI
  if (data.rsi !== undefined) {
    parts.push(`${isChinese ? 'RSI指標' : 'RSI'} ${data.rsi.toFixed(1)}，${rsiStatus}，${rsiInterpretation}`);
  }
  
  // 4. MACD
  if (data.macd !== undefined) {
    parts.push(`${isChinese ? 'MACD指標' : 'MACD'} ${macdStatus}，${macdInterpretation}`);
  }
  
  // 5. AI Probability
  if (data.probability !== undefined) {
    parts.push(`${isChinese ? 'AI預測概率' : 'AI Probability'} ${data.probability}%`);
  }
  
  // 6. Buy/Hold/Sell breakdown
  if (data.buyPercent !== undefined && data.holdPercent !== undefined && data.sellPercent !== undefined) {
    parts.push(`${isChinese ? '買入' : 'Buy'} ${data.buyPercent}%，${isChinese ? '持有' : 'Hold'} ${data.holdPercent}%，${isChinese ? '賣出' : 'Sell'} ${data.sellPercent}%`);
  }
  
  // 7. Targets
  if (data.highTarget !== undefined && data.lowTarget !== undefined) {
    parts.push(`${isChinese ? '目標價' : 'Target price'} ${data.currency || '$'}${data.highTarget?.toFixed(2) || 'N/A'}，${isChinese ? '止蝕位' : 'Stop loss'} ${data.currency || '$'}${data.lowTarget?.toFixed(2) || 'N/A'}`);
  }
  
  // 8. Recommendation
  parts.push(`${isChinese ? 'AI建議' : 'AI Recommendation'} ${recommendation}，${recommendationReason}`);
  
  // 9. 52-Week range
  if (data.high52Week !== undefined && data.low52Week !== undefined) {
    parts.push(`${isChinese ? '52週區間' : '52-week range'} ${data.currency || '$'}${data.low52Week?.toFixed(2) || 'N/A'} - ${data.currency || '$'}${data.high52Week?.toFixed(2) || 'N/A'}`);
  }
  
  // 10. Volume
  if (data.volume !== undefined) {
    parts.push(`${isChinese ? '成交量' : 'Volume'} ${data.volume || 'N/A'}`);
  }
  
  // 11. Market status
  const isMarketOpen = getMarketStatus();
  parts.push(isMarketOpen ? (isChinese ? '市場交易中' : 'Market Open') : (isChinese ? '市場已收盤' : 'Market Closed'));
  
  // 12. Final disclaimer
  parts.push(isChinese ? '此分析僅供參考，不構成投資建議' : 'This analysis is for reference only, not investment advice');
  
  return parts.join('。 ');
};

  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported } = useSpeech({
    lang: language === 'zh-TW' ? 'zh-HK' : language === 'zh-CN' ? 'zh-CN' : 'en-US',
  });

  // Check watchlist status when reportData loads
  useEffect(() => {
    if (reportData) {
      setInWatchlist(isInWatchlist(reportData.ticker));
    }
  }, [reportData, isInWatchlist]);

  useEffect(() => {
    // Get data from navigation state
    const data = location.state?.reportData;
    if (data) {
      setReportData(data);
      // Track report view and trigger feedback if needed
      incrementViews();
      setTimeout(() => {
        if (shouldShowFeedback()) {
          setShowFeedback(true);
        }
      }, 3000);
    } else {
      // If no data, redirect back
      navigate("/ai-stocks");
    }
  }, [location.state, navigate]);

  // Check if scrollable and show/hide scroll hint
  useEffect(() => {
    const checkScroll = () => {
      if (mainRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = mainRef.current;
        const isScrollable = scrollHeight > clientHeight;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
        setShowScrollHint(isScrollable && !isAtBottom);
      }
    };

    checkScroll();
    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      if (mainElement) {
        mainElement.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, [reportData]);

  const handlePrint = () => {
    if (typeof window.print !== "function") {
      toast.error(t.printNotSupported, { duration: 5000 });
      return;
    }
    
    try {
      window.print();
    } catch (error) {
      console.error("Print failed:", error);
      toast.error(t.printNotSupported, { duration: 5000 });
    }
  };

  const handleSavePDF = async () => {
    if (!reportRef.current) return;

    const loadingToast = toast.loading(t.generatingPDF);

    try {
      const element = reportRef.current;

      const buttonsToHide = element.querySelectorAll<HTMLElement>('button, .print\\:hidden');
      const hiddenEls: { el: HTMLElement; display: string }[] = [];
      buttonsToHide.forEach((el) => {
        hiddenEls.push({ el, display: el.style.display });
        el.style.display = 'none';
      });

      await new Promise((r) => setTimeout(r, 300));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      hiddenEls.forEach(({ el, display }) => {
        el.style.display = display;
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 5;
      const usableWidth = pageWidth - margin * 2;
      const imgAspect = canvas.height / canvas.width;
      const imgHeightInMM = usableWidth * imgAspect;

      if (imgHeightInMM <= pageHeight - margin * 2) {
        pdf.addImage(imgData, 'JPEG', margin, margin, usableWidth, imgHeightInMM);
      } else {
        const pxPerPage = ((pageHeight - margin * 2) / imgHeightInMM) * canvas.height;
        let yOffset = 0;
        let page = 0;

        while (yOffset < canvas.height) {
          if (page > 0) pdf.addPage();

          const sliceHeight = Math.min(pxPerPage, canvas.height - yOffset);
          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = sliceHeight;
          const ctx = sliceCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(canvas, 0, yOffset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
          }

          const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.95);
          const sliceAspect = sliceHeight / canvas.width;
          const sliceH = usableWidth * sliceAspect;
          pdf.addImage(sliceData, 'JPEG', margin, margin, usableWidth, sliceH);

          yOffset += sliceHeight;
          page++;
        }
      }

      pdf.save(`${reportData?.ticker || "stock"}-AI-Report.pdf`);

      toast.dismiss(loadingToast);
      toast.success(t.pdfGenerated, { duration: 3000 });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.dismiss(loadingToast);
      toast.error(t.pdfFailed, { duration: 5000 });
    }
  };

  const handleSaveImage = async () => {
    if (!reportRef.current) return;
    try {
      const element = reportRef.current;
      
      const buttonsToHide = element.querySelectorAll<HTMLElement>('button, .print\\:hidden');
      const hiddenEls: { el: HTMLElement; display: string }[] = [];
      buttonsToHide.forEach((el) => {
        hiddenEls.push({ el, display: el.style.display });
        el.style.display = 'none';
      });

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      
      hiddenEls.forEach(({ el, display }) => {
        el.style.display = display;
      });
      
      const link = document.createElement("a");
      link.download = `${reportData?.ticker || "stock"}-AI-Report.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error("Failed to save image:", error);
    }
  };

  const handleSelectAnother = () => {
    navigate("/ai-stocks");
  };

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-spin w-8 h-8 border-4 border-[#003366] border-t-transparent rounded-full" />
      </div>
    );
  }

  const isPositive = reportData.change >= 0;
  const aiDirection: "buy" | "hold" | "sell" = reportData.rsi < 30 ? "buy" : reportData.rsi > 70 ? "sell" : "hold";

  const getAISummary = () => {
    if (reportData.rsi < 30) return t.oversoldConditions;
    if (reportData.buyPercent > 60) return t.bullishMomentum;
    return t.neutralTrend;
  };

  const getAILogicSentence = () => {
    if (reportData.rsi < 30) return t.aiLogicBuy;
    if (reportData.rsi > 70) return t.aiLogicSell;
    return t.aiLogicHold;
  };

  const handleSaveToWatchlist = () => {
    if (!reportData) {
      console.log("[StockReport] No reportData available");
      return;
    }
    
    console.log("[StockReport] Saving to watchlist:", reportData.ticker);
    
    let aiSignal: "buy" | "sell" | "hold" = "hold";
    if (reportData.rsi < 30) aiSignal = "buy";
    else if (reportData.rsi > 70) aiSignal = "sell";
    
    const watchlistItem = {
      ticker: reportData.ticker,
      name: reportData.name,
      price: reportData.price,
      change: reportData.change,
      currency: reportData.currency,
      market: reportData.market,
      aiSignal,
    };
    
    console.log("[StockReport] Watchlist item to save:", watchlistItem);
    
    const result = toggleWatchlist(watchlistItem);
    
    if (result.reason === "full") {
      toast.error(t.watchlistFull, { duration: 4000 });
      return;
    }
    
    setInWatchlist(result.added);
    
    const tickerName = reportData.ticker;
    if (result.added) {
      toast.success(
        language === "en" 
          ? `${tickerName} has been saved to your watchlist!`
          : language === "zh-TW" 
            ? `${tickerName} 已加入您的自選清單！`
            : `${tickerName} 已加入您的自选清单！`,
        { duration: 3000 }
      );
    } else {
      toast.info(
        language === "en" 
          ? `${tickerName} removed from Watchlist`
          : language === "zh-TW"
            ? `${tickerName} 已從自選股移除`
            : `${tickerName} 已从自选股移除`,
        { duration: 3000 }
      );
    }
  };

  const getCurrencySymbol = () => {
    if (reportData.currency === "HKD") return "HK$";
    if (reportData.currency === "TWD") return "NT$";
    if (reportData.currency === "USD") return "$";
    return reportData.currency;
  };

  const currencySymbol = getCurrencySymbol();

  const getMarketStatus = () => {
    const now = new Date();
    const utcHour = now.getUTCHours();
    const utcMinute = now.getUTCMinutes();
    const utcTime = utcHour * 60 + utcMinute;
    const dayOfWeek = now.getUTCDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) return false;
    
    if (reportData.market === "HK") {
      return utcTime >= 90 && utcTime <= 480;
    } else if (reportData.market === "TW") {
      return utcTime >= 60 && utcTime <= 330;
    } else {
      return utcTime >= 870 && utcTime <= 1260;
    }
  };
  
  const isMarketOpen = getMarketStatus();

  const spread = reportData.price * 0.001;
  const bidPrice = (reportData.price - spread / 2).toFixed(2);
  const askPrice = (reportData.price + spread / 2).toFixed(2);
  const bidSize = Math.floor(100 + (reportData.ticker.charCodeAt(0) % 50) * 10);
  const askSize = Math.floor(100 + (reportData.ticker.charCodeAt(1 % reportData.ticker.length) % 50) * 10);
  const dayHigh = reportData.dayHigh || reportData.price * 1.01;
  const dayLow = reportData.dayLow || reportData.price * 0.99;
  const prevClose = reportData.previousClose || reportData.price * (1 - reportData.change / 100);

  return (
    <div className="min-h-screen flex flex-col print:bg-white print:text-[#334155] print:overflow-hidden max-w-[100vw] overflow-x-hidden" style={{ backgroundColor: '#e8e8e8' }}>
      <Navbar />

      <main 
        ref={mainRef}
        className="flex-1 pt-20 pb-28 px-4 overflow-auto print:pt-0 print:pb-2 print:px-4 print:overflow-visible flex justify-center"
      >
        <div 
          ref={reportRef}
          className="max-w-[210mm] w-full bg-white border border-[#d1d5db] p-10 print:p-6 print:pt-[50px] print:mt-0 print:max-w-full print:shadow-none print:rounded-none print:border-none font-body relative overflow-hidden"
          style={{ 
            fontSize: '11pt',
            boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
            borderRadius: '2px',
          }}
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.03 }}>
            <HorseLogoSVG size={500} asWatermark />
          </div>

          {/* Voice Controls - Added here */}
          {isSupported && reportData && (
            <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gold-500/10 rounded-lg border border-gold-500/20 print:hidden">
              <span className="text-xs text-muted-foreground mr-1">🔊 {t.readReport}:</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => speak(getReportText())}
                disabled={isSpeaking && !isPaused}
                className="h-8 text-xs"
              >
                <Volume2 className="h-3.5 w-3.5 mr-1" />
                {t.play}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={isPaused ? resume : pause}
                disabled={!isSpeaking}
                className="h-8 text-xs"
              >
                {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={stop}
                disabled={!isSpeaking}
                className="h-8 text-xs"
              >
                <Square className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs text-muted-foreground ml-1">
                {isSpeaking ? (isPaused ? `⏸ ${t.paused}` : `🔊 ${t.speaking}`) : `🔇 ${t.ready}`}
              </span>
              <span className="text-xs text-muted-foreground ml-2 border-l border-muted pl-2">
                {language === 'zh-TW' ? '廣東話' : language === 'zh-CN' ? '普通話' : 'English'}
              </span>
            </div>
          )}

          <ReportHeader
            ticker={reportData.ticker}
            companyName={reportData.name}
            date={new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          />

          <SectorContext ticker={reportData.ticker} market={reportData.market} sector={reportData.sector} industry={reportData.industry} />

          <RecommendationSidebar
            ticker={reportData.ticker}
            name={reportData.name}
            price={reportData.price}
            highTarget={reportData.highTarget}
            lowTarget={reportData.lowTarget}
            rsi={reportData.rsi}
            probability={reportData.probability}
            currency={reportData.currency}
          />

          <ExecutiveThesis
            ticker={reportData.ticker}
            name={reportData.name}
            rsi={reportData.rsi}
            probability={reportData.probability}
            change={reportData.change}
            direction={aiDirection}
            macdHistogram={reportData.macdHistogram}
            highTarget={reportData.highTarget}
            lowTarget={reportData.lowTarget}
            price={reportData.price}
          />

          <BullBearSummaryBox
            ticker={reportData.ticker}
            name={reportData.name}
            rsi={reportData.rsi}
            probability={reportData.probability}
            market={reportData.market}
            sector={reportData.sector}
          />

          {/* Header - Ticker & Price */}
          <div className="text-center mb-4 border-b border-[#e5e7eb] pb-4 print:mb-3 print:pb-3">
            <div className="flex items-center justify-center gap-2 mb-2 max-w-full px-2">
              <h1 className="text-[2rem] md:text-[2.5rem] font-bold tracking-tight truncate overflow-hidden text-ellipsis font-display" style={{ color: "#1e293b" }}>
                {reportData.ticker}
              </h1>
            </div>
            
            <button
              onClick={handleSaveToWatchlist}
              className="print:hidden flex items-center justify-center gap-1.5 md:gap-3 mb-3 px-2 md:px-4 py-1.5 md:py-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group max-w-full mx-auto"
              style={{ 
                backgroundColor: inWatchlist ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.08)",
              }}
              title={t.saveToWatchlist}
            >
              {!inWatchlist && (
                <span className="text-red-500 font-bold text-[0.75rem] md:text-[1.25rem] animate-pulse truncate">
                  {t.watchlistCTA}
                </span>
              )}
              
              {!inWatchlist && (
                <ArrowRight 
                  className="text-red-500 flex-shrink-0 w-4 h-4 md:w-7 md:h-7" 
                  style={{ 
                    animation: "bounce 1s infinite alternate",
                  }}
                />
              )}
              
              <div 
                className="p-1 md:p-2 rounded-full transition-all duration-300 group-hover:scale-110 flex-shrink-0"
                style={{ 
                  backgroundColor: inWatchlist ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.15)",
                  boxShadow: inWatchlist ? "0 0 25px rgba(239, 68, 68, 0.6)" : "0 0 15px rgba(255, 255, 255, 0.2)",
                }}
              >
                <Heart 
                  className={`transition-all duration-300 w-5 h-5 md:w-10 md:h-10 ${
                    inWatchlist ? "text-red-500 fill-red-500" : "text-white/90 group-hover:text-red-400"
                  }`}
                />
              </div>
              
              {inWatchlist && (
                <span className="text-red-500 font-bold text-[0.75rem] md:text-[1.25rem]">
                  {t.savedToWatchlist}
                </span>
              )}
            </button>
            
            <p className="text-[1.2rem] md:text-[1.4rem] font-medium mb-2 font-display" style={{ color: "#1e293b" }}>{reportData.name}</p>
            <div className="flex items-center justify-center gap-4">
              <span 
                className="text-[2.5rem] md:text-[3rem] font-bold print:text-[2.2rem] font-display"
                style={{ color: isPositive ? "#15803d" : "#dc2626" }}
              >
                {currencySymbol}{reportData.price.toFixed(2)}
              </span>
              <span 
                className="text-[1.2rem] font-semibold px-3 py-1.5 rounded-md print:text-[1rem] font-body"
                style={{ 
                  backgroundColor: isPositive ? "rgba(21, 128, 61, 0.06)" : "rgba(220, 38, 38, 0.06)",
                  color: isPositive ? "#15803d" : "#dc2626",
                  border: `1px solid ${isPositive ? "rgba(21,128,61,0.15)" : "rgba(220,38,38,0.15)"}`
                }}
              >
                {isPositive ? "+" : ""}{reportData.change.toFixed(2)}%
              </span>
              <span 
                className="text-[0.75rem] font-semibold px-2 py-1 rounded-full font-body"
                style={{ 
                  backgroundColor: isMarketOpen ? "rgba(21,128,61,0.1)" : "rgba(148,163,184,0.15)",
                  color: isMarketOpen ? "#15803d" : "#94a3b8",
                  border: `1px solid ${isMarketOpen ? "rgba(21,128,61,0.2)" : "rgba(148,163,184,0.25)"}`
                }}
              >
                {isMarketOpen ? `🟢 ${t.marketOpen}` : `⚫ ${t.marketClosed}`}
              </span>
            </div>
          </div>

          {/* Corporate Actions Banner */}
          {(() => {
            const divAmount = reportData.declaredDividendPerShare ?? reportData.forwardDividendRate;
            const showBanner = divAmount != null && divAmount > 0 && reportData.exDividendDate;
            if (!showBanner) return null;
            return (
            <div className="mb-4 rounded-sm p-3 border page-break-avoid flex items-center gap-3" style={{ backgroundColor: "rgba(124, 58, 237, 0.05)", borderColor: "rgba(124, 58, 237, 0.2)" }}>
              <span className="text-[1.2rem]">📅</span>
              <div>
                <p className="text-[0.8rem] font-bold" style={{ color: "#7c3aed" }}>
                  {language === "en" ? "Upcoming Corporate Action" : language === "zh-TW" ? "即將到來的企業行動" : "即将到来的企业行动"}
                </p>
                <p className="text-[0.85rem] font-semibold" style={{ color: "#1e293b" }}>
                  {language === "en"
                    ? `Upcoming Dividend: ${currencySymbol}${divAmount!.toFixed(2)} | Ex-Date: ${reportData.exDividendDate}`
                    : language === "zh-TW"
                    ? `即將派息：${currencySymbol}${divAmount!.toFixed(2)} | 除息日：${reportData.exDividendDate}`
                    : `即将派息：${currencySymbol}${divAmount!.toFixed(2)} | 除息日：${reportData.exDividendDate}`}
                </p>
                <p className="text-[0.72rem]" style={{ color: "#64748b" }}>
                  {language === "en"
                    ? `Forward Yield: ${(divAmount! / reportData.price * 100).toFixed(2)}%`
                    : `預期收益率：${(divAmount! / reportData.price * 100).toFixed(2)}%`}
                </p>
              </div>
            </div>
            );
          })()}

          {/* Market Data Table */}
          <div className="mb-4 rounded-sm p-4 border border-[#ddd] bg-[#f9f9f9] page-break-avoid">
            <h2 className="text-[1rem] font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "'Georgia', serif", color: "#003366" }}>
              📊 {t.marketData}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 rounded-sm bg-white border border-[#e5e5e5]">
                <p className="text-[#888] text-[0.8rem] mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>{t.livePrice}</p>
                <p className="text-[#333] font-bold text-[1.1rem]">{currencySymbol}{reportData.price.toFixed(2)}</p>
              </div>
              <div className="text-center p-3 rounded-sm bg-white border border-[#e5e5e5]">
                <p className="text-[#888] text-[0.8rem] mb-1">{t.high52Week}</p>
                <p className="font-bold text-[1.1rem]" style={{ color: "#006633" }}>{currencySymbol}{reportData.high52Week.toFixed(2)}</p>
              </div>
              <div className="text-center p-3 rounded-sm bg-white border border-[#e5e5e5]">
                <p className="text-[#888] text-[0.8rem] mb-1">{t.low52Week}</p>
                <p className="font-bold text-[1.1rem]" style={{ color: "#cc0000" }}>{currencySymbol}{reportData.low52Week.toFixed(2)}</p>
              </div>
              <div className="text-center p-3 rounded-sm bg-white border border-[#e5e5e5]">
                <p className="text-[#888] text-[0.8rem] mb-1">{!isMarketOpen ? (language === "en" ? "Prev. Close Volume" : language === "zh-TW" ? "前收盤成交量" : "前收盘成交量") : t.volume}</p>
                <p className="text-[#333] font-bold text-[1.1rem]">{reportData.volume === "0" ? "—" : reportData.volume}</p>
              </div>
            </div>
          </div>

          {/* Market Depth */}
          <div className="mb-4 rounded-sm p-4 border border-[#ddd] bg-[#f9f9f9] page-break-avoid">
            <h2 className="text-[1rem] font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "'Georgia', serif", color: "#003366" }}>
              📊 {t.marketDepth}
              {!isMarketOpen && (
                <span className="text-[0.7rem] font-normal text-[#94a3b8] ml-2">
                  ({language === "en" ? "Last Quote" : "最後報價"} — {new Date().toLocaleDateString()})
                </span>
              )}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {isMarketOpen ? (
                <>
                  <div className="text-center p-3 rounded-sm bg-white border border-[#e5e5e5]">
                    <p className="text-[#888] text-[0.8rem] mb-1">{t.bid}</p>
                    <p className="font-bold text-[1rem]" style={{ color: "#006633" }}>
                      {currencySymbol}{bidPrice} <span className="text-[0.7rem] text-[#888] font-normal">x {bidSize}</span>
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-sm bg-white border border-[#e5e5e5]">
                    <p className="text-[#888] text-[0.8rem] mb-1">{t.ask}</p>
                    <p className="font-bold text-[1rem]" style={{ color: "#cc0000" }}>
                      {currencySymbol}{askPrice} <span className="text-[0.7rem] text-[#888] font-normal">x {askSize}</span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center p-3 rounded-sm bg-white border border-[#e5e5e5]">
                    <p className="text-[#888] text-[0.8rem] mb-1">{language === "en" ? "Last Bid" : "最後買盤"}</p>
                    <p className="font-bold text-[1rem] text-[#94a3b8]">
                      {currencySymbol}{bidPrice}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-sm bg-white border border-[#e5e5e5]">
                    <p className="text-[#888] text-[0.8rem] mb-1">{language === "en" ? "Last Ask" : "最後賣盤"}</p>
                    <p className="font-bold text-[1rem] text-[#94a3b8]">
                      {currencySymbol}{askPrice}
                    </p>
                  </div>
                </>
              )}
              <div className="text-center p-3 rounded-sm bg-white border border-[#e5e5e5]">
                <p className="text-[#888] text-[0.8rem] mb-1">{t.dayRange}</p>
                <p className="text-[#333] font-bold text-[0.95rem]">{currencySymbol}{dayLow.toFixed(2)} — {currencySymbol}{dayHigh.toFixed(2)}</p>
              </div>
              <div className="text-center p-3 rounded-sm bg-white border border-[#e5e5e5]">
                <p className="text-[#888] text-[0.8rem] mb-1">{t.prevClose}</p>
                <p className="text-[#333] font-bold text-[1rem]">{currencySymbol}{prevClose.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Company Profile */}
          {reportData.name && (
            <div className="mb-4 rounded-sm p-4 border border-[#ddd] bg-[#f9f9f9] page-break-avoid">
              <h2 className="text-[1rem] font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "'Georgia', serif", color: "#003366" }}>
                🏢 {t.companyProfile}
              </h2>
              <div className="bg-white rounded-sm p-4 border border-[#e5e5e5]">
                <h3 className="text-[1rem] font-bold mb-2" style={{ color: "#1e293b" }}>{reportData.name} ({reportData.ticker})</h3>
                {reportData.companyDescription ? (
                  <>
                    {language !== "en" && (
                      <p className="text-[0.75rem] mb-2 italic" style={{ color: "#94a3b8" }}>
                        {language === "zh-TW" ? "📝 以下公司簡介為英文原文（資料來源：公開市場數據）" : "📝 以下公司简介为英文原文（数据来源：公开市场数据）"}
                      </p>
                    )}
                    <p className="text-[0.85rem] leading-relaxed" style={{ color: "#475569", fontFamily: "'Inter', sans-serif" }}>
                      {reportData.companyDescription}
                    </p>
                  </>
                ) : (
                  <p className="text-[0.85rem] leading-relaxed" style={{ color: "#475569", fontFamily: "'Inter', sans-serif" }}>
                    {language === "en" 
                      ? `${reportData.name} is a publicly traded company listed on the ${reportData.market === "HK" ? "Hong Kong Stock Exchange (HKEX)" : reportData.market === "TW" ? "Taiwan Stock Exchange (TWSE)" : "US stock exchange (NYSE/NASDAQ)"}. This AI-generated report provides a mathematical analysis of its recent market performance using RSI, MACD, and probability models.`
                      : language === "zh-TW"
                        ? `${reportData.name} 是一家在${reportData.market === "HK" ? "香港交易所 (HKEX)" : reportData.market === "TW" ? "台灣證券交易所 (TWSE)" : "美國證券交易所 (NYSE/NASDAQ)"}上市的公司。本 AI 報告使用 RSI、MACD 和概率模型對其近期市場表現進行數學分析。`
                        : `${reportData.name} 是一家在${reportData.market === "HK" ? "香港交易所 (HKEX)" : reportData.market === "TW" ? "台湾证券交易所 (TWSE)" : "美国证券交易所 (NYSE/NASDAQ)"}上市的公司。本 AI 报告使用 RSI、MACD 和概率模型对其近期市场表现进行数学分析。`
                    }
                  </p>
                )}
              </div>
            </div>
          )}

          <FinancialMultiplesGrid ticker={reportData.ticker} price={reportData.price} market={reportData.market} dividendYield={reportData.dividendYield} forwardDividendRate={reportData.forwardDividendRate} forwardDividendYield={reportData.forwardDividendYield} declaredDividendPerShare={reportData.declaredDividendPerShare} exDividendDate={reportData.exDividendDate} trailingPE={reportData.trailingPE} marketCapValue={reportData.marketCap} />

          <div className="mb-4 rounded-sm p-4 border border-[#ddd] bg-[#f9f9f9] page-break-avoid">
            <h2 className="text-[0.95rem] font-bold mb-2 flex items-center gap-2" style={{ fontFamily: "'Georgia', serif", color: "#003366" }}>
              📈 {t.technicalIndicators}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-center bg-white rounded-sm border border-[#e5e5e5] p-2">
                <RSIGauge value={reportData.rsi} />
              </div>
              <div className="flex justify-center bg-white rounded-sm border border-[#e5e5e5] p-2">
                <MACDIndicator 
                  macd={reportData.macd} 
                  signal={reportData.macdSignal} 
                  histogram={reportData.macdHistogram} 
                />
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-[#ddd]">
              <h3 className="text-[0.85rem] font-bold mb-2" style={{ fontFamily: "'Georgia', serif", color: "#003366" }}>
                🧠 {t.aiAnalysisLogic}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-sm p-2 bg-white border border-[#e5e5e5]">
                  <span className="text-[0.85rem] font-bold" style={{ color: "#003366" }}>RSI</span>
                  <p className="text-[#555] text-[0.8rem] leading-snug mt-1">{t.rsiExplanation}</p>
                </div>
                <div className="rounded-sm p-2 bg-white border border-[#e5e5e5]">
                  <span className="text-[0.85rem] font-bold" style={{ color: "#003366" }}>MACD</span>
                  <p className="text-[#555] text-[0.8rem] leading-snug mt-1">{t.macdExplanation}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 rounded-sm p-3 border-l-4 bg-[#f0f4f8] page-break-avoid" style={{ borderLeftColor: "#003366" }}>
            <p className="text-[0.9rem] font-medium leading-snug" style={{ color: "#333", fontFamily: "'Inter', sans-serif" }}>
              💡 {getAILogicSentence()}
            </p>
          </div>

          <div className="mb-4 rounded-sm p-4 border border-[#ddd] bg-[#f9f9f9] page-break-avoid">
            <h2 className="text-[1rem] font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "'Georgia', serif", color: "#003366" }}>
              🎯 {t.aiProbabilityPricing}
            </h2>
            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#666] text-[0.95rem]">AI Probability</span>
                <span className="text-[#333] font-bold text-[1.2rem]">{reportData.probability}%</span>
              </div>
              <Progress value={reportData.probability} className="h-3" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-sm border bg-white" style={{ borderColor: "#006633" }}>
                <p className="text-[#888] text-[0.85rem] mb-1">{t.buyTarget}</p>
                <p className="font-bold text-[1.3rem]" style={{ color: "#006633" }}>{currencySymbol}{reportData.highTarget.toFixed(2)}</p>
              </div>
              <div className="text-center p-3 rounded-sm border bg-white" style={{ borderColor: "#cc0000" }}>
                <p className="text-[#888] text-[0.85rem] mb-1">{t.sellTarget}</p>
                <p className="font-bold text-[1.3rem]" style={{ color: "#cc0000" }}>{currencySymbol}{reportData.lowTarget.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mb-4 rounded-sm p-4 border border-[#ddd] bg-[#f9f9f9] page-break-avoid">
            <h2 className="text-[1rem] font-bold mb-3 flex items-center gap-2" style={{ fontFamily: "'Georgia', serif", color: "#003366" }}>
              ⚖️ {t.decisionMatrix}
            </h2>
            <div className="flex h-8 rounded-sm overflow-hidden mb-2 border border-[#ddd]">
              <div 
                className="flex items-center justify-center text-white font-bold text-[0.85rem]"
                style={{ width: `${reportData.buyPercent}%`, backgroundColor: "#006633" }}
              >
                {reportData.buyPercent}%
              </div>
              <div 
                className="flex items-center justify-center text-[#333] font-bold text-[0.85rem]"
                style={{ width: `${reportData.holdPercent}%`, backgroundColor: "#e5c100" }}
              >
                {reportData.holdPercent}%
              </div>
              <div 
                className="flex items-center justify-center text-white font-bold text-[0.85rem]"
                style={{ width: `${reportData.sellPercent}%`, backgroundColor: "#cc0000" }}
              >
                {reportData.sellPercent}%
              </div>
            </div>
            <div className="flex justify-between text-[0.85rem] font-semibold">
              <span style={{ color: "#006633" }}>🟢 {t.buy}</span>
              <span style={{ color: "#a16207" }}>🟡 {t.hold}</span>
              <span style={{ color: "#cc0000" }}>🔴 {t.sell}</span>
            </div>
          </div>

          <div className="mb-4 rounded-sm p-4 border border-[#ddd] bg-[#f9f9f9] page-break-avoid">
            <h2 className="text-[1rem] font-bold mb-2 flex items-center gap-2" style={{ fontFamily: "'Georgia', serif", color: "#003366" }}>
              🤖 {t.aiRecommendation}
            </h2>
            <p className="text-[#333] text-[1rem] leading-relaxed italic">
              {getAISummary()}
            </p>
          </div>

          <PeerComparisonTable
            ticker={reportData.ticker}
            price={reportData.price}
            market={reportData.market}
            currency={reportData.currency}
          />

          <PricePerformanceChart
            ticker={reportData.ticker}
            name={reportData.name}
            price={reportData.price}
            market={reportData.market}
          />

          <BullBearScenario
            ticker={reportData.ticker}
            name={reportData.name}
            rsi={reportData.rsi}
            probability={reportData.probability}
            price={reportData.price}
            highTarget={reportData.highTarget}
            lowTarget={reportData.lowTarget}
            currency={reportData.currency}
          />

          <EnhancedAIAnalysis
            ticker={reportData.ticker}
            name={reportData.name}
            rsi={reportData.rsi}
            macdHistogram={reportData.macdHistogram}
            probability={reportData.probability}
            change={reportData.change}
            price={reportData.price}
            dividendYield={reportData.dividendYield}
            forwardDividendRate={reportData.forwardDividendRate}
            declaredDividendPerShare={reportData.declaredDividendPerShare}
            exDividendDate={reportData.exDividendDate}
          />

          <InvestmentRiskDisclosure
            ticker={reportData.ticker}
            rsi={reportData.rsi}
            probability={reportData.probability}
            direction={aiDirection}
            price={reportData.price}
            high52Week={reportData.high52Week}
            low52Week={reportData.low52Week}
          />

          <div className="rounded-sm p-3 border border-[#ddd] mt-4 print:hidden" style={{ backgroundColor: "#f9f9f9" }}>
            <div className="flex items-start gap-1.5">
              <AlertTriangle className="w-3 h-3 text-[#999] flex-shrink-0 mt-0.5" />
              <p className="text-[#888] text-[0.65rem] leading-snug">
                {t.disclaimer}
              </p>
            </div>
          </div>

          <div className="hidden print:block mt-6 pt-3" style={{ borderTop: "1pt solid #cbd5e1" }}>
            <p className="text-[0.55rem] leading-relaxed font-body mb-1" style={{ color: "#94a3b8" }}>
              <sup>1</sup> All financial data is AI-estimated based on publicly available information and mathematical models. This does not constitute professional financial advice.
            </p>
            <p className="text-[0.55rem] leading-relaxed font-body mb-1" style={{ color: "#94a3b8" }}>
              <sup>2</sup> Target prices are derived from RSI, MACD, and probability models. Actual market outcomes may differ materially from projections.
            </p>
            <p className="text-[0.55rem] leading-relaxed font-body mb-1" style={{ color: "#94a3b8" }}>
              <sup>3</sup> Bull/Bear scenarios are illustrative only. Probability weights are model-derived and should not be interpreted as guaranteed outcomes.
            </p>
            <p className="text-[0.55rem] leading-relaxed font-body" style={{ color: "#94a3b8" }}>
              <sup>4</sup> Performance chart is indexed to 100 at start of period. Past performance does not guarantee future results.
            </p>
          </div>

          <ReportFooter
            disclaimer="This report is generated by DragonGp.Ai for educational and informational purposes only. It does not constitute investment advice. All trading involves risk. Please consult a licensed professional before making any financial decisions."
          />

        </div>
      </main>

      {showScrollHint && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce print:hidden z-50">
          <span className="text-white text-[0.95rem] font-bold mb-2 bg-[#3B82F6]/90 px-5 py-2 rounded-full backdrop-blur-sm shadow-lg border border-[#60A5FA]/50">
            {t.scrollDown}
          </span>
          <ChevronDown className="w-10 h-10 text-[#3B82F6] drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
        </div>
      )}

      // In StockReport.tsx, find the footer section and replace with this:

<footer 
  className="fixed bottom-0 left-0 right-0 py-2 md:py-3 px-3 md:px-4 print:hidden border-t z-40"
  style={{ backgroundColor: "#fff", borderColor: "#ddd" }}
>
  <div className="max-w-4xl mx-auto flex flex-col gap-2">
    <div className="grid grid-cols-4 gap-1.5 md:flex md:gap-3 md:justify-center">
      <Button
        onClick={handleSelectAnother}
        className="flex items-center justify-center gap-1 md:gap-2 h-9 md:h-11 px-1.5 md:px-5 text-[0.55rem] md:text-[0.9rem] font-bold rounded-md md:rounded-lg bg-[#003366] hover:bg-[#002244] text-white shadow-sm"
      >
        <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
        <span className="truncate">{t.selectAnother}</span>
      </Button>
      
      <Button
        onClick={handlePrint}
        className="flex items-center justify-center gap-1 md:gap-2 h-9 md:h-11 px-1.5 md:px-5 text-[0.55rem] md:text-[0.9rem] font-bold rounded-lg md:rounded-xl bg-gradient-to-r from-[#FFD700] to-[#B8860B] text-black hover:opacity-90 shadow-lg"
      >
        <Printer className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
        <span className="truncate">{t.printPDF}</span>
      </Button>
      
      <WhatsAppShareButton
        message={`Check out this AI Stock Analysis on ${reportData?.ticker || ''} from DragonGp.Ai!`}
        className="h-9 md:h-11"
        size="sm"
      />
      
      {/* Facebook Share Button */}
      <FacebookShareButton
        url={window.location.href}
        quote={`AI Stock Analysis: ${reportData?.ticker || ''} - ${reportData?.name || ''} | Price: ${currencySymbol}${reportData?.price?.toFixed(2) || 'N/A'} | DragonGp.Ai`}
        size="sm"
        className="h-9 md:h-11"
      />
    </div>
    
    <div className="grid grid-cols-2 gap-2 md:flex md:gap-3 md:justify-center">
      <Button
        onClick={handleSavePDF}
        className="flex items-center justify-center gap-1.5 md:gap-2 h-9 md:h-11 px-2 md:px-5 text-[0.65rem] md:text-[0.9rem] font-bold rounded-lg md:rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-lg"
      >
        <FileDown className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
        <span className="truncate">{t.savePDF}</span>
      </Button>
      <Button
        onClick={handleSaveImage}
        className="flex items-center justify-center gap-1.5 md:gap-2 h-9 md:h-11 px-2 md:px-5 text-[0.65rem] md:text-[0.9rem] font-bold rounded-lg md:rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white shadow-lg"
      >
        <Image className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
        <span className="truncate">{t.saveImage}</span>
      </Button>
    </div>
    
    <Link
      to="/generate-report"
      className="flex items-center justify-center gap-2 w-full h-11 md:h-12 px-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white font-bold text-sm md:text-base rounded-xl shadow-lg shadow-green-500/30 transition-all duration-300 active:scale-[0.98]"
    >
      <Sparkles className="w-5 h-5 flex-shrink-0" />
      <span className="text-center leading-tight">{t.goToMark6}</span>
    </Link>
  </div>
</footer>

      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm 12mm 20mm 12mm;
            
            @top-left {
              content: "DragonGp.Ai — Equity Research";
              font-family: 'Playfair Display', 'Georgia', serif;
              font-size: 8pt;
              color: #1e293b;
            }
            
            @bottom-center {
              content: "Page " counter(page) " of " counter(pages);
              font-family: 'Inter', Arial, sans-serif;
              font-size: 7pt;
              color: #94a3b8;
            }
            
            @bottom-right {
              content: "CONFIDENTIAL";
              font-family: 'Inter', Arial, sans-serif;
              font-size: 6pt;
              color: #cbd5e1;
              letter-spacing: 2px;
              text-transform: uppercase;
            }
          }
          
          html, body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            background: white !important;
            color: #334155 !important;
            height: auto !important;
            overflow: visible !important;
            font-family: 'Inter', Arial, sans-serif !important;
            font-size: 11pt !important;
          }
          
          * {
            color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          nav, header, footer, .fixed {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            overflow: hidden !important;
          }
          
          .print\\:hidden,
          button,
          a[href*="generate-report"] {
            display: none !important;
          }
          
          .print\\:block {
            display: block !important;
          }
          
          main {
            height: auto !important;
            overflow: visible !important;
            padding: 0 !important;
          }
          
          .page-break-avoid,
          .rounded-sm,
          table, .grid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          body, html, main, div, section, article {
            background: white !important;
          }
          
          h1, h2, h3 {
            color: #1e293b !important;
            font-family: 'Playfair Display', 'Georgia', serif !important;
          }
          
          p, span, label, td, th {
            color: #334155 !important;
            font-family: 'Inter', Arial, sans-serif !important;
            font-size: 11pt !important;
          }
          
          [style*="color: rgb(21, 128, 61)"],
          [style*="color: #15803d"] { color: #15803d !important; }
          [style*="color: rgb(220, 38, 38)"],
          [style*="color: #dc2626"] { color: #dc2626 !important; }
          
          .max-w-\\[210mm\\] {
            max-width: 100% !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            border: none !important;
            padding: 0 !important;
          }
          
          .min-h-screen {
            min-height: auto !important;
            height: auto !important;
          }
          
          .border {
            border-color: #e5e7eb !important;
          }
          
          .mb-5 { margin-bottom: 10px !important; }
          .p-4 { padding: 12px !important; }
          .gap-3 { gap: 8px !important; }
          
          .rounded-sm {
            border-radius: 2px !important;
          }
          
          .min-h-screen::after {
            content: "CONFIDENTIAL";
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 72pt;
            font-family: 'Playfair Display', 'Georgia', serif;
            color: rgba(30, 41, 59, 0.03);
            letter-spacing: 12px;
            pointer-events: none;
            z-index: 0;
          }
        }
      `}</style>
      <QuickFeedbackPopup open={showFeedback} onOpenChange={setShowFeedback} />
    </div>
  );
}