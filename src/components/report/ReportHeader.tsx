import dragonLogo from "@/assets/dragon-ai-logo-2.png";
import yearOfHorse from "@/assets/year-of-horse-2.png";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReportHeaderProps {
  ticker: string;
  companyName: string;
  date: string;
}

const headerTranslations = {
  en: {
    brand: "DragonGp.Ai",
    subtitle: "Equity Research Report",
    yearOfHorse: "Year of Horse — Brings Fortune",
  },
  "zh-TW": {
    brand: "DragonGp.Ai",
    subtitle: "股票研究報告",
    yearOfHorse: "馬年 — 馬到成功",
  },
  "zh-CN": {
    brand: "DragonGp.Ai",
    subtitle: "股票研究报告",
    yearOfHorse: "马年 — 马到成功",
  },
};

export function ReportHeader({ ticker, companyName, date }: ReportHeaderProps) {
  const { language } = useLanguage();
  const t = headerTranslations[language] || headerTranslations.en;

  return (
    <div className="pb-4 mb-6 border-b-2 border-[#1e293b]">
      {/* Top Row: Logo + Brand | Ticker */}
      <div className="flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3">
          <img src={dragonLogo} alt="DragonGp.Ai" className="w-[90px] h-[90px] object-contain" />
          <div>
            <h1 className="text-lg font-bold tracking-wide font-display" style={{ color: "#1e293b" }}>
              {t.brand}
            </h1>
            <p className="text-[0.65rem] text-[#64748b] tracking-widest uppercase font-body">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Ticker + Date */}
        <div className="text-right">
          <p className="text-base font-bold font-display" style={{ color: "#1e293b" }}>
            {ticker}
          </p>
          <p className="text-xs text-[#64748b] font-body">
            {companyName}
          </p>
          <p className="text-[0.65rem] text-[#94a3b8] mt-0.5 font-body">
            {date}
          </p>
        </div>
      </div>

      {/* Year of Horse Banner - between header and stock info */}
      <div className="flex items-center justify-center gap-3 mt-3 py-2 bg-gradient-to-r from-[#fef3c7] via-[#fde68a] to-[#fef3c7] rounded-lg border border-[#d4af37]/30">
        <img src={yearOfHorse} alt={t.yearOfHorse} className="w-12 h-12 object-cover rounded-full border border-[#d4af37] shadow-sm" />
        <p className="text-sm font-bold tracking-wide font-display" style={{ color: "#92400e" }}>
          {t.yearOfHorse}
        </p>
        <img src={yearOfHorse} alt="" className="w-12 h-12 object-cover rounded-full border border-[#d4af37] shadow-sm" />
      </div>
    </div>
  );
}
