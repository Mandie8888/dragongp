import { useLanguage } from "@/contexts/LanguageContext";

interface MACDIndicatorProps {
  macd: number;
  signal: number;
  histogram: number;
  loading?: boolean;
}

export function MACDIndicator({ macd, signal, histogram, loading }: MACDIndicatorProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "MACD Indicator",
      macdLine: "MACD Line",
      signalLine: "Signal Line",
      histogram: "Histogram",
      bullish: "Bullish",
      bearish: "Bearish",
      crossover: "Crossover",
    },
    tc: {
      title: "MACD 指標",
      macdLine: "MACD 線",
      signalLine: "信號線",
      histogram: "柱狀圖",
      bullish: "看漲",
      bearish: "看跌",
      crossover: "交叉",
    },
    sc: {
      title: "MACD 指标",
      macdLine: "MACD 线",
      signalLine: "信号线",
      histogram: "柱状图",
      bullish: "看涨",
      bearish: "看跌",
      crossover: "交叉",
    },
  };

  const t = content[language === "zh-TW" ? "tc" : language === "zh-CN" ? "sc" : "en"] || content.en;

  const isBullish = histogram > 0;
  const trend = isBullish ? t.bullish : t.bearish;
  const trendColor = isBullish ? "text-green-400" : "text-dragon";

  // Normalize histogram for visual display (scale to -100 to 100)
  const normalizedHistogram = Math.max(-100, Math.min(100, histogram * 10));
  const histogramWidth = Math.abs(normalizedHistogram);

  if (loading) {
    return (
      <div className="flex flex-col items-center p-6">
        <div className="w-full h-24 bg-muted/30 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full print-macd-indicator">
      <h3 className="text-sm font-medium text-muted-foreground mb-2 print:text-red-700 print:font-extrabold print:text-base">{t.title}</h3>
      
      {/* Visual histogram bar - EVEN THICKER and BOLDER for print visibility */}
      <div className="w-full h-14 relative bg-muted/20 rounded-lg overflow-hidden print:bg-gray-50 print:border-4 print:border-red-500">
        {/* Center line - Much Thicker for print */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border print:bg-red-600 print:w-2" />
        
        {/* Histogram bar - MAXIMUM height for print visibility */}
        <div 
          className={`absolute top-1/2 -translate-y-1/2 h-10 transition-all duration-1000 ease-out rounded-sm ${
            isBullish ? "bg-green-500/80 left-1/2 print:bg-green-700" : "bg-red-500/80 right-1/2 print:bg-red-700"
          } print:h-12`}
          style={{ width: `${histogramWidth / 2}%`, minWidth: '12px' }}
        />
        
        {/* Labels - MAXIMUM BOLD for print */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-sm font-bold text-red-500 print:text-red-800 print:font-black print:text-lg">−</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-green-400 print:text-green-800 print:font-black print:text-lg">+</div>
      </div>

      {/* Values grid - Compact with HIGH CONTRAST colors */}
      <div className="grid grid-cols-3 gap-2 w-full mt-2 print:mt-1">
        <div className="text-center">
          <p className="text-[0.7rem] text-muted-foreground print:text-red-700 print:font-bold print:text-xs">{t.macdLine}</p>
          <p className="text-base font-bold text-blue-500 print:text-blue-800 print:font-extrabold">{macd.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-[0.7rem] text-muted-foreground print:text-red-700 print:font-bold print:text-xs">{t.signalLine}</p>
          <p className="text-base font-bold text-orange-500 print:text-orange-700 print:font-extrabold">{signal.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-[0.7rem] text-muted-foreground print:text-red-700 print:font-bold print:text-xs">{t.histogram}</p>
          <p className={`text-base font-bold ${trendColor} print:font-extrabold ${isBullish ? "print:text-green-700" : "print:text-red-700"}`}>{histogram.toFixed(2)}</p>
        </div>
      </div>

      {/* Trend indicator - Compact */}
      <div className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${
        isBullish ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
      } print:bg-red-100 print:text-red-800 print:border-2 print:border-red-400 print:font-extrabold`}>
        {trend}
      </div>
    </div>
  );
}
