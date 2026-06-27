import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import founderIcon from "@/assets/founder-icon.png";

const translations = {
  en: {
    mainTitle: "The Story Behind the Screen",
    backHome: "Back to Home",
    introText: "Welcome to DragonGp.Ai. This platform was born from the study of a retired veteran who refuses to let the mind slow down. I am not a financial tycoon or a licensed broker; I am simply an individual who believes the AI Era offers unprecedented tools to explore information.",
    missionTitle: "Our Mission: Intelligence, Not Investment",
    missionText: "DragonGp.Ai was created for those interested in stock patterns and game theory. My goal is to save you hours of research by using AI to summarize market data, sparking your own creative ideas.",
    cognitiveTitle: "Cognitive Engagement & Brain Vitality",
    cognitiveText: "The core purpose of this website is mental exercise. We believe analyzing patterns keeps the brain sharp. However, we strictly advocate for the",
    principleTitle: "Principle of Self-Decision",
    disclaimerText: "All information is a \"Market Data Summary\" and should not be taken as financial advice. We are NOT brokers, financial advisors, or tycoons. We are technology enthusiasts who believe in the power of information. All decisions you make based on our analysis are YOUR decisions. We provide the tools; you make the calls.",
    foundersNote: "Founder's Note",
    foundersText: "AI can find patterns in endless oceans of data, but it will never feel the flutter of a human heart making a choice. Use this tool wisely—let the numbers inform you, but let your own intuition guide you."
  },
  "zh-TW": {
    mainTitle: "螢幕背後的故事",
    backHome: "返回首頁",
    introText: "歡迎來到 DragonGp.Ai。這個平台的誕生，並非源於企業董事會，而是出自一位拒絕讓思維停滯的退休老兵。我並非金融大亨或持牌經紀；我只是一個深信「AI 時代」能為我們提供前所未有的工具來探索資訊的普通人。",
    missionTitle: "我們的使命：是智能，而非投資",
    missionText: "DragonGp.Ai 是為那些對股票模式、博弈論和科技動態感興趣的人而創立的。我的目標是利用 AI 總結市場數據，為您節省數小時的搜尋時間，從而激發您自己的創意。",
    cognitiveTitle: "認知參與與大腦活力",
    cognitiveText: "本網站的核心宗旨是「認知參與與娛樂」。我們相信分析複雜模式是保持大腦活躍、防止退化的有效方式。然而，我們嚴格倡導",
    principleTitle: "「自主決策原則」",
    disclaimerText: "所有資訊僅為「市場數據總結」，不應被視為投資建議。我們不是經紀人、財務顧問或金融大亨。我們是相信資訊力量的科技愛好者。您根據我們的分析所做的所有決策都是您自己的決策。我們提供工具；您做出選擇。",
    foundersNote: "創辦人的話",
    foundersText: "AI 能在無盡的數據海洋中發現規律，但它永遠無法感受到人類做出選擇時那顆心的悸動。請明智地使用這個工具——讓數字為您提供資訊，但讓您自己的直覺引導您前行。"
  },
  "zh-CN": {
    mainTitle: "屏幕背后的故事",
    backHome: "返回首页",
    introText: "欢迎来到 DragonGp.Ai。这个平台的诞生，并非源于企业董事会，而是出自一位拒绝让思维停滞的退休老兵。我并非金融大亨或持牌经纪；我只是一个深信「AI时代」能为我们提供前所未有的工具来探索信息的普通人。",
    missionTitle: "我们的使命：是智能，而非投资",
    missionText: "DragonGp.Ai 是为那些对股票模式、博弈论和科技动态感兴趣的人而创立的。我的目标是利用 AI 总结市场数据，为您节省数小时的搜索时间，从而激发您自己的创意。",
    cognitiveTitle: "认知参与与大脑活力",
    cognitiveText: "本网站的核心宗旨是「认知参与与娱乐」。我们相信分析复杂模式是保持大脑活跃、防止退化的有效方式。然而，我们严格倡导",
    principleTitle: "「自主决策原则」",
    disclaimerText: "所有信息仅为「市场数据总结」，不应被视为投资建议。我们不是经纪人、财务顾问或金融大亨。我们是相信信息力量的科技爱好者。您根据我们的分析所做的所有决策都是您自己的决策。我们提供工具；您做出选择。",
    foundersNote: "创办人的话",
    foundersText: "AI 能在无尽的数据海洋中发现规律，但它永远无法感受到人类做出选择时那颗心的悸动。请明智地使用这个工具——让数字为您提供信息，但让您自己的直觉引导您前行。"
  }
};

const About = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = translations[language] || translations.en;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-6 pt-20 pb-4 max-w-6xl flex flex-col justify-between">
        {/* Header - Full Width with Blue Heading */}
        <header className="text-center mb-3">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
            {t.mainTitle}
          </h1>
          <p className="text-[1.05rem] leading-snug text-foreground/80 max-w-4xl mx-auto italic">
            {t.introText}
          </p>
        </header>

        {/* 2-Column Grid for Main Content with Red Headings */}
        <div className="grid md:grid-cols-2 gap-5 mb-3">
          {/* Left Column - Mission */}
          <section className="bg-card/30 rounded-lg p-4 border border-border/50">
            <h2 className="text-lg md:text-xl font-semibold text-red-400 mb-2">
              {t.missionTitle}
            </h2>
            <p className="text-[1.05rem] leading-snug text-foreground/80 italic">
              {t.missionText}
            </p>
          </section>

          {/* Right Column - Cognitive Engagement */}
          <section className="bg-card/30 rounded-lg p-4 border border-border/50">
            <h2 className="text-lg md:text-xl font-semibold text-red-400 mb-2">
              {t.cognitiveTitle}
            </h2>
            <p className="text-[1.05rem] leading-snug text-foreground/80 italic">
              {t.cognitiveText} <span className="font-bold text-foreground not-italic">{t.principleTitle}</span>.
            </p>
          </section>
        </div>

        {/* Compact Disclaimer Box with Red Border */}
        <section className="border-2 border-red-500 rounded-lg p-3 bg-red-500/5 mb-3">
          <div className="flex items-start gap-2">
            <span className="text-red-400 text-lg">⚠️</span>
            <div>
              <h2 className="text-base font-bold text-red-400 mb-0.5">
                {t.principleTitle}
              </h2>
              <p className="text-foreground/90 text-[0.95rem] leading-tight">
                {t.disclaimerText}
              </p>
            </div>
          </div>
        </section>

        {/* Founder's Note Section */}
        <section className="rounded-lg p-4 mb-3 border border-amber-700/30" style={{ backgroundColor: '#F5E6C8' }}>
          <div className="flex items-start gap-4">
            <img 
              src={founderIcon} 
              alt="Founder" 
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-600/50 flex-shrink-0"
            />
            <div>
              <h2 className="text-lg font-semibold text-amber-900 mb-2">
                {t.foundersNote}
              </h2>
              <p className="text-amber-900/80 text-[0.95rem] leading-relaxed italic">
                {t.foundersText}
              </p>
            </div>
          </div>
        </section>

        {/* Ghost Style Back to Home Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-sm text-foreground/60 hover:text-foreground hover:bg-transparent"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t.backHome}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default About;
