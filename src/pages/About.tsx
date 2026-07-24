import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Rocket, Brain, Shield, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import founderIcon from "@/assets/founder-icon.png";

const translations = {
  en: {
    mainTitle: "The Story Behind the Screen",
    backHome: "Back to Home",
    introText: "Welcome to DragonGp.Ai. We are a collective of curious minds who believe the AI Era offers unprecedented tools to explore information. We're not financial tycoons or licensed brokers; we're a team of technology enthusiasts building tools that make complex data feel human again.",
    missionTitle: "Our Mission: Intelligence, Not Investment",
    missionText: "DragonGp.Ai was created for explorers — people who love patterns, probabilities, and the thrill of discovery. Our goal is to save you hours of research by using AI to summarize market data, sparking your own creative ideas.",
    cognitiveTitle: "Cognitive Engagement & Brain Vitality",
    cognitiveText: "The core purpose of this website is mental exercise. We believe analyzing patterns keeps the brain sharp. However, we strictly advocate for the",
    principleTitle: "Principle of Self-Decision",
    disclaimerText: "All information is a \"Market Data Summary\" and should not be taken as financial advice. We are NOT brokers, financial advisors, or tycoons. We are technology enthusiasts who believe in the power of information. All decisions you make based on our analysis are YOUR decisions. We provide the tools; you make the calls.",
    foundersNote: "From the Founder's Desk",
    foundersText: "We built this platform because we believe intelligence is about connection — between data and insight, between curiosity and discovery. AI can find patterns in endless oceans of numbers, but it will never replace the human spark of intuition. Use our tools to inform your mind, then trust your own voice to guide you.",
    teamTag: "✨ We Are DragonGP",
    teamDesc: "A collective of analysts, engineers, and dreamers who believe data should be empowering, not overwhelming.",
    ourValues: "Our Values",
    value1: "Radical Transparency",
    value1Desc: "No hidden agendas. Just raw data and clear insights.",
    value2: "Human-Centric AI",
    value2Desc: "Technology that serves human intuition, not replaces it.",
    value3: "Continuous Learning",
    value3Desc: "We evolve with the market, constantly refining our models."
  },
  "zh-TW": {
    mainTitle: "螢幕背後的故事",
    backHome: "返回首頁",
    introText: "歡迎來到 DragonGp.Ai。我們是一群充滿好奇心的團隊，相信 AI 時代為探索資訊提供了前所未有的工具。我們不是金融大亨或持牌經紀人；我們是一群科技愛好者，正在建造讓複雜數據重新變得人性化的工具。",
    missionTitle: "我們的使命：智能，而非投資",
    missionText: "DragonGp.Ai 是為探索者而建——為那些熱愛模式、概率和發現樂趣的人們。我們的目標是利用 AI 總結市場數據，為您節省數小時的研究時間，激發您自己的創意。",
    cognitiveTitle: "認知參與與大腦活力",
    cognitiveText: "這個網站的核心目的是腦力鍛煉。我們相信分析模式能保持大腦敏銳。然而，我們嚴格倡導",
    principleTitle: "「自主決策原則」",
    disclaimerText: "所有資訊僅為「市場數據總結」，不應被視為投資建議。我們不是經紀人、財務顧問或金融大亨。我們是相信資訊力量的科技愛好者。您根據我們的分析所做的所有決策都是您自己的決策。我們提供工具；您做出選擇。",
    foundersNote: "創辦人的話",
    foundersText: "我們建造這個平台，是因為我們相信智能關乎連結——數據與洞察之間的連結，好奇心與發現之間的連結。AI 能在無盡的數字海洋中找到模式，但它永遠無法取代人類直覺的火花。用我們的工具來啟發您的思維，然後相信您自己的聲音來引導您。",
    teamTag: "✨ 我們是 DragonGP",
    teamDesc: "一群分析師、工程師和夢想家的集合體，相信數據應該賦能，而非壓倒。",
    ourValues: "我們的價值觀",
    value1: "徹底透明",
    value1Desc: "沒有隱藏議程。只有原始數據和清晰的洞察。",
    value2: "以人為本的 AI",
    value2Desc: "技術服務於人類直覺，而非取代它。",
    value3: "持續學習",
    value3Desc: "我們與市場共同進化，不斷優化我們的模型。"
  },
  "zh-CN": {
    mainTitle: "屏幕背后的故事",
    backHome: "返回首页",
    introText: "欢迎来到 DragonGp.Ai。我们是一群充满好奇心的团队，相信 AI 时代为探索信息提供了前所未有的工具。我们不是金融大亨或持牌经纪人；我们是一群科技爱好者，正在建造让复杂数据重新变得人性化的工具。",
    missionTitle: "我们的使命：智能，而非投资",
    missionText: "DragonGp.Ai 是为探索者而建——为那些热爱模式、概率和发现乐趣的人们。我们的目标是利用 AI 总结市场数据，为您节省数小时的研究时间，激发您自己的创意。",
    cognitiveTitle: "认知参与与大脑活力",
    cognitiveText: "这个网站的核心目的是脑力锻炼。我们相信分析模式能保持大脑敏锐。然而，我们严格倡导",
    principleTitle: "「自主决策原则」",
    disclaimerText: "所有信息仅为「市场数据总结」，不应被视为投资建议。我们不是经纪人、财务顾问或金融大亨。我们是相信信息力量的科技爱好者。您根据我们的分析所做的所有决策都是您自己的决策。我们提供工具；您做出选择。",
    foundersNote: "创办人的话",
    foundersText: "我们建造这个平台，是因为我们相信智能关乎连结——数据与洞察之间的连结，好奇心与发现之间的连结。AI 能在无尽的数字海洋中找到模式，但它永远无法取代人类直觉的火花。用我们的工具来启发您的思维，然后相信您自己的声音来引导您。",
    teamTag: "✨ 我们是 DragonGP",
    teamDesc: "一群分析师、工程师和梦想家的集合体，相信数据应该赋能，而非压倒。",
    ourValues: "我们的价值观",
    value1: "彻底透明",
    value1Desc: "没有隐藏议程。只有原始数据和清晰的洞察。",
    value2: "以人为本的 AI",
    value2Desc: "技术服务人类直觉，而非取代它。",
    value3: "持续学习",
    value3Desc: "我们与市场共同进化，不断优化我们的模型。"
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
        {/* Header - Full Width with Gold/Amber Heading */}
        <header className="text-center mb-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/50 border border-blue-200/30 text-sm font-medium text-blue-700 mb-3">
            <Users className="w-4 h-4" />
            <span>{t.teamTag}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-600 mb-2">
            {t.mainTitle}
          </h1>
          <p className="text-[1.05rem] leading-snug text-foreground/80 max-w-4xl mx-auto">
            {t.introText}
          </p>
        </header>

        {/* 2-Column Grid for Main Content with Gold/Amber Headings */}
        <div className="grid md:grid-cols-2 gap-5 mb-3">
          {/* Left Column - Mission */}
          <section className="bg-card/30 rounded-lg p-4 border border-border/50 hover:border-amber-300/50 transition-all duration-300 group">
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
              <h2 className="text-lg md:text-xl font-semibold text-amber-600">
                {t.missionTitle}
              </h2>
            </div>
            <p className="text-[1.05rem] leading-snug text-foreground/80">
              {t.missionText}
            </p>
          </section>

          {/* Right Column - Cognitive Engagement */}
          <section className="bg-card/30 rounded-lg p-4 border border-border/50 hover:border-amber-300/50 transition-all duration-300 group">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
              <h2 className="text-lg md:text-xl font-semibold text-amber-600">
                {t.cognitiveTitle}
              </h2>
            </div>
            <p className="text-[1.05rem] leading-snug text-foreground/80">
              {t.cognitiveText} <span className="font-bold text-foreground not-italic">{t.principleTitle}</span>.
            </p>
          </section>
        </div>

        {/* Our Values - 3 Column */}
        <section className="mb-3">
          <h2 className="text-center text-lg font-bold text-amber-600 mb-3 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            {t.ourValues}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: Shield, title: t.value1, desc: t.value1Desc },
              { icon: Brain, title: t.value2, desc: t.value2Desc },
              { icon: Zap, title: t.value3, desc: t.value3Desc }
            ].map((value, idx) => (
              <div key={idx} className="bg-card/30 rounded-lg p-4 border border-border/50 text-center hover:border-amber-300/50 hover:shadow-md transition-all duration-300 group">
                <div className="flex justify-center mb-2">
                  <value.icon className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{value.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer Box with Amber Border */}
        <section className="border-2 border-amber-500/40 rounded-lg p-3 bg-amber-50/50 mb-3">
          <div className="flex items-start gap-2">
            <Shield className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <div>
              <h2 className="text-base font-bold text-amber-600 mb-0.5">
                {t.principleTitle}
              </h2>
              <p className="text-foreground/90 text-[0.95rem] leading-tight">
                {t.disclaimerText}
              </p>
            </div>
          </div>
        </section>

        {/* Founder's Note Section */}
        <section className="rounded-lg p-4 mb-3 border border-amber-700/30 hover:shadow-lg transition-all duration-300" style={{ backgroundColor: '#F5E6C8' }}>
          <div className="flex items-start gap-4">
            <img 
              src={founderIcon} 
              alt="Founder" 
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-600/50 flex-shrink-0"
            />
            <div>
              <h2 className="text-lg font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                {t.foundersNote}
              </h2>
              <p className="text-amber-900/80 text-[0.95rem] leading-relaxed italic">
                "{t.foundersText}"
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
      
      <Footer />
    </div>
  );
};

export default About;