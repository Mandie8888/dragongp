import { useLanguage } from "@/contexts/LanguageContext";

interface ExecutiveThesisProps {
  ticker: string;
  name: string;
  rsi: number;
  probability: number;
  change: number;
  direction: "buy" | "hold" | "sell";
  macdHistogram?: number;
  divYield?: number;
  highTarget?: number;
  lowTarget?: number;
  price?: number;
}

interface BulletPoint {
  label: string;
  text: string;
}

export function ExecutiveThesis({ ticker, name, rsi, probability, change, direction, macdHistogram = 0, divYield, highTarget, lowTarget, price }: ExecutiveThesisProps) {
  const { language } = useLanguage();

  const macdCrossover = macdHistogram > 0;
  const rsiZone = rsi < 30 ? "oversold" : rsi > 70 ? "overbought" : rsi < 45 ? "approaching oversold" : rsi > 60 ? "elevated" : "neutral";
  const upsidePct = price && highTarget ? (((highTarget - price) / price) * 100).toFixed(1) : null;
  const downsidePct = price && lowTarget ? (((price - lowTarget) / price) * 100).toFixed(1) : null;

  const getBullets = (): BulletPoint[] => {
    if (language === "zh-TW") {
      if (direction === "buy") return [
        { label: "技術動能", text: `MACD ${macdCrossover ? "正向交叉" : "底部背離"}，買方力量正在積聚。RSI 目前為 ${rsi.toFixed(1)}，處於${rsiZone === "oversold" ? "超賣區間" : "具吸引力的累積區域"}。` },
        { label: "估值背景", text: `${probability}% 的上漲概率顯示風險調整後回報傾向偏多。市場正逐步脫離${rsi < 30 ? "超賣區域" : "盤整階段"}。` },
        { label: "上行信念", text: upsidePct ? `模型預測目標價隱含 +${upsidePct}% 的資本增值空間。` : `前瞻性展望取決於宏觀環境支持與盈利催化劑的兌現。` },
        { label: "行動建議", text: `建議在趨勢確認後逐步建倉，設定止損於近期支撐位。` },
      ];
      if (direction === "sell") return [
        { label: "技術動能", text: `RSI 升至 ${rsi.toFixed(1)} 的超買區域，MACD 柱狀圖${macdCrossover ? "動能正在衰減" : "已轉為負值"}。` },
        { label: "估值背景", text: `僅 ${probability}% 的上漲概率反映持續整理的高概率風險，${change >= 0 ? "+" : ""}${change.toFixed(2)}% 的價格走勢可能不具可持續性。` },
        { label: "下行風險", text: downsidePct ? `模型估算下行風險約 -${downsidePct}%，至支撐價位。` : `近期漲幅缺乏後續支撐，回調壓力增大。` },
        { label: "行動建議", text: `建議審慎減持以保護已實現收益，等待明確底部形態出現。` },
      ];
      return [
        { label: "技術動能", text: `RSI 為 ${rsi.toFixed(1)}，落入中性區間。${macdCrossover ? "MACD 呈現微弱正向動能" : "MACD 信號偏弱"}。` },
        { label: "估值背景", text: `AI 概率模型計算出 ${probability}% 的上漲概率，整體缺乏明確方向性偏見。` },
        { label: "觀察重點", text: `待 RSI 突破 60 或跌破 35 等確定性更高的技術觸發點出現。` },
        { label: "行動建議", text: `建議維持現有部位規模，待信號更明確後再調整風險敞口。` },
      ];
    }
    if (language === "zh-CN") {
      if (direction === "buy") return [
        { label: "技术动能", text: `MACD ${macdCrossover ? "正向交叉" : "底部背离"}，买方力量正在积聚。RSI 目前为 ${rsi.toFixed(1)}，处于${rsiZone === "oversold" ? "超卖区间" : "具吸引力的累积区域"}。` },
        { label: "估值背景", text: `${probability}% 的上涨概率显示风险调整后回报倾向偏多。市场正逐步脱离${rsi < 30 ? "超卖区域" : "盘整阶段"}。` },
        { label: "上行信念", text: upsidePct ? `模型预测目标价隐含 +${upsidePct}% 的资本增值空间。` : `前瞻性展望取决于宏观环境支持与盈利催化剂的兑现。` },
        { label: "行动建议", text: `建议在趋势确认后逐步建仓，设定止损于近期支撑位。` },
      ];
      if (direction === "sell") return [
        { label: "技术动能", text: `RSI 升至 ${rsi.toFixed(1)} 的超买区域，MACD 柱状图${macdCrossover ? "动能正在衰减" : "已转为负值"}。` },
        { label: "估值背景", text: `仅 ${probability}% 的上涨概率反映持续整理的高概率风险，${change >= 0 ? "+" : ""}${change.toFixed(2)}% 的价格走势可能不具可持续性。` },
        { label: "下行风险", text: downsidePct ? `模型估算下行风险约 -${downsidePct}%，至支撑价位。` : `近期涨幅缺乏后续支撑，回调压力增大。` },
        { label: "行动建议", text: `建议审慎减持以保护已实现收益，等待明确底部形态出现。` },
      ];
      return [
        { label: "技术动能", text: `RSI 为 ${rsi.toFixed(1)}，落入中性区间。${macdCrossover ? "MACD 呈现微弱正向动能" : "MACD 信号偏弱"}。` },
        { label: "估值背景", text: `AI 概率模型计算出 ${probability}% 的上涨概率，整体缺乏明确方向性偏见。` },
        { label: "观察重点", text: `待 RSI 突破 60 或跌破 35 等确定性更高的技术触发点出现。` },
        { label: "行动建议", text: `建议维持现有仓位规模，待信号更明确后再调整风险敞口。` },
      ];
    }
    // English
    if (direction === "buy") return [
      { label: "Technical Momentum", text: `MACD ${macdCrossover ? "bullish crossover" : "positive divergence"} detected, indicating accumulating buying pressure. RSI at ${rsi.toFixed(1)} positions the stock in ${rsiZone === "oversold" ? "oversold territory" : "an attractive accumulation zone"}.` },
      { label: "Valuation Context", text: `${probability}% upside probability signals risk-adjusted returns skew favorably for long positioning as ${ticker} emerges from ${rsi < 30 ? "deeply oversold territory" : "a consolidation phase"}.` },
      { label: "Upside Conviction", text: upsidePct ? `Model target price implies +${upsidePct}% capital appreciation potential, contingent on sustained volume trajectory and sector rotation.` : `Forward outlook contingent upon sustained macro support and earnings catalyst realization.` },
      { label: "Action Signal", text: `Scale into positions upon trend confirmation. Set stop-loss at recent support levels to manage downside risk.` },
    ];
    if (direction === "sell") return [
      { label: "Technical Momentum", text: `RSI has climbed to ${rsi.toFixed(1)} in overbought territory. MACD histogram ${macdCrossover ? "shows decelerating momentum" : "has turned negative"}, suggesting the advance lacks follow-through.` },
      { label: "Valuation Context", text: `Only ${probability}% upside probability reflects elevated mean-reversion risk. Current ${change >= 0 ? "+" : ""}${change.toFixed(2)}% price trajectory may prove unsustainable.` },
      { label: "Downside Risk", text: downsidePct ? `Model estimates ~-${downsidePct}% downside to support price level.` : `Recent gains lack follow-through conviction; pullback pressure is building.` },
      { label: "Action Signal", text: `Prudent capital preservation warrants measured position reduction to lock in realized gains. Await definitive base formation.` },
    ];
    return [
      { label: "Technical Momentum", text: `RSI at ${rsi.toFixed(1)}, squarely within neutral territory. ${macdCrossover ? "Marginally positive MACD momentum" : "Subdued MACD signals"} — no clear directional conviction.` },
      { label: "Valuation Context", text: `AI model yields ${probability}% upside probability, reflecting balanced risk from both sides of the market.` },
      { label: "Key Watch Level", text: `Await RSI breaking above 60 (bullish trigger) or retreating below 35 (bearish trigger) before reallocating risk capital.` },
      { label: "Action Signal", text: `Maintain current exposure. No compelling entry or exit signal at this time.` },
    ];
  };

  const labels = {
    en: "Executive Investment Thesis",
    "zh-TW": "投資摘要",
    "zh-CN": "投资摘要",
  };

  const directionLabels = {
    en: { buy: "BUY", hold: "HOLD", sell: "SELL" },
    "zh-TW": { buy: "買入", hold: "持有", sell: "賣出" },
    "zh-CN": { buy: "买入", hold: "持有", sell: "卖出" },
  };

  const lang = language === "zh-TW" ? "zh-TW" : language === "zh-CN" ? "zh-CN" : "en";
  const directionColor = direction === "buy" ? "#15803d" : direction === "sell" ? "#dc2626" : "#a16207";

  // Confidence gauge
  const confidenceScore = probability;
  const confidenceLevel = confidenceScore >= 65 ? "high" : confidenceScore >= 40 ? "medium" : "low";
  const confidenceLabels = {
    en: { low: "Low", medium: "Medium", high: "High", title: "Analyst Confidence" },
    "zh-TW": { low: "低", medium: "中", high: "高", title: "分析師信心度" },
    "zh-CN": { low: "低", medium: "中", high: "高", title: "分析师信心度" },
  };
  const ct = confidenceLabels[lang];
  const confidenceLevelLabel = confidenceLevel === "high" ? ct.high : confidenceLevel === "medium" ? ct.medium : ct.low;
  const confidenceLevelColor = confidenceLevel === "high" ? "#15803d" : confidenceLevel === "medium" ? "#a16207" : "#dc2626";

  // SVG semi-circle gauge math
  const gaugeRadius = 40;
  const gaugeCx = 50;
  const gaugeCy = 48;
  const angle = (confidenceScore / 100) * 180;
  const needleLength = gaugeRadius - 4;
  const needleAngle = 180 + angle;
  const needleX = gaugeCx + needleLength * Math.cos((needleAngle * Math.PI) / 180);
  const needleY = gaugeCy + needleLength * Math.sin((needleAngle * Math.PI) / 180);

  const bullets = getBullets();

  return (
    <div className="mb-5 p-4 border-l-4 page-break-avoid" style={{ borderLeftColor: directionColor, backgroundColor: "#f8fafc" }}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[0.95rem] font-bold font-display" style={{ color: "#1e293b" }}>
          {labels[lang]}
        </h2>
        <span 
          className="text-[0.75rem] font-bold px-3 py-1 rounded font-body tracking-wider"
          style={{ backgroundColor: directionColor, color: "#fff" }}
        >
          {directionLabels[lang][direction]}
        </span>
      </div>

      <div className="flex gap-4 items-start">
        {/* Bullet points */}
        <div className="flex-1">
          <ul className="space-y-2">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span
                  className="inline-block mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: directionColor }}
                />
                <p className="text-[0.82rem] leading-relaxed font-body" style={{ color: "#334155" }}>
                  <span className="font-bold" style={{ color: "#1e293b" }}>{b.label}:</span>{" "}
                  {b.text}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Confidence Gauge - Speedometer */}
        <div className="flex-shrink-0 flex flex-col items-center" style={{ width: "110px" }}>
          <svg viewBox="0 0 100 60" width="110" height="66">
            {/* Background arc */}
            <path
              d={`M ${gaugeCx - gaugeRadius} ${gaugeCy} A ${gaugeRadius} ${gaugeRadius} 0 0 1 ${gaugeCx + gaugeRadius} ${gaugeCy}`}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth={8}
              strokeLinecap="round"
            />
            {/* Red segment */}
            <path
              d={`M ${gaugeCx - gaugeRadius} ${gaugeCy} A ${gaugeRadius} ${gaugeRadius} 0 0 1 ${gaugeCx - gaugeRadius * Math.cos(Math.PI * 0.33)} ${gaugeCy - gaugeRadius * Math.sin(Math.PI * 0.33)}`}
              fill="none"
              stroke="#fca5a5"
              strokeWidth={8}
              strokeLinecap="round"
            />
            {/* Yellow segment */}
            <path
              d={`M ${gaugeCx - gaugeRadius * Math.cos(Math.PI * 0.33)} ${gaugeCy - gaugeRadius * Math.sin(Math.PI * 0.33)} A ${gaugeRadius} ${gaugeRadius} 0 0 1 ${gaugeCx - gaugeRadius * Math.cos(Math.PI * 0.66)} ${gaugeCy - gaugeRadius * Math.sin(Math.PI * 0.66)}`}
              fill="none"
              stroke="#fde68a"
              strokeWidth={8}
              strokeLinecap="round"
            />
            {/* Green segment */}
            <path
              d={`M ${gaugeCx - gaugeRadius * Math.cos(Math.PI * 0.66)} ${gaugeCy - gaugeRadius * Math.sin(Math.PI * 0.66)} A ${gaugeRadius} ${gaugeRadius} 0 0 1 ${gaugeCx + gaugeRadius} ${gaugeCy}`}
              fill="none"
              stroke="#86efac"
              strokeWidth={8}
              strokeLinecap="round"
            />
            {/* Needle */}
            <line x1={gaugeCx} y1={gaugeCy} x2={needleX} y2={needleY} stroke={confidenceLevelColor} strokeWidth="2" strokeLinecap="round" />
            <circle cx={gaugeCx} cy={gaugeCy} r="3" fill={confidenceLevelColor} />
            <text x={gaugeCx} y={gaugeCy + 2} textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="'Inter', sans-serif" fill={confidenceLevelColor} dy="12">
              {confidenceScore}%
            </text>
            <text x={gaugeCx - gaugeRadius - 2} y={gaugeCy + 10} textAnchor="middle" fontSize="5.5" fill="#94a3b8" fontFamily="'Inter', sans-serif">0</text>
            <text x={gaugeCx + gaugeRadius + 2} y={gaugeCy + 10} textAnchor="middle" fontSize="5.5" fill="#94a3b8" fontFamily="'Inter', sans-serif">100</text>
          </svg>
          <p className="text-[0.6rem] font-semibold tracking-wider uppercase text-center mt-0.5" style={{ color: "#64748b" }}>{ct.title}</p>
          <p className="text-[0.7rem] font-bold text-center" style={{ color: confidenceLevelColor }}>{confidenceLevelLabel}</p>
        </div>
      </div>
    </div>
  );
}
