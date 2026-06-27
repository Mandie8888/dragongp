import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, Globe, Building2, Cpu, Gauge } from "lucide-react";

interface InvestmentRiskDisclosureProps {
  ticker: string;
  rsi: number;
  probability: number;
  direction: "buy" | "hold" | "sell";
  price?: number;
  high52Week?: number;
  low52Week?: number;
}

// Ticker-specific risk generators
function getTickerSpecificRisks(ticker: string, lang: "en" | "zh-TW" | "zh-CN") {
  const upper = ticker.toUpperCase();
  const risks: Record<"en" | "zh-TW" | "zh-CN", { market: string[]; company: string[] }> = {
    en: { market: [], company: [] },
    "zh-TW": { market: [], company: [] },
    "zh-CN": { market: [], company: [] },
  };

  // NVDA / Semiconductors
  if (upper.includes("NVDA") || upper.includes("AMD") || upper.includes("TSM") || upper.includes("2330")) {
    risks.en.company = [
      "Export restrictions on AI chips to certain regions could significantly impact revenue growth.",
      "Supply chain disruptions (e.g., foundry delays, rare materials shortages) may cause production bottlenecks.",
      "The semiconductor industry is cyclical — periods of oversupply can lead to sharp margin compression.",
    ];
    risks["zh-TW"].company = [
      "AI 晶片出口管制可能大幅影響營收成長。",
      "供應鏈中斷（如晶圓代工延遲、稀有材料短缺）可能導致生產瓶頸。",
      "半導體產業具有週期性——供過於求時期可能導致利潤大幅壓縮。",
    ];
    risks["zh-CN"].company = [
      "AI 芯片出口管制可能大幅影响营收增长。",
      "供应链中断（如晶圆代工延迟、稀有材料短缺）可能导致生产瓶颈。",
      "半导体产业具有周期性——供过于求时期可能导致利润大幅压缩。",
    ];
  }

  // HSBC / HK Banks
  if (upper.includes("0005") || upper.includes("HSBC") || upper.includes("0011") || upper.includes("0939") || upper.includes("1398")) {
    risks.en.company = [
      "Interest rate changes directly affect Net Interest Margin (NIM) — this is the difference between what a bank earns on loans vs. what it pays on deposits. Rate cuts shrink this margin.",
      "Global geopolitical tensions (especially cross-border sanctions) can disrupt international banking operations and settlement flows.",
      "Credit quality deterioration in commercial real estate or emerging markets could lead to higher loan loss provisions.",
    ];
    risks["zh-TW"].company = [
      "利率變化直接影響淨利息收益率（NIM）——即銀行貸款收入與存款支出之差。降息會壓縮此利差。",
      "全球地緣政治緊張局勢（尤其跨境制裁）可能干擾國際銀行業務與結算流程。",
      "商業不動產或新興市場的信用品質惡化可能導致貸款損失準備金增加。",
    ];
    risks["zh-CN"].company = [
      "利率变化直接影响净利息收益率（NIM）——即银行贷款收入与存款支出之差。降息会压缩此利差。",
      "全球地缘政治紧张局势（尤其跨境制裁）可能干扰国际银行业务与结算流程。",
      "商业不动产或新兴市场的信用质量恶化可能导致贷款损失准备金增加。",
    ];
  }

  // Tencent / Tech
  if (upper.includes("0700") || upper.includes("9988") || upper.includes("BABA") || upper.includes("3690") || upper.includes("9618")) {
    risks.en.company = [
      "Regulatory crackdowns on internet platforms (antitrust, data privacy) can trigger sudden valuation de-ratings.",
      "Slowing consumer spending in the domestic market may impact advertising and e-commerce revenues.",
      "Geopolitical tensions could lead to forced divestitures or restrictions on international operations.",
    ];
    risks["zh-TW"].company = [
      "對互聯網平台的監管打壓（反壟斷、數據隱私）可能觸發估值突然下修。",
      "國內消費支出放緩可能影響廣告和電商收入。",
      "地緣政治緊張可能導致被迫剝離資產或國際業務受限。",
    ];
    risks["zh-CN"].company = [
      "对互联网平台的监管打压（反垄断、数据隐私）可能触发估值突然下修。",
      "国内消费支出放缓可能影响广告和电商收入。",
      "地缘政治紧张可能导致被迫剥离资产或国际业务受限。",
    ];
  }

  // AAPL / Consumer Tech
  if (upper.includes("AAPL")) {
    risks.en.company = [
      "iPhone sales concentration risk — any product cycle miss could sharply impact quarterly revenue.",
      "App Store regulatory challenges (forced sideloading, fee reductions) threaten high-margin services revenue.",
      "China manufacturing dependency creates vulnerability to trade tensions and supply disruptions.",
    ];
    risks["zh-TW"].company = [
      "iPhone 銷售集中風險——任何產品週期失誤都可能嚴重影響季度營收。",
      "App Store 監管挑戰（強制側載、費用降低）威脅高利潤的服務收入。",
      "中國製造依賴使其面臨貿易摩擦及供應中斷風險。",
    ];
    risks["zh-CN"].company = [
      "iPhone 销售集中风险——任何产品周期失误都可能严重影响季度营收。",
      "App Store 监管挑战（强制侧载、费用降低）威胁高利润的服务收入。",
      "中国制造依赖使其面临贸易摩擦及供应中断风险。",
    ];
  }

  return risks[lang];
}

