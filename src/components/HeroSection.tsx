import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Zap, Target, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface HeroSectionProps {
  isSubscriber?: boolean;
}

const HeroSection = ({ isSubscriber = false }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const content = {
    en: {
      headline1: "Don't Just Retire.",
      headline2: "Rewire!",
      subheadline: 'The "Open Eye" Exercise for the AI Era.',
      whyJoin: "Why Join DragonGp.Ai?",
      saveTime: "Save Your Time",
      saveTimeDesc: "Heavy lifting & math done for you.",
      pureAI: "Pure AI Analysis",
      pureAIDesc: "No bias. Just RSI, MACD & raw data.",
      mission: "Our Mission: Rewiring the Perspective",
      missionDesc: "Daily insights as a mental gym to keep the mind sharp and analytical.",
      zeroPressure: "Zero Pressure",
      selfDecision: "Principle of Self-Decision",
      selfDecisionDesc: "We provide info; you decide. No pressure.",
      standard: "The DragonGp.Ai Standard",
      standardDesc: "AI-driven math summaries. Raw data only.",
      pricePlan: "Price Plan",
      myWatchlist: "My Watchlist",
    },
    "zh-TW": {
      headline1: "用 AI 掌握市場脈搏",
      headline2: "重新連線！",
      subheadline: "AI 時代的「開眼」練習。",
      whyJoin: "為何加入 DragonGp.Ai？",
      saveTime: "節省您的時間",
      saveTimeDesc: "繁重的計算由我們完成。",
      pureAI: "純 AI 分析",
      pureAIDesc: "無偏見。只有 RSI、MACD 和原始數據。",
      mission: "我們的使命：重塑視角",
      missionDesc: "每日洞察如心智健身房，保持頭腦敏銳和分析能力。",
      zeroPressure: "零壓力體驗",
      selfDecision: "自主決策原則",
      selfDecisionDesc: "我們提供資訊；您做決定。無壓力。",
      standard: "DragonGp.Ai 標準",
      standardDesc: "AI 驅動的數學摘要。僅原始數據。",
      pricePlan: "價格方案",
      myWatchlist: "我的自選股",
    },
    "zh-CN": {
      headline1: "用 AI 掌握市场脉搏",
      headline2: "重新连线！",
      subheadline: "AI 时代的「开眼」练习。",
      whyJoin: "为何加入 DragonGp.Ai？",
      saveTime: "节省您的时间",
      saveTimeDesc: "繁重的计算由我们完成。",
      pureAI: "纯 AI 分析",
      pureAIDesc: "无偏见。只有 RSI、MACD 和原始数据。",
      mission: "我们的使命：重塑视角",
      missionDesc: "每日洞察如心智健身房，保持头脑敏锐和分析能力。",
      zeroPressure: "零压力体验",
      selfDecision: "自主决策原则",
      selfDecisionDesc: "我们提供信息；您做决定。无压力。",
      standard: "DragonGp.Ai 标准",
      standardDesc: "AI 驱动的数学摘要。仅原始数据。",
      pricePlan: "价格方案",
      myWatchlist: "我的自选股",
    },
  };

  const t = content[language] || content.en;

  return (
    <>
      <section id="home" className="relative flex flex-col overflow-hidden bg-background pt-14 pb-0">
        {/* Subtle gold radial glows */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: 'hsl(43 72% 52% / 0.3)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full blur-3xl opacity-15" style={{ background: 'hsl(43 80% 62% / 0.2)' }} />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col">
          <div className="max-w-5xl mx-auto w-full animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {/* Main Headline */}
            <div className="text-center mb-2">
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-0.5">
                <span className="text-gradient-gold italic inline-block">{t.headline1}</span>{' '}
                <span className="text-primary font-display italic font-bold">{t.headline2}</span>
              </h1>
              <p className="font-display italic text-xs md:text-sm text-emerald-600 animate-pulse">
                {t.subheadline}
              </p>
            </div>

            {/* 2x2 Grid */}
            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              {/* Quadrant 1: Why Join */}
              <div className="glass rounded-md p-3 gold-border">
                <h2 className="font-display text-sm font-bold italic text-primary mb-2 tracking-wide">
                  {t.whyJoin}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-[11px] text-primary">{t.saveTime}</h3>
                      <p className="font-body text-[10px] leading-snug text-foreground/80">{t.saveTimeDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-[11px] text-primary">{t.pureAI}</h3>
                      <p className="font-body text-[10px] leading-snug text-foreground/80">{t.pureAIDesc}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quadrant 2: Our Mission */}
              <div className="glass rounded-md p-3 gold-border">
                <h2 className="font-display text-sm font-bold italic text-primary mb-2 tracking-wide">
                  {t.mission}
                </h2>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Target className="w-3 h-3 text-primary" />
                  </div>
                  <p className="font-body text-[10px] leading-snug text-foreground/80">
                    {t.missionDesc}
                  </p>
                </div>
              </div>

              {/* Quadrant 3: Zero Pressure */}
              <div className="glass rounded-md p-3 gold-border">
                <h2 className="font-display text-sm font-bold italic text-primary mb-2 tracking-wide">
                  {t.zeroPressure}
                </h2>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-[11px] text-primary">{t.selfDecision}</h3>
                    <p className="font-body text-[10px] leading-snug text-foreground/80">
                      {t.selfDecisionDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quadrant 4: The Standard */}
              <div className="glass rounded-md p-3 gold-border flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-sm font-bold italic text-primary mb-1.5 tracking-wide">
                    {t.standard}
                  </h2>
                  <p className="font-body text-[10px] leading-snug text-foreground/80">
                    {t.standardDesc}
                  </p>
                </div>
                <div className="mt-2 flex gap-2 justify-end">
                  <Link 
                    to="/watchlist" 
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 glass gold-border text-primary text-[10px] font-bold rounded transition-all duration-300 hover:scale-105 hover:bg-primary/10"
                  >
                    <Star className="w-3 h-3" />
                    {t.myWatchlist}
                  </Link>
                  <a 
                    href="/pricing" 
                    className="inline-flex items-center justify-center px-4 py-1.5 bg-gradient-gold text-navy text-[10px] font-bold rounded transition-all duration-300 hover:scale-105 shadow-gold"
                  >
                    {t.pricePlan}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
