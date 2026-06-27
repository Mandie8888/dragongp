import { useLanguage } from "@/contexts/LanguageContext";

interface SectorContextProps {
  ticker: string;
  market: string;
  sector?: string | null;
  industry?: string | null;
}

// Map common tickers to sectors/industries for a professional look
const sectorMap: Record<string, { sector: string; industry: string; sectorTc: string; industryTc: string; sectorSc: string; industrySc: string }> = {
  AAPL: { sector: "Technology", industry: "Consumer Electronics", sectorTc: "科技", industryTc: "消費電子", sectorSc: "科技", industrySc: "消费电子" },
  MSFT: { sector: "Technology", industry: "Software — Infrastructure", sectorTc: "科技", industryTc: "軟件基建", sectorSc: "科技", industrySc: "软件基建" },
  GOOGL: { sector: "Communication Services", industry: "Internet Content & Information", sectorTc: "通訊服務", industryTc: "互聯網內容與資訊", sectorSc: "通讯服务", industrySc: "互联网内容与资讯" },
  AMZN: { sector: "Consumer Cyclical", industry: "Internet Retail", sectorTc: "可選消費", industryTc: "互聯網零售", sectorSc: "可选消费", industrySc: "互联网零售" },
  TSLA: { sector: "Consumer Cyclical", industry: "Auto Manufacturers", sectorTc: "可選消費", industryTc: "汽車製造", sectorSc: "可选消费", industrySc: "汽车制造" },
  NVDA: { sector: "Technology", industry: "Semiconductors", sectorTc: "科技", industryTc: "半導體", sectorSc: "科技", industrySc: "半导体" },
  META: { sector: "Communication Services", industry: "Social Media", sectorTc: "通訊服務", industryTc: "社交媒體", sectorSc: "通讯服务", industrySc: "社交媒体" },
  JPM: { sector: "Financials", industry: "Diversified Banks", sectorTc: "金融", industryTc: "綜合銀行", sectorSc: "金融", industrySc: "综合银行" },
  AMD: { sector: "Technology", industry: "Semiconductors", sectorTc: "科技", industryTc: "半導體", sectorSc: "科技", industrySc: "半导体" },
  IONQ: { sector: "Technology", industry: "Quantum Computing", sectorTc: "科技", industryTc: "量子計算", sectorSc: "科技", industrySc: "量子计算" },
  PLTR: { sector: "Technology", industry: "Software — Application", sectorTc: "科技", industryTc: "應用軟件", sectorSc: "科技", industrySc: "应用软件" },
  RIVN: { sector: "Consumer Cyclical", industry: "Auto Manufacturers", sectorTc: "可選消費", industryTc: "汽車製造", sectorSc: "可选消费", industrySc: "汽车制造" },
  SNOW: { sector: "Technology", industry: "Software — Application", sectorTc: "科技", industryTc: "應用軟件", sectorSc: "科技", industrySc: "应用软件" },
  COIN: { sector: "Financials", industry: "Financial Data & Exchanges", sectorTc: "金融", industryTc: "金融數據與交易所", sectorSc: "金融", industrySc: "金融数据与交易所" },
  CRWD: { sector: "Technology", industry: "Cybersecurity", sectorTc: "科技", industryTc: "網絡安全", sectorSc: "科技", industrySc: "网络安全" },
  NIO: { sector: "Consumer Cyclical", industry: "Auto Manufacturers", sectorTc: "可選消費", industryTc: "汽車製造", sectorSc: "可选消费", industrySc: "汽车制造" },
  BABA: { sector: "Consumer Cyclical", industry: "Internet Retail", sectorTc: "可選消費", industryTc: "互聯網零售", sectorSc: "可选消费", industrySc: "互联网零售" },
  TSM: { sector: "Technology", industry: "Semiconductors", sectorTc: "科技", industryTc: "半導體", sectorSc: "科技", industrySc: "半导体" },
  "0005.HK": { sector: "Financials", industry: "Diversified Banks", sectorTc: "金融", industryTc: "綜合銀行", sectorSc: "金融", industrySc: "综合银行" },
  "0700.HK": { sector: "Communication Services", industry: "Internet Content & Information", sectorTc: "通訊服務", industryTc: "互聯網內容與資訊", sectorSc: "通讯服务", industrySc: "互联网内容与资讯" },
  "9988.HK": { sector: "Consumer Cyclical", industry: "Internet Retail", sectorTc: "可選消費", industryTc: "互聯網零售", sectorSc: "可选消费", industrySc: "互联网零售" },
  "2330.TW": { sector: "Technology", industry: "Semiconductors", sectorTc: "科技", industryTc: "半導體", sectorSc: "科技", industrySc: "半导体" },
};

const defaultSector = { sector: "Equities", industry: "General", sectorTc: "股票", industryTc: "綜合", sectorSc: "股票", industrySc: "综合" };

export function SectorContext({ ticker, market, sector: apiSector, industry: apiIndustry }: SectorContextProps) {
  const { language } = useLanguage();
  const mapped = sectorMap[ticker] || sectorMap[ticker.toUpperCase()];

  // Use API data first, then fallback to map, then default
  const sectorName = apiSector || (mapped ? (language === "zh-TW" ? mapped.sectorTc : language === "zh-CN" ? mapped.sectorSc : mapped.sector) : defaultSector.sector);
  const industryName = apiIndustry || (mapped ? (language === "zh-TW" ? mapped.industryTc : language === "zh-CN" ? mapped.industrySc : mapped.industry) : defaultSector.industry);

  const labels = {
    en: { sector: "Sector", industry: "Industry", exchange: "Exchange" },
    "zh-TW": { sector: "板塊", industry: "行業", exchange: "交易所" },
    "zh-CN": { sector: "板块", industry: "行业", exchange: "交易所" },
  };

  const exchangeMap: Record<string, string> = {
    US: "NYSE / NASDAQ",
    HK: "HKEX",
    TW: "TWSE",
  };

  const lang = language === "zh-TW" ? "zh-TW" : language === "zh-CN" ? "zh-CN" : "en";
  const t = labels[lang];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4 text-[0.8rem] font-body" style={{ color: "#64748b" }}>
      <span>
        <span className="font-semibold" style={{ color: "#1e293b" }}>{t.sector}:</span>{" "}
        {sectorName}
      </span>
      <span className="text-[#cbd5e1]">|</span>
      <span>
        <span className="font-semibold" style={{ color: "#1e293b" }}>{t.industry}:</span>{" "}
        {industryName}
      </span>
      <span className="text-[#cbd5e1]">|</span>
      <span>
        <span className="font-semibold" style={{ color: "#1e293b" }}>{t.exchange}:</span>{" "}
        {exchangeMap[market] || market}
      </span>
    </div>
  );
}
