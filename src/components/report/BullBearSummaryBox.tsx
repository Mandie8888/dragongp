import { useLanguage } from "@/contexts/LanguageContext";

interface BullBearSummaryBoxProps {
  ticker: string;
  name: string;
  rsi: number;
  probability: number;
  market: string;
  sector?: string | null;
}

interface CasePoints {
  bull: string[];
  bear: string[];
}

// Ticker-specific insights for well-known stocks
const tickerCases: Record<string, { en: CasePoints; "zh-TW": CasePoints; "zh-CN": CasePoints }> = {
  NVDA: {
    en: { bull: ["Dominant AI/GPU market share with expanding moat", "Data Center revenue accelerating on enterprise AI adoption", "Strong pricing power with limited competition"], bear: ["Elevated valuation multiples vs. historical averages", "Potential export restrictions to key markets (China)", "Cyclical risk if AI capex spending decelerates"] },
    "zh-TW": { bull: ["AI/GPU 市場主導地位持續擴大護城河", "企業 AI 採用推動數據中心收入加速增長", "競爭有限，定價能力強勁"], bear: ["估值倍數遠高於歷史均值", "對重要市場（中國）的出口限制風險", "若 AI 資本支出放緩存在週期性風險"] },
    "zh-CN": { bull: ["AI/GPU 市场主导地位持续扩大护城河", "企业 AI 采用推动数据中心收入加速增长", "竞争有限，定价能力强劲"], bear: ["估值倍数远高于历史均值", "对重要市场（中国）的出口限制风险", "若 AI 资本支出放缓存在周期性风险"] },
  },
  TSLA: {
    en: { bull: ["EV market leader with global Gigafactory scale", "Autonomous driving & energy storage optionality", "Brand loyalty and vertical integration advantages"], bear: ["Intense EV competition eroding market share", "Margin pressure from price cuts and incentives", "Regulatory and leadership concentration risk"] },
    "zh-TW": { bull: ["全球超級工廠規模的電動車市場領導者", "自動駕駛與儲能業務的期權價值", "品牌忠誠度與垂直整合優勢"], bear: ["激烈的電動車競爭侵蝕市場份額", "降價和補貼帶來利潤率壓力", "監管風險與管理層集中風險"] },
    "zh-CN": { bull: ["全球超级工厂规模的电动车市场领导者", "自动驾驶与储能业务的期权价值", "品牌忠诚度与垂直整合优势"], bear: ["激烈的电动车竞争侵蚀市场份额", "降价和补贴带来利润率压力", "监管风险与管理层集中风险"] },
  },
  AAPL: {
    en: { bull: ["Unrivaled ecosystem lock-in with 2B+ active devices", "Services revenue growing at double-digit rates", "Massive buyback program supports EPS growth"], bear: ["iPhone upgrade cycle elongation risk", "Regulatory pressure on App Store fees globally", "China market softness and geopolitical exposure"] },
    "zh-TW": { bull: ["20 億+活躍設備打造無可匹敵的生態系統鎖定", "服務收入以雙位數速度增長", "大規模回購計劃支撐 EPS 增長"], bear: ["iPhone 換機週期拉長風險", "全球 App Store 費用的監管壓力", "中國市場疲軟與地緣政治風險"] },
    "zh-CN": { bull: ["20 亿+活跃设备打造无可匹敌的生态系统锁定", "服务收入以双位数速度增长", "大规模回购计划支撑 EPS 增长"], bear: ["iPhone 换机周期拉长风险", "全球 App Store 费用的监管压力", "中国市场疲软与地缘政治风险"] },
  },
  MSFT: {
    en: { bull: ["Azure cloud growth fueled by AI integration", "Office 365 & Copilot driving ARPU expansion", "Diversified revenue with strong recurring income"], bear: ["Cloud margin compression from AI infrastructure costs", "Antitrust scrutiny on Activision & market dominance", "Enterprise IT spending slowdown risk"] },
    "zh-TW": { bull: ["AI 整合推動 Azure 雲端增長", "Office 365 與 Copilot 提升 ARPU", "多元化收入與強勁經常性收入"], bear: ["AI 基礎設施成本壓縮雲端利潤率", "收購動視及市場主導地位面臨反壟斷審查", "企業 IT 支出放緩風險"] },
    "zh-CN": { bull: ["AI 整合推动 Azure 云端增长", "Office 365 与 Copilot 提升 ARPU", "多元化收入与强劲经常性收入"], bear: ["AI 基础设施成本压缩云端利润率", "收购动视及市场主导地位面临反垄断审查", "企业 IT 支出放缓风险"] },
  },
  GOOGL: {
    en: { bull: ["Search dominance with AI-enhanced ad monetization", "YouTube & Cloud segments reaching profitability inflection", "Deep AI/ML research pipeline (Gemini, DeepMind)"], bear: ["DOJ antitrust ruling may force structural changes", "AI chatbots threatening traditional search market share", "Ad revenue sensitivity to macro economic cycles"] },
    "zh-TW": { bull: ["AI 增強廣告變現鞏固搜索主導地位", "YouTube 與雲端業務達到盈利拐點", "深厚的 AI/ML 研究管線（Gemini、DeepMind）"], bear: ["司法部反壟斷裁決可能迫使結構性變革", "AI 聊天機器人威脅傳統搜索市場份額", "廣告收入對宏觀經濟週期敏感"] },
    "zh-CN": { bull: ["AI 增强广告变现巩固搜索主导地位", "YouTube 与云端业务达到盈利拐点", "深厚的 AI/ML 研究管线（Gemini、DeepMind）"], bear: ["司法部反垄断裁决可能迫使结构性变革", "AI 聊天机器人威胁传统搜索市场份额", "广告收入对宏观经济周期敏感"] },
  },
  "0700.HK": {
    en: { bull: ["WeChat ecosystem monetization still in early stages", "Gaming recovery with new title pipeline", "Fintech & cloud services diversification"], bear: ["Regulatory overhang on tech sector remains", "Macro slowdown impacting ad & gaming spend", "Geopolitical tensions affecting investor sentiment"] },
    "zh-TW": { bull: ["微信生態系統變現仍處早期階段", "遊戲業務隨新作管線復甦", "金融科技與雲服務多元化"], bear: ["科技行業監管陰霾持續", "宏觀放緩影響廣告與遊戲支出", "地緣政治緊張影響投資者情緒"] },
    "zh-CN": { bull: ["微信生态系统变现仍处早期阶段", "游戏业务随新作管线复苏", "金融科技与云服务多元化"], bear: ["科技行业监管阴霾持续", "宏观放缓影响广告与游戏支出", "地缘政治紧张影响投资者情绪"] },
  },
};

