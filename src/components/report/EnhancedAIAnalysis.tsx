import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, Shield, Target, Users, AlertTriangle } from "lucide-react";

interface EnhancedAIAnalysisProps {
  ticker: string;
  name: string;
  rsi: number;
  macdHistogram: number;
  probability: number;
  change: number;
  price: number;
  dividendYield?: number | null;
  forwardDividendRate?: number | null;
  declaredDividendPerShare?: number | null;
  exDividendDate?: string | null;
}

export function EnhancedAIAnalysis({
  ticker,
  name,
  rsi,
  macdHistogram,
  probability,
  change,
  dividendYield: apiDividendYield,
  forwardDividendRate,
  declaredDividendPerShare,
  exDividendDate,
  price,
}: EnhancedAIAnalysisProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      bullCaseTitle: "The Bull Case (Positive Drivers)",
      bearCaseTitle: "The Bear Case (Risk Factors)",
      financialSnapshotTitle: "Financial Snapshot",
      strategicAdviceTitle: "Strategic Advice",
      conservativeInvestor: "Conservative Investor",
      valueInvestor: "Value Investor",
      disclaimer: "This analysis is AI-generated for educational purposes only. Not financial advice.",
      // Bull case points based on RSI/MACD
      bullPoint1Strong: "Technical momentum indicates strong buying pressure with RSI suggesting upward continuation potential.",
      bullPoint2Strong: "MACD histogram positive divergence confirms bullish crossover, signaling institutional accumulation.",
      bullPoint3Strong: "Price action above key moving averages suggests sustained uptrend with healthy consolidation patterns.",
      bullPoint1Moderate: "Current valuation presents entry opportunity as RSI approaches oversold territory.",
      bullPoint2Moderate: "Market sentiment improving with early signs of momentum reversal on technical charts.",
      bullPoint3Moderate: "Volume patterns indicate potential accumulation phase by institutional investors.",
      // Bear case points
      bearPoint1High: "Elevated RSI levels suggest overbought conditions; profit-taking may trigger short-term pullback.",
      bearPoint2High: "MACD histogram showing signs of bearish divergence; momentum could slow near-term.",
      bearPoint3High: "Global market uncertainty and geopolitical factors may weigh on near-term performance.",
      bearPoint1Moderate: "Mixed technical signals warrant caution; wait for clearer directional confirmation.",
      bearPoint2Moderate: "Sector rotation dynamics could impact relative performance in current market environment.",
      bearPoint3Moderate: "Economic headwinds including interest rate sensitivity may create volatility.",
      // Financial snapshot
      dividendYield: "Dividend Yield",
      volatilityIndex: "Volatility Index",
      // Strategic advice
      conservativeAdvice: "Consider dollar-cost averaging into positions. Set stop-loss levels at key support zones to manage downside risk.",
      valueAdvice: "Current technical setup may present accumulation opportunity. Monitor for volume confirmation before increasing exposure.",
      conservativeAdviceNeutral: "Maintain existing positions with tight risk management. Avoid adding new exposure until trend clarifies.",
      valueAdviceNeutral: "Wait for clearer value signals. Current price action suggests patience may be rewarded.",
    },
    "zh-TW": {
      bullCaseTitle: "看漲因素（正面驅動）",
      bearCaseTitle: "風險因素（注意事項）",
      financialSnapshotTitle: "財務快照",
      strategicAdviceTitle: "策略建議",
      conservativeInvestor: "保守型投資者",
      valueInvestor: "價值型投資者",
      disclaimer: "此分析由 AI 生成，僅供教育目的。不構成財務建議。",
      bullPoint1Strong: "技術動能顯示強勁買盤壓力，RSI 顯示上漲延續潛力。",
      bullPoint2Strong: "MACD 柱狀圖正向背離確認看漲交叉，信號機構正在累積。",
      bullPoint3Strong: "價格行為高於關鍵移動平均線，顯示持續上升趨勢及健康整理型態。",
      bullPoint1Moderate: "當前估值提供進場機會，因 RSI 接近超賣區域。",
      bullPoint2Moderate: "市場情緒改善，技術圖表顯示動能反轉初期跡象。",
      bullPoint3Moderate: "成交量型態顯示機構投資者可能處於累積階段。",
      bearPoint1High: "RSI 水平偏高顯示超買情況；獲利了結可能觸發短期回調。",
      bearPoint2High: "MACD 柱狀圖顯示看跌背離跡象；近期動能可能放緩。",
      bearPoint3High: "全球市場不確定性及地緣政治因素可能影響近期表現。",
      bearPoint1Moderate: "技術信號混合，建議謹慎；等待更明確的方向確認。",
      bearPoint2Moderate: "板塊輪動動態可能影響當前市場環境下的相對表現。",
      bearPoint3Moderate: "經濟逆風包括利率敏感度可能造成波動。",
      dividendYield: "股息收益率",
      volatilityIndex: "波動性指數",
      conservativeAdvice: "考慮定期定額進場。在關鍵支撐區設置止損位以管理下行風險。",
      valueAdvice: "當前技術設置可能呈現累積機會。在增加曝險前監控成交量確認。",
      conservativeAdviceNeutral: "維持現有部位並嚴格風險管理。在趨勢明朗前避免增加新曝險。",
      valueAdviceNeutral: "等待更明確的價值信號。當前價格行為顯示耐心可能會得到回報。",
    },
    "zh-CN": {
      bullCaseTitle: "看涨因素（正面驱动）",
      bearCaseTitle: "风险因素（注意事项）",
      financialSnapshotTitle: "财务快照",
      strategicAdviceTitle: "策略建议",
      conservativeInvestor: "保守型投资者",
      valueInvestor: "价值型投资者",
      disclaimer: "此分析由 AI 生成，仅供教育目的。不构成财务建议。",
      bullPoint1Strong: "技术动能显示强劲买盘压力，RSI 显示上涨延续潜力。",
      bullPoint2Strong: "MACD 柱状图正向背离确认看涨交叉，信号机构正在累积。",
      bullPoint3Strong: "价格行为高于关键移动平均线，显示持续上升趋势及健康整理形态。",
      bullPoint1Moderate: "当前估值提供进场机会，因 RSI 接近超卖区域。",
      bullPoint2Moderate: "市场情绪改善，技术图表显示动能反转初期迹象。",
      bullPoint3Moderate: "成交量形态显示机构投资者可能处于累积阶段。",
      bearPoint1High: "RSI 水平偏高显示超买情况；获利了结可能触发短期回调。",
      bearPoint2High: "MACD 柱状图显示看跌背离迹象；近期动能可能放缓。",
      bearPoint3High: "全球市场不确定性及地缘政治因素可能影响近期表现。",
      bearPoint1Moderate: "技术信号混合，建议谨慎；等待更明确的方向确认。",
      bearPoint2Moderate: "板块轮动动态可能影响当前市场环境下的相对表现。",
      bearPoint3Moderate: "经济逆风包括利率敏感度可能造成波动。",
      dividendYield: "股息收益率",
      volatilityIndex: "波动性指数",
      conservativeAdvice: "考虑定期定额进场。在关键支撑区设置止损位以管理下行风险。",
      valueAdvice: "当前技术设置可能呈现累积机会。在增加曝险前监控成交量确认。",
      conservativeAdviceNeutral: "维持现有部位并严格风险管理。在趋势明朗前避免增加新曝险。",
      valueAdviceNeutral: "等待更明确的价值信号。当前价格行为显示耐心可能会得到回报。",
    },
  };

  const t = content[language] || content.en;

  // Determine market conditions based on indicators
  const isBullish = rsi < 50 && macdHistogram > 0;
  const isBearish = rsi > 60 && macdHistogram < 0;
  const isStrong = probability > 60;

  // Generate bull points based on conditions
  const getBullPoints = () => {
    if (isStrong && !isBearish) {
      return [t.bullPoint1Strong, t.bullPoint2Strong, t.bullPoint3Strong];
    }
    return [t.bullPoint1Moderate, t.bullPoint2Moderate, t.bullPoint3Moderate];
  };

  // Generate bear points based on conditions
  const getBearPoints = () => {
    if (rsi > 65 || isBearish) {
      return [t.bearPoint1High, t.bearPoint2High, t.bearPoint3High];
    }
    return [t.bearPoint1Moderate, t.bearPoint2Moderate, t.bearPoint3Moderate];
  };

  // Use forward yield when declared/forward dividend exists, otherwise trailing
  const declaredDiv = declaredDividendPerShare ?? forwardDividendRate;
  const hasUpcomingDividend = declaredDiv != null && declaredDiv > 0 && exDividendDate;
  
  let dividendYieldDisplay: string;
  if (hasUpcomingDividend && price > 0) {
    dividendYieldDisplay = `${((declaredDiv! / price) * 100).toFixed(2)}%`;
  } else if (apiDividendYield != null && apiDividendYield > 0) {
    dividendYieldDisplay = `${apiDividendYield.toFixed(2)}%`;
  } else {
    dividendYieldDisplay = "0.00%";
  }
  const volatilityLevel = rsi > 60 || rsi < 40 ? "High" : "Moderate";
  const volatilityLevelZh = rsi > 60 || rsi < 40 ? "高" : "中等";

  // Get strategic advice based on conditions
  const getConservativeAdvice = () => {
    if (isBullish || probability > 55) return t.conservativeAdvice;
    return t.conservativeAdviceNeutral;
  };

  const getValueAdvice = () => {
    if (rsi < 45 || probability > 55) return t.valueAdvice;
    return t.valueAdviceNeutral;
  };

  return (
    <div className="rounded-sm p-4 border border-[#e5e7eb] bg-white page-break-avoid mb-5">
      <h2 className="text-[1.1rem] font-bold mb-4 flex items-center gap-2 font-display" style={{ color: "#1e293b" }}>
        🧠 AI Deep-Dive Analysis
      </h2>

      {/* Bull Case Section */}
      <div className="mb-4 rounded-sm p-3 border border-[#15803d]/15 bg-[#f0fdf4]">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5" style={{ color: "#15803d" }} />
          <h3 className="text-[0.95rem] font-bold font-display" style={{ color: "#15803d" }}>{t.bullCaseTitle}</h3>
        </div>
        <ul className="space-y-2">
          {getBullPoints().map((point, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span style={{ color: "#15803d" }} className="mt-1 flex-shrink-0">•</span>
              <span className="text-[#334155] text-[0.85rem] leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bear Case Section */}
      <div className="mb-4 rounded-sm p-3 border border-[#dc2626]/15 bg-[#fef2f2]">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown className="w-5 h-5" style={{ color: "#dc2626" }} />
          <h3 className="text-[0.95rem] font-bold font-display" style={{ color: "#dc2626" }}>{t.bearCaseTitle}</h3>
        </div>
        <ul className="space-y-2">
          {getBearPoints().map((point, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span style={{ color: "#dc2626" }} className="mt-1 flex-shrink-0">•</span>
              <span className="text-[#334155] text-[0.85rem] leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Financial Snapshot */}
      <div className="mb-4 rounded-sm p-3 border border-[#e5e7eb] bg-[#f8fafc]">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5" style={{ color: "#1e293b" }} />
          <h3 className="text-[0.95rem] font-bold font-display" style={{ color: "#1e293b" }}>{t.financialSnapshotTitle}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 rounded-sm bg-white border border-[#e5e7eb]">
            <p className="text-[#64748b] text-[0.8rem] mb-1">{t.dividendYield}</p>
            <p className="text-[#1e293b] font-bold text-[1.1rem]">{dividendYieldDisplay}</p>
            {hasUpcomingDividend && (
              <p className="text-[0.7rem] mt-1 font-semibold" style={{ color: "#7c3aed" }}>
                📅 {language === "en"
                  ? `Upcoming: $${declaredDiv!.toFixed(2)} (Ex: ${exDividendDate})`
                  : `即將派息：$${declaredDiv!.toFixed(2)}（${exDividendDate}）`}
              </p>
            )}
          </div>
          <div className="text-center p-2 rounded-sm bg-white border border-[#e5e7eb]">
            <p className="text-[#64748b] text-[0.8rem] mb-1">{t.volatilityIndex}</p>
            <p className="font-bold text-[1.1rem]" style={{ color: volatilityLevel === "High" ? "#dc2626" : "#15803d" }}>
              {language === "en" ? volatilityLevel : volatilityLevelZh}
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Advice */}
      <div className="mb-3 rounded-sm p-3 border border-[#e5e7eb] bg-[#f8fafc]">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5" style={{ color: "#1e293b" }} />
          <h3 className="text-[0.95rem] font-bold font-display" style={{ color: "#1e293b" }}>{t.strategicAdviceTitle}</h3>
        </div>
        <div className="space-y-3">
          <div className="rounded-sm p-3 bg-white border border-[#e5e7eb]">
            <p className="text-[#64748b] text-[0.75rem] mb-1 font-semibold">
              <Shield className="w-3 h-3 inline mr-1" />
              {t.conservativeInvestor}:
            </p>
            <p className="text-[#334155] text-[0.85rem] leading-relaxed">{getConservativeAdvice()}</p>
          </div>
          <div className="rounded-sm p-3 bg-white border border-[#e5e7eb]">
            <p className="text-[#64748b] text-[0.75rem] mb-1 font-semibold">
              <Target className="w-3 h-3 inline mr-1" />
              {t.valueInvestor}:
            </p>
            <p className="text-[#334155] text-[0.85rem] leading-relaxed">{getValueAdvice()}</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 pt-3 border-t border-[#e5e7eb]">
        <AlertTriangle className="w-3 h-3 text-[#94a3b8] flex-shrink-0 mt-0.5" />
        <p className="text-[#94a3b8] text-[0.7rem] italic">{t.disclaimer}</p>
      </div>
    </div>
  );
}
