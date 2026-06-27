import { Brain, Newspaper } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AISummaryCardProps {
  summary: string;
  direction: "bullish" | "bearish" | "neutral";
  loading?: boolean;
}

export function AISummaryCard({ summary, direction, loading }: AISummaryCardProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "AI Analysis Summary",
      newsImpact: "Recent News Impact",
      newsPlaceholder: "Market sentiment analysis based on recent events",
    },
    tc: {
      title: "AI 分析摘要",
      newsImpact: "近期新聞影響",
      newsPlaceholder: "基於近期事件的市場情緒分析",
    },
    sc: {
      title: "AI 分析摘要",
      newsImpact: "近期新闻影响",
      newsPlaceholder: "基于近期事件的市场情绪分析",
    },
  };

  const t = content[language === "zh-TW" ? "tc" : language === "zh-CN" ? "sc" : "en"] || content.en;

  // Generate news impact based on direction
  const getNewsImpact = () => {
    if (direction === "bullish") {
      return language === "en" 
        ? "Positive earnings outlook: Bullish sentiment" 
        : language === "zh-TW" 
        ? "正面盈利展望：看漲情緒" 
        : "正面盈利展望：看涨情绪";
    }
    if (direction === "bearish") {
      return language === "en" 
        ? "Fed rate concerns: Bearish pressure" 
        : language === "zh-TW" 
        ? "聯儲加息擔憂：看跌壓力" 
        : "联储加息担忧：看跌压力";
    }
    return language === "en" 
      ? "Mixed signals: Awaiting catalysts" 
      : language === "zh-TW" 
      ? "信號混合：等待催化劑" 
      : "信号混合：等待催化剂";
  };

  if (loading) {
    return (
      <div className="h-40 bg-[#1E293B] rounded-lg animate-pulse border border-[#334155]" />
    );
  }

  return (
    <div className="bg-[#1E293B] rounded-lg border border-[#334155] p-4 shadow-[0_0_20px_-10px_rgba(6,182,212,0.3)]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-semibold text-white">{t.title}</h3>
      </div>
      
      {/* Summary text */}
      <p className="text-sm text-[#CBD5E1] leading-relaxed mb-4">
        {summary}
      </p>
      
      {/* News Impact Section */}
      <div className="border-t border-[#334155] pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Newspaper className="w-3.5 h-3.5 text-cyan-400/70" />
          <span className="text-xs font-medium text-[#94A3B8]">{t.newsImpact}</span>
        </div>
        <p className={`text-xs font-medium ${
          direction === "bullish" ? "text-green-400" :
          direction === "bearish" ? "text-dragon" :
          "text-gold"
        }`}>
          {getNewsImpact()}
        </p>
      </div>
    </div>
  );
}
