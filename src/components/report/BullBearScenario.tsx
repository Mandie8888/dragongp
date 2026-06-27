import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, Shield } from "lucide-react";

interface BullBearScenarioProps {
  ticker: string;
  name: string;
  rsi: number;
  probability: number;
  price: number;
  highTarget: number;
  lowTarget: number;
  currency: string;
}

export function BullBearScenario({ ticker, name, rsi, probability, price, highTarget, lowTarget, currency }: BullBearScenarioProps) {
  const { language } = useLanguage();

  const sym = currency === "HKD" ? "HK$" : currency === "TWD" ? "NT$" : "$";

  const labels = {
    en: {
      title: "Bull vs. Bear Scenario Analysis",
      bullCase: "Bull Case",
      bearCase: "Bear Case",
      targetPrice: "Target",
      impliedReturn: "Implied Return",
      catalysts: "Catalysts",
      risks: "Key Risks",
      bullCatalysts: [
        "Earnings beat consensus estimates",
        "Market sentiment turns risk-on",
        "Sector rotation favors this industry",
        `RSI (${rsi.toFixed(0)}) shows room for upside`,
      ],
      bearRisks: [
        "Macro headwinds and rate uncertainty",
        "Earnings miss or guidance cut",
        "Sector-wide de-rating pressure",
        "Geopolitical or regulatory risk",
      ],
      probability: "Probability Weight",
      footer: "Scenarios are AI-generated for illustrative purposes. Actual outcomes may differ materially.",
    },
    "zh-TW": {
      title: "多空情境分析",
      bullCase: "樂觀情境",
      bearCase: "悲觀情境",
      targetPrice: "目標價",
      impliedReturn: "隱含回報",
      catalysts: "催化因素",
      risks: "主要風險",
      bullCatalysts: [
        "盈利超出市場預期",
        "市場情緒轉向樂觀",
        "行業輪動有利該板塊",
        `RSI (${rsi.toFixed(0)}) 顯示上行空間`,
      ],
      bearRisks: [
        "宏觀逆風與利率不確定性",
        "盈利不及預期或下調指引",
        "板塊整體估值下修壓力",
        "地緣政治或監管風險",
      ],
      probability: "概率權重",
      footer: "情境由 AI 生成，僅供參考。實際結果可能存在重大差異。",
    },
    "zh-CN": {
      title: "多空情景分析",
      bullCase: "乐观情景",
      bearCase: "悲观情景",
      targetPrice: "目标价",
      impliedReturn: "隐含回报",
      catalysts: "催化因素",
      risks: "主要风险",
      bullCatalysts: [
        "盈利超出市场预期",
        "市场情绪转向乐观",
        "行业轮动有利该板块",
        `RSI (${rsi.toFixed(0)}) 显示上行空间`,
      ],
      bearRisks: [
        "宏观逆风与利率不确定性",
        "盈利不及预期或下调指引",
        "板块整体估值下修压力",
        "地缘政治或监管风险",
      ],
      probability: "概率权重",
      footer: "情景由 AI 生成，仅供参考。实际结果可能存在重大差异。",
    },
  };

  const lang = language === "zh-TW" ? "zh-TW" : language === "zh-CN" ? "zh-CN" : "en";
  const t = labels[lang];

  const bullReturn = ((highTarget - price) / price * 100).toFixed(1);
  const bearReturn = ((lowTarget - price) / price * 100).toFixed(1);
  const bullProb = Math.min(Math.max(probability, 25), 75);
  const bearProb = 100 - bullProb;

  return (
    <div className="mb-5" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
      <h2 className="text-[0.95rem] font-bold mb-3 font-display flex items-center gap-2" style={{ color: "#1e293b" }}>
        ⚖️ {t.title}
      </h2>

      <div className="grid grid-cols-2 gap-0 rounded-sm overflow-hidden" style={{ border: "0.5pt solid #d1d5db" }}>
        {/* Bull Case */}
        <div className="p-4" style={{ backgroundColor: "#f0fdf4", borderRight: "0.5pt solid #d1d5db" }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5" style={{ color: "#006633" }} />
            <h3 className="font-bold text-[0.9rem] font-display" style={{ color: "#006633" }}>
              {t.bullCase}
            </h3>
          </div>

          <div className="mb-3 p-2.5 rounded-sm bg-white" style={{ border: "0.5pt solid #bbf7d0" }}>
            <p className="text-[0.65rem] uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>{t.targetPrice}</p>
            <p className="font-bold text-[1.1rem] tabular-nums" style={{ color: "#006633" }}>{sym}{highTarget.toFixed(2)}</p>
            <p className="text-[0.75rem] mt-0.5" style={{ color: "#15803d" }}>{t.impliedReturn}: +{bullReturn}%</p>
          </div>

          <p className="text-[0.7rem] font-semibold mb-1.5" style={{ color: "#334155" }}>{t.catalysts}:</p>
          <ul className="space-y-1">
            {t.bullCatalysts.map((item, i) => (
              <li key={i} className="text-[0.7rem] leading-snug flex items-start gap-1.5" style={{ color: "#475569" }}>
                <span style={{ color: "#006633" }}>▸</span> {item}
              </li>
            ))}
          </ul>

          <div className="mt-3 pt-2" style={{ borderTop: "0.5pt solid #bbf7d0" }}>
            <p className="text-[0.65rem]" style={{ color: "#64748b" }}>{t.probability}: <span className="font-bold" style={{ color: "#006633" }}>{bullProb}%</span></p>
          </div>
        </div>

        {/* Bear Case */}
        <div className="p-4" style={{ backgroundColor: "#fef2f2" }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5" style={{ color: "#cc0000" }} />
            <h3 className="font-bold text-[0.9rem] font-display" style={{ color: "#cc0000" }}>
              {t.bearCase}
            </h3>
          </div>

          <div className="mb-3 p-2.5 rounded-sm bg-white" style={{ border: "0.5pt solid #fecaca" }}>
            <p className="text-[0.65rem] uppercase tracking-wider mb-1" style={{ color: "#94a3b8" }}>{t.targetPrice}</p>
            <p className="font-bold text-[1.1rem] tabular-nums" style={{ color: "#cc0000" }}>{sym}{lowTarget.toFixed(2)}</p>
            <p className="text-[0.75rem] mt-0.5" style={{ color: "#dc2626" }}>{t.impliedReturn}: {bearReturn}%</p>
          </div>

          <p className="text-[0.7rem] font-semibold mb-1.5" style={{ color: "#334155" }}>{t.risks}:</p>
          <ul className="space-y-1">
            {t.bearRisks.map((item, i) => (
              <li key={i} className="text-[0.7rem] leading-snug flex items-start gap-1.5" style={{ color: "#475569" }}>
                <span style={{ color: "#cc0000" }}>▸</span> {item}
              </li>
            ))}
          </ul>

          <div className="mt-3 pt-2" style={{ borderTop: "0.5pt solid #fecaca" }}>
            <p className="text-[0.65rem]" style={{ color: "#64748b" }}>{t.probability}: <span className="font-bold" style={{ color: "#cc0000" }}>{bearProb}%</span></p>
          </div>
        </div>
      </div>

      {/* Footnote */}
      <div className="mt-2 flex items-center gap-1.5">
        <Shield className="w-3 h-3" style={{ color: "#94a3b8" }} />
        <p className="text-[0.6rem] italic font-body" style={{ color: "#94a3b8" }}>{t.footer}</p>
      </div>
    </div>
  );
}