export function InvestmentRiskDisclosure({ ticker, rsi, probability, direction, price, high52Week, low52Week }: InvestmentRiskDisclosureProps) {
  const { language } = useLanguage();
  const lang = language === "zh-TW" ? "zh-TW" : language === "zh-CN" ? "zh-CN" : "en";

  // Calculate volatility index from 52-week range
  const volatilityIndex = (price && high52Week && low52Week && high52Week > 0)
    ? ((high52Week - low52Week) / ((high52Week + low52Week) / 2)) * 100
    : (rsi > 70 || rsi < 30 ? 55 : 30); // fallback from RSI

  type RiskLevel = "conservative" | "growth" | "high-risk";
  const riskLevel: RiskLevel = volatilityIndex < 25 ? "conservative" : volatilityIndex < 50 ? "growth" : "high-risk";

  const riskMeter = {
    en: {
      title: "Risk Level Meter",
      conservative: "Conservative",
      growth: "Growth",
      "high-risk": "High Risk",
      advice: {
        conservative: "This stock exhibits low volatility — suitable as a core portfolio holding with standard position sizing.",
        growth: "Moderate volatility detected — consider limiting to 10-15% of total portfolio allocation.",
        "high-risk": "High volatility stock — recommend limiting exposure to no more than 5% of total portfolio.",
      },
    },
    "zh-TW": {
      title: "風險等級計量表",
      conservative: "穩健型",
      growth: "成長型",
      "high-risk": "高風險型",
      advice: {
        conservative: "本標的波動性低——適合作為核心持倉，可採用標準倉位配置。",
        growth: "偵測到中等波動——建議佔總倉位不超過 10-15%。",
        "high-risk": "本標的波動較大，建議佔總倉位不超過 5%。",
      },
    },
    "zh-CN": {
      title: "风险等级计量表",
      conservative: "稳健型",
      growth: "成长型",
      "high-risk": "高风险型",
      advice: {
        conservative: "本标的波动性低——适合作为核心持仓，可采用标准仓位配置。",
        growth: "检测到中等波动——建议占总仓位不超过 10-15%。",
        "high-risk": "本标的波动较大，建议占总仓位不超过 5%。",
      },
    },
  };

  const rm = riskMeter[lang];
  const meterColors: Record<RiskLevel, { bg: string; border: string; text: string; bar: string }> = {
    conservative: { bg: "#f0fdf4", border: "#86efac", text: "#166534", bar: "#22c55e" },
    growth: { bg: "#fffbeb", border: "#fcd34d", text: "#92400e", bar: "#f59e0b" },
    "high-risk": { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b", bar: "#ef4444" },
  };
  const mc = meterColors[riskLevel];

  const tickerRisks = getTickerSpecificRisks(ticker, lang);

  const content = {
    en: {
      title: "Investment Risk Assessment",
      marketRiskTitle: "Market Risk",
      marketRiskDesc: "Broad factors affecting the entire market",
      companyRiskTitle: "Company-Specific Risk",
      companyRiskDesc: "Risks unique to this stock or its sector",
      modelRiskTitle: "AI Model Limitations",
      modelRiskDesc: "Understanding what the AI can and cannot do",
      marketRisks: [
        `Broad market selloffs (sometimes called "corrections") can drag down even strong stocks — when the overall market drops 10%+, most individual stocks fall regardless of their fundamentals.`,
        `Unexpected extreme events (often called "black swan events" — think of unpredictable shocks like a pandemic or financial crisis) can cause sudden, severe price drops that no model can foresee.`,
        `Central bank interest rate decisions affect all asset classes. Rate hikes make borrowing more expensive for companies and can push investors away from stocks toward safer bonds.`,
      ],
      companyRisks: tickerRisks.company.length > 0 ? tickerRisks.company : [
        `Earnings surprises — if the company reports profits or revenue significantly below analyst expectations, the stock price can drop sharply in a single day.`,
        `Management changes, accounting irregularities, or unexpected lawsuits can create sudden negative sentiment that technical models cannot anticipate.`,
        `Competitive disruption from new market entrants or technology shifts may erode the company's market position over time.`,
      ],
      modelRisks: [
        `Data lag: The AI model uses historical price data and technical indicators (RSI: ${rsi.toFixed(1)}, MACD). These are backward-looking — they tell you what HAS happened, not what WILL happen.`,
        `The ${probability}% probability score is a mathematical calculation, not a profit guarantee. Think of it as a weather forecast — it gives you odds, but the actual outcome can differ.`,
        `The model does not read news, earnings reports, or insider filings. A major announcement after market close can completely change the picture overnight.`,
      ],
      disclaimer: "Principle of Self-Decision",
      disclaimerText: "AI scores are mathematical estimates derived from public market data. They are NOT buy/sell orders, profit guarantees, or professional financial advice. You — and only you — are responsible for your own investment decisions. Always consult a licensed financial advisor before committing capital.",
    },
    "zh-TW": {
      title: "投資風險評估",
      marketRiskTitle: "市場風險",
      marketRiskDesc: "影響整體市場的廣泛因素",
      companyRiskTitle: "個股風險",
      companyRiskDesc: "此股票或其行業特有的風險",
      modelRiskTitle: "AI 模型限制",
      modelRiskDesc: "了解 AI 能做什麼與不能做什麼",
      marketRisks: [
        `大盤拋售（有時稱為「修正」）即使是強勢股也會被拖累——當整體市場下跌 10% 以上時，大多數個股都會下跌，無論其基本面多好。`,
        `無法預測的極端市場意外（常稱為「黑天鵝事件」——例如疫情或金融危機等不可預見的衝擊）可能導致突然且嚴重的價格暴跌，任何模型都無法預見。`,
        `央行利率決策影響所有資產類別。升息使企業借貸成本增加，並可能促使投資者從股票轉向較安全的債券。`,
      ],
      companyRisks: tickerRisks.company.length > 0 ? tickerRisks.company : [
        `業績驚嚇——若公司公佈的利潤或營收大幅低於分析師預期，股價可能在單日內急跌。`,
        `管理層變動、會計違規或突發訴訟可能引發突然的負面情緒，技術模型無法預判。`,
        `來自新進競爭者或技術變革的顛覆性競爭，可能逐步侵蝕公司的市場地位。`,
      ],
      modelRisks: [
        `數據滯後：AI 模型使用歷史價格數據和技術指標（RSI: ${rsi.toFixed(1)}、MACD）。這些是回顧性的——它們告訴你「已經發生」什麼，而非「將要發生」什麼。`,
        `${probability}% 的概率分數是數學計算，並非獲利保證。可以把它想像成天氣預報——它給你機率，但實際結果可能不同。`,
        `模型不會閱讀新聞、財報或內部人交易申報。收盤後的重大公告可能在一夜之間完全改變局面。`,
      ],
      disclaimer: "自主決策原則",
      disclaimerText: "AI 評分是根據公開市場數據進行的數學估算。它們不是買賣指令、獲利保證或專業財務建議。您——也只有您——對自己的投資決策負責。在投入資金前，請務必諮詢持牌財務顧問。",
    },
    "zh-CN": {
      title: "投资风险评估",
      marketRiskTitle: "市场风险",
      marketRiskDesc: "影响整体市场的广泛因素",
      companyRiskTitle: "个股风险",
      companyRiskDesc: "此股票或其行业特有的风险",
      modelRiskTitle: "AI 模型限制",
      modelRiskDesc: "了解 AI 能做什么与不能做什么",
      marketRisks: [
        `大盘抛售（有时称为"修正"）即使是强势股也会被拖累——当整体市场下跌 10% 以上时，大多数个股都会下跌，无论其基本面多好。`,
        `无法预测的极端市场意外（常称为"黑天鹅事件"——例如疫情或金融危机等不可预见的冲击）可能导致突然且严重的价格暴跌，任何模型都无法预见。`,
        `央行利率决策影响所有资产类别。升息使企业借贷成本增加，并可能促使投资者从股票转向较安全的债券。`,
      ],
      companyRisks: tickerRisks.company.length > 0 ? tickerRisks.company : [
        `业绩惊吓——若公司公布的利润或营收大幅低于分析师预期，股价可能在单日内急跌。`,
        `管理层变动、会计违规或突发诉讼可能引发突然的负面情绪，技术模型无法预判。`,
        `来自新进竞争者或技术变革的颠覆性竞争，可能逐步侵蚀公司的市场地位。`,
      ],
      modelRisks: [
        `数据滞后：AI 模型使用历史价格数据和技术指标（RSI: ${rsi.toFixed(1)}、MACD）。这些是回顾性的——它们告诉你"已经发生"什么，而非"将要发生"什么。`,
        `${probability}% 的概率分数是数学计算，并非获利保证。可以把它想象成天气预报——它给你概率，但实际结果可能不同。`,
        `模型不会阅读新闻、财报或内部人交易申报。收盘后的重大公告可能在一夜之间完全改变局面。`,
      ],
      disclaimer: "自主决策原则",
      disclaimerText: "AI 评分是根据公开市场数据进行的数学估算。它们不是买卖指令、获利保证或专业财务建议。您——也只有您——对自己的投资决策负责。在投入资金前，请务必咨询持牌财务顾问。",
    },
  };

  const t = content[lang];

  const RiskCategory = ({ icon: Icon, title, desc, risks, iconColor }: { icon: typeof AlertTriangle; title: string; desc: string; risks: string[]; iconColor: string }) => (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-4 h-4 flex-shrink-0" style={{ color: iconColor }} />
        <h3 className="text-[0.85rem] font-bold font-display" style={{ color: "#1e293b" }}>{title}</h3>
      </div>
      <p className="text-[0.65rem] mb-2 ml-6" style={{ color: "#94a3b8" }}>{desc}</p>
      <ul className="space-y-1.5 ml-6">
        {risks.map((risk, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-[0.7rem] mt-0.5 flex-shrink-0" style={{ color: iconColor }}>▸</span>
            <p className="text-[0.78rem] leading-relaxed font-body" style={{ color: "#475569" }}>{risk}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div
      className="mt-5 mb-4 rounded-sm page-break-avoid overflow-hidden"
      style={{ border: "1px solid #cbd5e1", backgroundColor: "#f8fafc" }}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: "#f1f5f9", borderBottom: "1px solid #cbd5e1" }}>
        <AlertTriangle className="w-4.5 h-4.5 flex-shrink-0" style={{ color: "#dc2626" }} />
        <h2 className="text-[0.95rem] font-bold font-display" style={{ color: "#991b1b" }}>
          ⚠️ {t.title}
        </h2>
      </div>

      <div className="p-4">
        {/* Risk Level Meter */}
        <div className="mb-4 p-3 rounded-sm" style={{ backgroundColor: mc.bg, border: `1.5pt solid ${mc.border}` }}>
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-4 h-4 flex-shrink-0" style={{ color: mc.text }} />
            <h3 className="text-[0.85rem] font-bold font-display" style={{ color: mc.text }}>
              {rm.title}
            </h3>
          </div>
          {/* Visual bar */}
          <div className="flex items-center gap-2 ml-6 mb-2">
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#e2e8f0" }}>
              <div className="flex h-full">
                <div className="h-full" style={{ width: "33.3%", backgroundColor: riskLevel === "conservative" ? "#22c55e" : "#d1d5db" }} />
                <div className="h-full" style={{ width: "33.3%", backgroundColor: riskLevel === "growth" ? "#f59e0b" : "#d1d5db" }} />
                <div className="h-full" style={{ width: "33.4%", backgroundColor: riskLevel === "high-risk" ? "#ef4444" : "#d1d5db" }} />
              </div>
            </div>
            <span className="text-[0.8rem] font-bold whitespace-nowrap" style={{ color: mc.text }}>
              {rm[riskLevel]}
            </span>
          </div>
          {/* Volatility index + advice */}
          <div className="ml-6">
            <p className="text-[0.7rem] mb-1" style={{ color: "#64748b" }}>
              {lang === "en" ? "Volatility Index" : lang === "zh-TW" ? "波動指數" : "波动指数"}: {volatilityIndex.toFixed(1)}%
            </p>
            <p className="text-[0.78rem] leading-relaxed font-body" style={{ color: mc.text }}>
              💡 {rm.advice[riskLevel]}
            </p>
          </div>
        </div>

        {/* Market Risk */}
        <RiskCategory icon={Globe} title={t.marketRiskTitle} desc={t.marketRiskDesc} risks={t.marketRisks} iconColor="#2563eb" />

        {/* Company Risk */}
        <RiskCategory icon={Building2} title={t.companyRiskTitle} desc={t.companyRiskDesc} risks={t.companyRisks} iconColor="#d97706" />

        {/* AI Model Limitations */}
        <RiskCategory icon={Cpu} title={t.modelRiskTitle} desc={t.modelRiskDesc} risks={t.modelRisks} iconColor="#7c3aed" />

        {/* Self-Decision Principle */}
        <div className="mt-4 p-3 rounded-sm" style={{ backgroundColor: "#fef2f2", border: "1.5pt solid #fecaca" }}>
          <div className="flex items-center gap-2 mb-1.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "#dc2626" }} />
            <h3 className="text-[0.8rem] font-bold font-display" style={{ color: "#991b1b" }}>
              🛡️ {t.disclaimer}
            </h3>
          </div>
          <p className="text-[0.75rem] leading-relaxed font-body ml-6" style={{ color: "#7f1d1d" }}>
            {t.disclaimerText}
          </p>
        </div>
      </div>
    </div>
  );
}