// Generate generic bull/bear points from RSI and probability
function getGenericCases(ticker: string, rsi: number, probability: number, lang: "en" | "zh-TW" | "zh-CN"): CasePoints {
  if (lang === "zh-TW") {
    return {
      bull: [
        rsi < 45 ? "技術面顯示超賣反彈潛力" : "近期價格動能保持正向趨勢",
        probability >= 50 ? `AI 模型預測 ${probability}% 上漲概率，偏多信號` : "市場情緒改善可能帶動估值重估",
        "行業輪動或催化劑可觸發上行突破",
      ],
      bear: [
        rsi > 60 ? "RSI 偏高暗示短期回調壓力" : "缺乏明確方向性催化劑",
        "宏觀不確定性與利率環境構成逆風",
        probability < 50 ? `僅 ${probability}% 上漲概率反映偏空風險` : "估值擴張空間有限",
      ],
    };
  }
  if (lang === "zh-CN") {
    return {
      bull: [
        rsi < 45 ? "技术面显示超卖反弹潜力" : "近期价格动能保持正向趋势",
        probability >= 50 ? `AI 模型预测 ${probability}% 上涨概率，偏多信号` : "市场情绪改善可能带动估值重估",
        "行业轮动或催化剂可触发上行突破",
      ],
      bear: [
        rsi > 60 ? "RSI 偏高暗示短期回调压力" : "缺乏明确方向性催化剂",
        "宏观不确定性与利率环境构成逆风",
        probability < 50 ? `仅 ${probability}% 上涨概率反映偏空风险` : "估值扩张空间有限",
      ],
    };
  }
  return {
    bull: [
      rsi < 45 ? "Technical setup shows oversold rebound potential" : "Recent price momentum sustaining positive trend",
      probability >= 50 ? `AI model projects ${probability}% upside probability — bullish bias` : "Improving sentiment could trigger valuation re-rating",
      "Sector rotation or earnings catalyst may spark upside breakout",
    ],
    bear: [
      rsi > 60 ? "Elevated RSI suggests near-term pullback pressure" : "Lack of clear directional catalyst",
      "Macro uncertainty and rate environment pose headwinds",
      probability < 50 ? `Only ${probability}% upside probability reflects bearish skew` : "Limited room for further valuation expansion",
    ],
  };
}

export function BullBearSummaryBox({ ticker, rsi, probability, market }: BullBearSummaryBoxProps) {
  const { language } = useLanguage();
  const lang = language === "zh-TW" ? "zh-TW" : language === "zh-CN" ? "zh-CN" : "en";

  const titleLabels = {
    en: { bull: "🐂 Bull Case", bear: "🐻 Bear Case" },
    "zh-TW": { bull: "🐂 多頭論點", bear: "🐻 空頭論點" },
    "zh-CN": { bull: "🐂 多头论点", bear: "🐻 空头论点" },
  };
  const t = titleLabels[lang];

  const specific = tickerCases[ticker];
  const cases: CasePoints = specific ? specific[lang] : getGenericCases(ticker, rsi, probability, lang);

  return (
    <div className="mb-4 page-break-avoid" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
      <div className="grid grid-cols-2 gap-0 rounded-sm overflow-hidden" style={{ border: "0.5pt solid #d1d5db" }}>
        {/* Bull Case */}
        <div className="p-3" style={{ backgroundColor: "#f0fdf4", borderRight: "0.5pt solid #d1d5db" }}>
          <h3 className="font-bold text-[0.8rem] mb-2 font-display" style={{ color: "#006633" }}>
            {t.bull}
          </h3>
          <ul className="space-y-1.5">
            {cases.bull.map((point, i) => (
              <li key={i} className="text-[0.72rem] leading-snug flex items-start gap-1.5 font-body" style={{ color: "#000000" }}>
                <span className="mt-0.5 flex-shrink-0" style={{ color: "#006633" }}>▸</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Bear Case */}
        <div className="p-3" style={{ backgroundColor: "#fef2f2" }}>
          <h3 className="font-bold text-[0.8rem] mb-2 font-display" style={{ color: "#cc0000" }}>
            {t.bear}
          </h3>
          <ul className="space-y-1.5">
            {cases.bear.map((point, i) => (
              <li key={i} className="text-[0.72rem] leading-snug flex items-start gap-1.5 font-body" style={{ color: "#000000" }}>
                <span className="mt-0.5 flex-shrink-0" style={{ color: "#cc0000" }}>▸</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
