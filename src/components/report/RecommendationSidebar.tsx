import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, Minus, Target, ArrowUpRight } from "lucide-react";

interface RecommendationSidebarProps {
  ticker: string;
  name: string;
  price: number;
  highTarget: number;
  lowTarget: number;
  rsi: number;
  probability: number;
  currency: string;
}

export function RecommendationSidebar({
  ticker,
  name,
  price,
  highTarget,
  lowTarget,
  rsi,
  probability,
  currency,
}: RecommendationSidebarProps) {
  const { language } = useLanguage();

  const labels = {
    en: {
      title: "Analyst Recommendation",
      rating: "Rating",
      targetPrice: "12M Target Price",
      upside: "Upside / Downside",
      currentPrice: "Current Price",
      priceRange: "Target Range",
      buy: "BUY",
      hold: "HOLD",
      sell: "SELL",
      strongBuy: "STRONG BUY",
      conviction: "Conviction",
      high: "High",
      medium: "Medium",
      low: "Low",
    },
    "zh-TW": {
      title: "分析師建議",
      rating: "評級",
      targetPrice: "12個月目標價",
      upside: "上行 / 下行空間",
      currentPrice: "現價",
      priceRange: "目標區間",
      buy: "買入",
      hold: "持有",
      sell: "賣出",
      strongBuy: "強力買入",
      conviction: "信心度",
      high: "高",
      medium: "中",
      low: "低",
    },
    "zh-CN": {
      title: "分析师建议",
      rating: "评级",
      targetPrice: "12个月目标价",
      upside: "上行 / 下行空间",
      currentPrice: "现价",
      priceRange: "目标区间",
      buy: "买入",
      hold: "持有",
      sell: "卖出",
      strongBuy: "强力买入",
      conviction: "信心度",
      high: "高",
      medium: "中",
      low: "低",
    },
  };

  const lang = language === "zh-TW" ? "zh-TW" : language === "zh-CN" ? "zh-CN" : "en";
  const t = labels[lang];

  const getCurrencySymbol = () => {
    if (currency === "HKD") return "HK$";
    if (currency === "TWD") return "NT$";
    if (currency === "USD") return "$";
    return currency;
  };
  const sym = getCurrencySymbol();

  // Determine rating
  const getRating = () => {
    if (rsi < 30 && probability >= 60) return { label: t.strongBuy, color: "#006633", bg: "#ecfdf5" };
    if (rsi < 45 && probability >= 50) return { label: t.buy, color: "#006633", bg: "#ecfdf5" };
    if (rsi > 70) return { label: t.sell, color: "#cc0000", bg: "#fef2f2" };
    return { label: t.hold, color: "#a16207", bg: "#fffbeb" };
  };

  const rating = getRating();
  const targetPrice = (highTarget + lowTarget) / 2;
  const upsidePct = ((targetPrice - price) / price) * 100;
  const isPositiveUpside = upsidePct >= 0;

  const conviction = probability >= 65 ? t.high : probability >= 45 ? t.medium : t.low;
  const convictionColor = probability >= 65 ? "#006633" : probability >= 45 ? "#a16207" : "#cc0000";

  return (
    <div
      className="mb-5 rounded-sm border-2 p-0 overflow-hidden font-body"
      style={{ borderColor: "#003366", pageBreakInside: "avoid", breakInside: "avoid" }}
    >
      {/* Title bar */}
      <div className="px-4 py-2.5" style={{ backgroundColor: "#003366" }}>
        <h2 className="text-[0.9rem] font-bold text-white tracking-wide font-display flex items-center gap-2">
          <Target className="w-4 h-4" />
          {t.title}
        </h2>
      </div>

      <div className="p-4 bg-white">
        {/* Rating Badge - Gold Octagon Seal */}
        <div className="text-center mb-4 pb-3" style={{ borderBottom: "1pt solid #e5e7eb" }}>
          <p className="text-[0.7rem] uppercase tracking-widest mb-3 font-semibold" style={{ color: "#64748b" }}>
            {t.rating}
          </p>
          {/* Gold Octagon Frame */}
          <div className="inline-flex items-center justify-center relative">
            <svg width="120" height="120" viewBox="0 0 120 120" className="absolute">
              <polygon
                points="60,2 95,15 113,47 113,73 95,105 60,118 25,105 7,73 7,47 25,15"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="3"
              />
              <polygon
                points="60,8 91,19 107,48 107,72 91,101 60,112 29,101 13,72 13,48 29,19"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="1"
                opacity="0.4"
              />
            </svg>
            <div
              className="relative z-10 w-[100px] h-[100px] flex flex-col items-center justify-center font-display"
            >
              <span className="text-[1.1rem] font-bold tracking-wide" style={{ color: '#D4AF37' }}>
                {rating.label}
              </span>
              <span className="text-[0.55rem] uppercase tracking-widest mt-0.5" style={{ color: '#B8860B' }}>AI RATING</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <span className="text-[0.7rem]" style={{ color: "#64748b" }}>{t.conviction}:</span>
            <span className="text-[0.75rem] font-bold" style={{ color: convictionColor }}>{conviction}</span>
          </div>
        </div>

        {/* Target Price */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center p-3 rounded-sm" style={{ backgroundColor: "#f8fafc", border: "0.5pt solid #e2e8f0" }}>
            <p className="text-[0.65rem] uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>{t.currentPrice}</p>
            <p className="font-bold text-[1.1rem] tabular-nums" style={{ color: "#1e293b" }}>{sym}{price.toFixed(2)}</p>
          </div>
          <div className="text-center p-3 rounded-sm" style={{ backgroundColor: "#f0fdf4", border: "0.5pt solid #bbf7d0" }}>
            <p className="text-[0.65rem] uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>{t.targetPrice}</p>
            <p className="font-bold text-[1.1rem] tabular-nums" style={{ color: "#006633" }}>{sym}{targetPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Upside % */}
        <div className="text-center p-3 rounded-sm mb-3" style={{ backgroundColor: isPositiveUpside ? "#ecfdf5" : "#fef2f2", border: `0.5pt solid ${isPositiveUpside ? "#bbf7d0" : "#fecaca"}` }}>
          <p className="text-[0.65rem] uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>{t.upside}</p>
          <div className="flex items-center justify-center gap-1.5">
            {isPositiveUpside ? <ArrowUpRight className="w-5 h-5" style={{ color: "#006633" }} /> : <TrendingDown className="w-5 h-5" style={{ color: "#cc0000" }} />}
            <span className="font-bold text-[1.4rem] tabular-nums" style={{ color: isPositiveUpside ? "#006633" : "#cc0000" }}>
              {isPositiveUpside ? "+" : ""}{upsidePct.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Price Range */}
        <div className="p-3 rounded-sm" style={{ backgroundColor: "#f8fafc", border: "0.5pt solid #e2e8f0" }}>
          <p className="text-[0.65rem] uppercase tracking-wider mb-2 text-center" style={{ color: "#94a3b8" }}>{t.priceRange}</p>
          <div className="flex items-center justify-between">
            <span className="text-[0.8rem] font-bold tabular-nums" style={{ color: "#cc0000" }}>{sym}{lowTarget.toFixed(2)}</span>
            <div className="flex-1 mx-3 h-1.5 rounded-full" style={{ backgroundColor: "#e2e8f0" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(Math.max(((price - lowTarget) / (highTarget - lowTarget)) * 100, 5), 95)}%`,
                  background: "linear-gradient(90deg, #cc0000, #a16207, #006633)",
                }}
              />
            </div>
            <span className="text-[0.8rem] font-bold tabular-nums" style={{ color: "#006633" }}>{sym}{highTarget.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
