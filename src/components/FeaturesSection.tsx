import { Brain, Target, TrendingUp, Shield, Lightbulb, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturesSection = () => {
  const { language } = useLanguage();

  const content = {
    en: {
      sectionTitle: "The Complete",
      sectionTitleHighlight: "Mental Gym",
      sectionTitleEnd: "Experience",
      sectionSubtitle: "A comprehensive system for cognitive excellence, designed for your generation.",
      features: [
        { title: "AI-Powered", description: "Personalized challenges" },
        { title: "Precision Focus", description: "Target specific areas" },
        { title: "Track Growth", description: "Detailed analytics" },
        { title: "Science-Backed", description: "Neuroscience research" },
        { title: "Daily Wisdom", description: "Philosophy insights" },
        { title: "Community", description: "Connect with peers" },
      ],
    },
    "zh-TW": {
      sectionTitle: "完整的",
      sectionTitleHighlight: "智慧健腦",
      sectionTitleEnd: "體驗",
      sectionSubtitle: "專為您的世代打造的全方位認知卓越系統。",
      features: [
        { title: "AI 驅動", description: "個性化挑戰" },
        { title: "精準聚焦", description: "針對特定領域" },
        { title: "追蹤成長", description: "詳細分析報告" },
        { title: "科學支持", description: "神經科學研究" },
        { title: "每日智慧", description: "哲學洞見" },
        { title: "社群連結", description: "與同好交流" },
      ],
    },
    "zh-CN": {
      sectionTitle: "完整的",
      sectionTitleHighlight: "智慧健脑",
      sectionTitleEnd: "体验",
      sectionSubtitle: "专为您的世代打造的全方位认知卓越系统。",
      features: [
        { title: "AI 驱动", description: "个性化挑战" },
        { title: "精准聚焦", description: "针对特定领域" },
        { title: "追踪成长", description: "详细分析报告" },
        { title: "科学支持", description: "神经科学研究" },
        { title: "每日智慧", description: "哲学洞见" },
        { title: "社群连结", description: "与同好交流" },
      ],
    },
  };

  const t = content[language];
  const icons = [Brain, Target, TrendingUp, Shield, Lightbulb, Heart];

  return (
    <section id="programs" className="py-6 bg-secondary/30 relative">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dragon/30 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Section Header - compact */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="font-display text-lg md:text-xl font-bold mb-2">
            {t.sectionTitle}{" "}
            <span className="text-gradient-gold">{t.sectionTitleHighlight}</span>{" "}
            {t.sectionTitleEnd}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Features Grid - all 6 in a single row on large screens */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {t.features.map((feature, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                className="group p-4 rounded-xl bg-card border border-border hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 shadow-card text-center"
              >
                <div className="w-10 h-10 mx-auto rounded-lg bg-gradient-dragon/10 border border-dragon/20 flex items-center justify-center mb-3 group-hover:bg-gradient-dragon group-hover:border-transparent transition-all duration-300">
                  <Icon className="w-5 h-5 text-dragon group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="font-display text-sm font-semibold mb-1 group-hover:text-gold transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;