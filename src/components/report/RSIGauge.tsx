import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RSIGaugeProps {
  value: number;
  loading?: boolean;
}

export function RSIGauge({ value, loading }: RSIGaugeProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "RSI Indicator",
      oversold: "Oversold",
      neutral: "Neutral",
      overbought: "Overbought",
    },
    tc: {
      title: "RSI 指標",
      oversold: "超賣",
      neutral: "中性",
      overbought: "超買",
    },
    sc: {
      title: "RSI 指标",
      oversold: "超卖",
      neutral: "中性",
      overbought: "超买",
    },
  };

  const t = content[language === "zh-TW" ? "tc" : language === "zh-CN" ? "sc" : "en"] || content.en;

  const { zone, zoneColor, rotation } = useMemo(() => {
    // RSI ranges: 0-30 Oversold, 30-70 Neutral, 70-100 Overbought
    let zone: string;
    let zoneColor: string;
    
    if (value <= 30) {
      zone = t.oversold;
      zoneColor = "text-green-400";
    } else if (value >= 70) {
      zone = t.overbought;
      zoneColor = "text-dragon";
    } else {
      zone = t.neutral;
      zoneColor = "text-gold";
    }

    // Map RSI (0-100) to rotation (-90 to 90 degrees)
    const rotation = (value / 100) * 180 - 90;

    return { zone, zoneColor, rotation };
  }, [value, t]);

  if (loading) {
    return (
      <div className="flex flex-col items-center p-6">
        <div className="w-32 h-16 bg-muted/30 rounded-t-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center print-rsi-gauge">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 print:text-red-700 print:font-bold">{t.title}</h3>
      
      {/* Semi-circular gauge */}
      <div className="relative w-40 h-20 overflow-hidden">
        {/* Background arc */}
        <div className="absolute inset-0">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="rsiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(142, 76%, 56%)" />
                <stop offset="30%" stopColor="hsl(38, 92%, 50%)" />
                <stop offset="70%" stopColor="hsl(38, 92%, 50%)" />
                <stop offset="100%" stopColor="hsl(12, 85%, 55%)" />
              </linearGradient>
              <linearGradient id="rsiGradientPrint" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#15803d" />
                <stop offset="50%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#b91c1c" />
              </linearGradient>
            </defs>
            
            {/* Gauge arc background */}
            <path
              d="M 5 50 A 45 45 0 0 1 95 50"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              strokeLinecap="round"
              className="print:stroke-gray-300"
            />
            
            {/* Gauge arc colored */}
            <path
              d="M 5 50 A 45 45 0 0 1 95 50"
              fill="none"
              stroke="url(#rsiGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(value / 100) * 141.4} 141.4`}
              className="transition-all duration-1000 ease-out print:stroke-red-600"
            />
          </svg>
        </div>
        
        {/* Needle - MUCH LARGER and BRIGHT RED for Print visibility */}
        <div 
          className="absolute bottom-0 left-1/2 origin-bottom transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        >
          <div className="w-1 h-14 bg-foreground rounded-full print:bg-red-600 print:w-2 print:h-16" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-foreground print:bg-red-600 print:w-6 print:h-6 print:border-2 print:border-red-800" />
        </div>
      </div>

      {/* Value and zone */}
      <div className="mt-4 text-center">
        <p className="text-3xl font-bold text-foreground print:text-gray-900 print:font-extrabold">{value.toFixed(1)}</p>
        <p className={`text-sm font-medium ${zoneColor} print:text-gray-800 print:font-bold`}>{zone}</p>
      </div>

      {/* Zone labels */}
      <div className="flex justify-between w-full mt-2 px-2">
        <span className="text-xs text-green-400 print:text-gray-600">0</span>
        <span className="text-xs text-gold print:text-gray-600">50</span>
        <span className="text-xs text-dragon print:text-gray-600">100</span>
      </div>
    </div>
  );
}
