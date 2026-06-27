import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { MarketDataSummary } from "./MarketDataSummary";
import { VitalsBadge } from "./VitalsBadge";
import { CompactProbabilityDial } from "./CompactProbabilityDial";
import { StrategicVerdictCard } from "./StrategicVerdictCard";
import { Shield } from "lucide-react";
import { MarketType } from "./StockSearchBar";

interface ReportData {
  marketData: {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: string;
    high: number;
    low: number;
    companyName?: string;
    exchange?: string;
    currency?: string;
  };
  technicals: {
    rsi: number;
    macd: number;
    macdSignal: number;
    macdHistogram: number;
  };
  analysis: {
    probability: number;
    direction: "bullish" | "bearish" | "neutral";
    summary: string;
  };
}

interface AIReportCardProps {
  data: ReportData;
  loading?: boolean;
  generatedAt?: Date;
  market?: MarketType;
}

export function AIReportCard({ data, loading, generatedAt, market = "US" }: AIReportCardProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      vitalsTitle: "Technical Vitals",
      generatedAt: "Generated",
      disclaimer: "Educational purposes only. Not financial advice.",
    },
    tc: {
      vitalsTitle: "技術指標",
      generatedAt: "生成於",
      disclaimer: "僅供教育之用。不構成財務建議。",
    },
    sc: {
      vitalsTitle: "技术指标",
      generatedAt: "生成于",
      disclaimer: "仅供教育之用。不构成财务建议。",
    },
  };

  const t = content[language === "zh-TW" ? "tc" : language === "zh-CN" ? "sc" : "en"] || content.en;

  return (
    <div className="space-y-3">
      {/* Single Screen Dashboard Card */}
      <Card className="bg-[#1E293B] border border-[#334155] shadow-lg overflow-hidden">
        <CardContent className="p-4">
          {/* Top Row: Market Data */}
          <div className="mb-3">
            <MarketDataSummary data={data.marketData} loading={loading} market={market} />
          </div>

          {/* Vitals Badges Row */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#334155]">
            <span className="text-xs font-medium text-[#94A3B8]">{t.vitalsTitle}:</span>
            <VitalsBadge 
              type="rsi" 
              rsiValue={data.technicals.rsi} 
              loading={loading} 
            />
            <VitalsBadge 
              type="macd" 
              macdHistogram={data.technicals.macdHistogram} 
              loading={loading} 
            />
          </div>

          {/* Main Content: Probability Dial (Left) + Strategic Verdict (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-start">
            {/* Left: Compact Probability Dial */}
            <div className="flex justify-center md:justify-start">
              <CompactProbabilityDial
                probability={data.analysis.probability}
                direction={data.analysis.direction}
                loading={loading}
              />
            </div>

            {/* Right: Strategic Verdict (Most Important) */}
            <div className="flex-1">
              <StrategicVerdictCard
                summary={data.analysis.summary}
                direction={data.analysis.direction}
                probability={data.analysis.probability}
                rsi={data.technicals.rsi}
                macdHistogram={data.technicals.macdHistogram}
                loading={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer with timestamp and disclaimer - Compact */}
      <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
        {generatedAt && (
          <span>{t.generatedAt}: {generatedAt.toLocaleTimeString()}</span>
        )}
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>{t.disclaimer}</span>
        </div>
      </div>
    </div>
  );
}
