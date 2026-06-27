import { Brain, TrendingUp, BarChart3, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { StrategicVerdictBadge } from "./StrategicVerdictBadge";

interface StrategicVerdictCardProps {
  summary: string;
  direction: "bullish" | "bearish" | "neutral";
  probability: number;
  rsi: number;
  macdHistogram: number;
  loading?: boolean;
}

export function StrategicVerdictCard({ 
  summary, 
  direction, 
  probability, 
  rsi, 
  macdHistogram,
  loading 
}: StrategicVerdictCardProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Strategic Verdict",
      marketSentiment: "Market Sentiment",
      mathematicalTrend: "Mathematical Trend",
      sentimentBullish: "Positive momentum detected. Institutional buying signals suggest upward pressure on price action.",
      sentimentBearish: "Caution advised. Selling pressure observed with potential downside continuation in the near term.",
      sentimentNeutral: "Mixed signals present. Market awaiting catalysts before directional move occurs.",
      trendBullish: "RSI indicates moderate strength without overbought conditions. MACD histogram positive, confirming bullish divergence.",
      trendBearish: "RSI approaching oversold territory. MACD histogram negative, signaling bearish momentum continuation.",
      trendNeutral: "RSI in neutral zone (40-60). MACD shows minimal divergence, typical of consolidation phases.",
      footer: "Unbiased AI Analysis — No Broker Commissions Involved.",
    },
    tc: {
      title: "策略判定",
      marketSentiment: "市場情緒",
      mathematicalTrend: "數學趨勢",
      sentimentBullish: "偵測到正向動能。機構買入信號顯示價格有上行壓力。",
      sentimentBearish: "建議謹慎。觀察到賣壓，短期內可能繼續下行。",
      sentimentNeutral: "信號混合。市場等待催化劑後才會出現方向性走勢。",
      trendBullish: "RSI 顯示適度強度，未達超買。MACD 柱狀圖為正，確認看漲背離。",
      trendBearish: "RSI 接近超賣區域。MACD 柱狀圖為負，信號看跌動能持續。",
      trendNeutral: "RSI 在中性區域（40-60）。MACD 顯示最小背離，為整理階段典型特徵。",
      footer: "無偏見 AI 分析 — 不涉及經紀佣金。",
    },
    sc: {
      title: "策略判定",
      marketSentiment: "市场情绪",
      mathematicalTrend: "数学趋势",
      sentimentBullish: "检测到正向动能。机构买入信号显示价格有上行压力。",
      sentimentBearish: "建议谨慎。观察到卖压，短期内可能继续下行。",
      sentimentNeutral: "信号混合。市场等待催化剂后才会出现方向性走势。",
      trendBullish: "RSI 显示适度强度，未达超买。MACD 柱状图为正，确认看涨背离。",
      trendBearish: "RSI 接近超卖区域。MACD 柱状图为负，信号看跌动能持续。",
      trendNeutral: "RSI 在中性区域（40-60）。MACD 显示最小背离，为整理阶段典型特征。",
      footer: "无偏见 AI 分析 — 不涉及经纪佣金。",
    },
  };

  const t = content[language === "zh-TW" ? "tc" : language === "zh-CN" ? "sc" : "en"] || content.en;

  // Generate detailed analysis based on direction
  const getSentimentText = () => {
    if (direction === "bullish") return t.sentimentBullish;
    if (direction === "bearish") return t.sentimentBearish;
    return t.sentimentNeutral;
  };

  const getTrendText = () => {
    if (direction === "bullish") return t.trendBullish;
    if (direction === "bearish") return t.trendBearish;
    return t.trendNeutral;
  };

  if (loading) {
    return (
      <div className="h-64 bg-[#1A1F2E] rounded-lg animate-pulse border border-[#334155]" />
    );
  }

  return (
    <div 
      className="bg-[#1A1F2E] rounded-lg border border-cyan-500/30 p-5 relative overflow-hidden"
      style={{
        boxShadow: '0 0 40px -10px rgba(6, 182, 212, 0.4), inset 0 1px 0 rgba(6, 182, 212, 0.1)'
      }}
    >
      {/* Subtle cyan glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
      
      {/* Header with Title and Signal Badge */}
      <div className="flex items-start justify-between gap-4 mb-4 relative">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">{t.title}</h3>
        </div>
        
        {/* Large Glowing Signal Badge - Top Right */}
        <StrategicVerdictBadge
          direction={direction}
          probability={probability}
          rsi={rsi}
          size="large"
        />
      </div>
      
      {/* Market Sentiment Section */}
      <div className="mb-4 relative">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-cyan-400/70" />
          <h4 className="text-sm font-semibold text-cyan-300">{t.marketSentiment}</h4>
        </div>
        <p className="text-sm text-[#CBD5E1] leading-relaxed pl-6">
          {getSentimentText()}
        </p>
      </div>
      
      {/* Mathematical Trend Section */}
      <div className="mb-4 relative">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-4 h-4 text-cyan-400/70" />
          <h4 className="text-sm font-semibold text-cyan-300">{t.mathematicalTrend}</h4>
        </div>
        <p className="text-sm text-[#CBD5E1] leading-relaxed pl-6">
          {getTrendText()}
        </p>
      </div>
      
      {/* Footer Disclaimer */}
      <div className="pt-3 border-t border-[#334155] relative">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="text-xs text-[#64748B] italic">{t.footer}</span>
        </div>
      </div>
    </div>
  );
}
