import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProbabilityDialProps {
  probability: number;
  direction: "bullish" | "bearish" | "neutral";
  loading?: boolean;
}

export function ProbabilityDial({ probability, direction, loading }: ProbabilityDialProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Mathematical Probability Model",
      subtitle: "Cognitive Engagement Exercise",
      bullish: "Bullish Momentum",
      bearish: "Bearish Momentum",
      neutral: "Neutral / Consolidating",
      confidence: "Confidence Level",
      disclaimer: "Mathematical simulation for mental exercise only",
    },
    tc: {
      title: "數學概率模型",
      subtitle: "認知參與練習",
      bullish: "看漲動能",
      bearish: "看跌動能",
      neutral: "中性 / 整理中",
      confidence: "信心水平",
      disclaimer: "僅供心靈練習的數學模擬",
    },
    sc: {
      title: "数学概率模型",
      subtitle: "认知参与练习",
      bullish: "看涨动能",
      bearish: "看跌动能",
      neutral: "中性 / 整理中",
      confidence: "信心水平",
      disclaimer: "仅供心灵练习的数学模拟",
    },
  };

  const t = content[language === "zh-TW" ? "tc" : language === "zh-CN" ? "sc" : "en"] || content.en;

  const { directionLabel, directionColor, glowColor, strokeColor } = useMemo(() => {
    switch (direction) {
      case "bullish":
        return {
          directionLabel: t.bullish,
          directionColor: "text-green-400",
          glowColor: "shadow-[0_0_80px_-12px_rgba(74,222,128,0.6)]",
          strokeColor: "#4ade80",
        };
      case "bearish":
        return {
          directionLabel: t.bearish,
          directionColor: "text-dragon",
          glowColor: "shadow-dragon",
          strokeColor: "hsl(12 85% 55%)",
        };
      default:
        return {
          directionLabel: t.neutral,
          directionColor: "text-gold",
          glowColor: "shadow-gold",
          strokeColor: "hsl(38 92% 50%)",
        };
    }
  }, [direction, t]);

  // Calculate stroke dash for circular progress - using larger radius
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability / 100) * circumference;

  if (loading) {
    return (
      <div className="flex flex-col items-center p-8">
        <div className="w-64 h-64 rounded-full bg-muted/30 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-gradient-gold">{t.title}</h2>
        <p className="text-sm text-muted-foreground mt-2">{t.subtitle}</p>
      </div>

      {/* LARGE Circular dial - Most Prominent Element */}
      <div className={`relative w-64 h-64 md:w-80 md:h-80 ${glowColor}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="10"
          />
          
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1500 ease-out"
          />
          
          {/* Outer glow effect */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1500 ease-out opacity-20 blur-sm"
          />
        </svg>
        
        {/* Center content - LARGE percentage */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-7xl md:text-8xl font-bold text-foreground leading-none">{probability.toFixed(0)}</span>
          <span className="text-2xl md:text-3xl text-muted-foreground -mt-2">%</span>
        </div>
      </div>

      {/* Direction label */}
      <div className={`mt-8 px-8 py-3 rounded-full border-2 ${
        direction === "bullish" ? "border-green-400/50 bg-green-400/10" :
        direction === "bearish" ? "border-dragon/50 bg-dragon/10" :
        "border-gold/50 bg-gold/10"
      }`}>
        <span className={`text-xl font-semibold ${directionColor}`}>{directionLabel}</span>
      </div>

      {/* Confidence bar */}
      <div className="w-full max-w-xs mt-8">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>{t.confidence}</span>
          <span>{probability.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              direction === "bullish" ? "bg-green-400" :
              direction === "bearish" ? "bg-dragon" :
              "bg-gold"
            }`}
            style={{ width: `${probability}%` }}
          />
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-muted-foreground/70 text-center italic max-w-sm">
        {t.disclaimer}
      </p>
    </div>
  );
}
