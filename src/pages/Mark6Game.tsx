import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCredits } from "@/hooks/useCredits";
import { CreditsDepletedPopup } from "@/components/CreditsDepletedPopup";
import SignUpDialog from "@/components/SignUpDialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MatrixBackground } from "@/components/mark6/MatrixBackground";
import { CharacterCircle } from "@/components/mark6/CharacterCircle";
import { CharacterProfileModal } from "@/components/mark6/CharacterProfileModal";
import { PartnerSelectionModal } from "@/components/mark6/PartnerSelectionModal";
import { GamblingDisclaimer } from "@/components/mark6/GamblingDisclaimer";
import { BankerSelectionModal } from "@/components/mark6/BankerSelectionModal";
import { ColorSelectionModal } from "@/components/mark6/ColorSelectionModal";
import { RiskIntensityModal } from "@/components/mark6/RiskIntensityModal";
import { PatternIntensityModal } from "@/components/mark6/PatternIntensityModal";
import { SimulationPowerModal } from "@/components/mark6/SimulationPowerModal";
import { IntuitionLevelModal } from "@/components/mark6/IntuitionLevelModal";
import { characters, Character } from "@/components/mark6/CharacterData";
import { Loader2, Play, Sparkles, Zap, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import goddessImg from "@/assets/characters/goddess-of-fortune.png";
import InlineLanguageSwitcher from "@/components/InlineLanguageSwitcher";

export default function Mark6Game() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const {
    profile,
    loading,
    creditBalance,
    showOutOfCredits,
    setShowOutOfCredits,
    handleCheckout,
    consumeCredit,
  } = useCredits();

  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPartnerSelection, setShowPartnerSelection] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Character | null>(null);
  
  // Partner-specific selection modals
  const [showBankerSelection, setShowBankerSelection] = useState(false);
  const [showColorSelection, setShowColorSelection] = useState(false);
  const [showRiskIntensity, setShowRiskIntensity] = useState(false);
  const [showPatternIntensity, setShowPatternIntensity] = useState(false);
  const [showSimulationPower, setShowSimulationPower] = useState(false);
  const [showIntuitionLevel, setShowIntuitionLevel] = useState(false);
  
  // Store user selections
  const [userSelections, setUserSelections] = useState<{
    bankers?: number[];
    colorRatio?: string;
    intensity?: number;
    pattern?: string;
    simulationStars?: number;
    intuitionLevel?: number;
  }>({});

  const content = {
    en: {
      title: "AI Mark6 Game Probability",
      subtitle: "Choose Your AI Partner for Probability Analysis",
      funnyStatement: "Which genius shall guide your luck today?",
      funnyStatementCn: "今天哪位天才為你指點迷津？",
      startGame: "START GAME",
      creditsLabel: "Credits",
      topUp: "TOP-UP",
      notLoggedIn: "Please sign up to play",
      signUp: "Sign Up",
      partnersTitle: "AI Partners",
      clickToView: "Click any partner to view their profile",
      poweredBy: "Powered by Dragon AI",
    },
    "zh-TW": {
      title: "AI 六合神器 或然率",
      subtitle: "選擇您的 AI 夥伴進行概率分析",
      funnyStatement: "Which genius shall guide your luck today?",
      funnyStatementCn: "今天哪位天才為你指點迷津？",
      startGame: "開始遊戲",
      creditsLabel: "積分",
      topUp: "充值",
      notLoggedIn: "請註冊以開始遊戲",
      signUp: "註冊",
      partnersTitle: "AI 夥伴",
      clickToView: "點擊任何夥伴查看其簡介",
      poweredBy: "由 Dragon AI 驅動",
    },
    "zh-CN": {
      title: "AI 六合神器 或然率",
      subtitle: "选择您的 AI 伙伴进行概率分析",
      funnyStatement: "Which genius shall guide your luck today?",
      funnyStatementCn: "今天哪位天才为你指点迷津？",
      startGame: "开始游戏",
      creditsLabel: "积分",
      topUp: "充值",
      notLoggedIn: "请注册以开始游戏",
      signUp: "注册",
      partnersTitle: "AI 伙伴",
      clickToView: "点击任何伙伴查看其简介",
      poweredBy: "由 Dragon AI 驱动",
    },
  };

  const t = content[language] || content.en;

  const handleCharacterClick = (character: Character) => {
    setSelectedCharacter(character);
    setShowProfileModal(true);
  };

  const handleStartGame = () => {
    if (!profile) {
      setShowSignUpDialog(true);
      return;
    }
    if (creditBalance === 0) {
      setShowOutOfCredits(true);
      return;
    }
    setShowPartnerSelection(true);
  };

  const handlePartnerSelected = (partner: Character) => {
    setSelectedPartner(partner);
    setShowPartnerSelection(false);
    
    // Show partner-specific selection modal BEFORE disclaimer
    if (partner.id === "elon") {
      setShowBankerSelection(true);
    } else if (partner.id === "aladdin") {
      setShowColorSelection(true);
    } else if (partner.id === "god-of-gambling") {
      // God of Gambling gets the unique Pattern Intensity modal
      setShowPatternIntensity(true);
    } else if (partner.id === "lucky-star") {
      // Lucky Star gets the Simulation Power modal
      setShowSimulationPower(true);
    } else if (partner.id === "achelois") {
      // Achelois gets the Intuition Level modal
      setShowIntuitionLevel(true);
    } else {
      // Fallback - show risk/intensity slider
      setShowRiskIntensity(true);
    }
  };

  const handleBankerConfirm = async (bankers: number[]) => {
    // Consume credit immediately when clicking "Generate AI Prediction"
    const success = await consumeCredit();
    if (!success) {
      setShowBankerSelection(false);
      return; // Credit consumption failed or out of credits
    }
    setUserSelections({ ...userSelections, bankers });
    setShowBankerSelection(false);
    setShowDisclaimer(true);
  };

  const handleColorConfirm = async (colorRatio: string) => {
    // Consume credit immediately when clicking "Generate AI Prediction"
    const success = await consumeCredit();
    if (!success) {
      setShowColorSelection(false);
      return;
    }
    setUserSelections({ ...userSelections, colorRatio });
    setShowColorSelection(false);
    setShowDisclaimer(true);
  };

  const handleIntensityConfirm = async (intensity: number) => {
    // Consume credit immediately when clicking "Generate AI Prediction"
    const success = await consumeCredit();
    if (!success) {
      setShowRiskIntensity(false);
      return;
    }
    setUserSelections({ ...userSelections, intensity });
    setShowRiskIntensity(false);
    setShowDisclaimer(true);
  };

  const handlePatternConfirm = async (pattern: string) => {
    // Consume credit immediately when clicking "Generate AI Prediction"
    const success = await consumeCredit();
    if (!success) {
      setShowPatternIntensity(false);
      return;
    }
    setUserSelections({ ...userSelections, pattern });
    setShowPatternIntensity(false);
    setShowDisclaimer(true);
  };

  const handleSimulationConfirm = async (stars: number) => {
    // Consume credit immediately when clicking "Generate AI Prediction"
    const success = await consumeCredit();
    if (!success) {
      setShowSimulationPower(false);
      return;
    }
    setUserSelections({ ...userSelections, simulationStars: stars });
    setShowSimulationPower(false);
    setShowDisclaimer(true);
  };

  const handleIntuitionConfirm = async (level: number) => {
    // Consume credit immediately when clicking "Generate AI Prediction"
    const success = await consumeCredit();
    if (!success) {
      setShowIntuitionLevel(false);
      return;
    }
    setUserSelections({ ...userSelections, intuitionLevel: level });
    setShowIntuitionLevel(false);
    setShowDisclaimer(true);
  };

  const handleDisclaimerAccept = () => {
    setShowDisclaimer(false);
    // Navigate with selections
    const params = new URLSearchParams();
    params.set("partner", selectedPartner?.id || "");
    if (userSelections.bankers) {
      params.set("bankers", userSelections.bankers.join(","));
    }
    if (userSelections.colorRatio) {
      params.set("colorRatio", userSelections.colorRatio);
    }
    if (userSelections.intensity !== undefined) {
      params.set("intensity", userSelections.intensity.toString());
    }
    if (userSelections.pattern) {
      params.set("pattern", userSelections.pattern);
    }
    if (userSelections.simulationStars !== undefined) {
      params.set("simulationStars", userSelections.simulationStars.toString());
    }
    if (userSelections.intuitionLevel !== undefined) {
      params.set("intuitionLevel", userSelections.intuitionLevel.toString());
    }
    navigate(`/mark6-results?${params.toString()}`);
  };

  const handleDisclaimerDecline = () => {
    setShowDisclaimer(false);
    setSelectedPartner(null);
    setUserSelections({});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background casino-roulette-bg">
      {/* Matrix Background */}
      <MatrixBackground />
      
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 pt-16 pb-4 relative z-10">
        <div className="container mx-auto px-4">
          
          {/* Header */}
          <div className="text-center mb-3">
            <h1 className="text-2xl md:text-3xl font-black tracking-wider mb-1 text-primary font-display"
              style={{ textShadow: "0 0 30px hsl(43 80% 55% / 0.5)" }}
            >
              {t.title}
            </h1>
            <div className="mb-2">
              <InlineLanguageSwitcher />
            </div>
            <p className="text-foreground/60 text-xs">{t.subtitle}</p>
          </div>

          {/* Credits Bar */}
          {profile && (
            <div className="flex justify-center mb-4">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl glass-dark">
                <span className="text-xs text-foreground/60">{t.creditsLabel}</span>
                <span 
                  className="text-xl font-bold"
                  style={{ color: creditBalance > 0 ? 'hsl(43 80% 55%)' : 'hsl(0 84% 60%)' }}
                >
                  {creditBalance}
                </span>
                <Button
                  onClick={() => navigate("/pricing")}
                  size="sm"
                  className="ml-1 font-bold text-xs py-1 px-2 bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {t.topUp}
                </Button>
              </div>
            </div>
          )}

          {/* Funny Statement Bubble */}
          <div className="flex justify-center mb-3">
            <div className="px-4 py-2 rounded-full text-center glass-dark border border-primary/30">
              <p className="text-xs font-medium text-primary">
                {t.funnyStatement}
              </p>
              <p className="text-[10px] text-foreground/50">
                {t.funnyStatementCn}
              </p>
            </div>
          </div>

          {/* Main Layout */}
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            
            {/* Left Column - Character Circle */}
            <div className="p-4 rounded-2xl relative felt-texture border border-primary/20">
              <h2 className="text-center text-sm font-bold mb-1 text-emerald-400">
                {t.partnersTitle}
              </h2>
              <p className="text-center text-[10px] text-foreground/40 mb-2">
                {t.clickToView}
              </p>
              
              <CharacterCircle 
                characters={characters}
                onCharacterClick={handleCharacterClick}
                language={language}
              />
            </div>

            {/* Right Column - Goddess + Start Button */}
            <div className="p-4 rounded-2xl flex flex-col items-center justify-center felt-texture border border-primary/20">
              <div 
                className="w-36 h-36 mb-3 rounded-full overflow-hidden"
                style={{ boxShadow: "0 0 40px hsl(43 80% 55% / 0.4), 0 0 80px hsl(43 80% 55% / 0.2)" }}
              >
                <img 
                  src={goddessImg} 
                  alt="Goddess of Fortune"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-[10px] mb-3 text-foreground/40">
                {t.poweredBy}
              </p>

              <Button
                onClick={profile ? handleStartGame : () => setShowSignUpDialog(true)}
                className="relative px-8 py-4 text-lg font-black tracking-wider overflow-hidden group bg-gradient-gold text-navy rounded-xl shadow-gold"
              >
                <span 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)",
                    animation: "shine 2s infinite",
                  }}
                />
                
                <Play className="w-5 h-5 mr-2 inline" />
                {profile ? t.startGame : t.signUp}
                <Sparkles className="w-4 h-4 ml-2 inline" />
              </Button>

              {/* Decorative lottery balls */}
              <div className="flex gap-1.5 mt-3">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div
                    key={num}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{
                      background: num <= 2 ? "#EF4444" : num <= 4 ? "#3B82F6" : "#22C55E",
                      boxShadow: `0 0 8px ${num <= 2 ? "rgba(239, 68, 68, 0.5)" : num <= 4 ? "rgba(59, 130, 246, 0.5)" : "rgba(34, 197, 94, 0.5)"}`,
                    }}
                  >
                    {Math.floor(Math.random() * 49) + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Bar - Go to AI Stocks */}
        <div className="mt-6 px-4 max-w-md mx-auto">
          <Link
            to="/ai-stocks"
            className="flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gradient-gold text-navy font-bold text-base rounded-xl shadow-gold transition-all duration-300 active:scale-[0.98] hover:opacity-90"
          >
            <TrendingUp className="w-5 h-5 flex-shrink-0" />
            <span className="text-center leading-tight">
              {language === "zh-TW" ? "立即前往 AI 股市概率" : language === "zh-CN" ? "立即前往 AI 股市概率" : "Go to AI Stocks Probability Now"}
            </span>
          </Link>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <CharacterProfileModal
        character={selectedCharacter}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        language={language}
      />

      <PartnerSelectionModal
        isOpen={showPartnerSelection}
        onClose={() => setShowPartnerSelection(false)}
        onSelectPartner={handlePartnerSelected}
        language={language}
      />

      <GamblingDisclaimer
        isOpen={showDisclaimer}
        onAccept={handleDisclaimerAccept}
        onDecline={handleDisclaimerDecline}
        language={language}
      />

      <BankerSelectionModal
        isOpen={showBankerSelection}
        onClose={() => setShowBankerSelection(false)}
        onConfirm={handleBankerConfirm}
        language={language}
      />

      <ColorSelectionModal
        isOpen={showColorSelection}
        onClose={() => setShowColorSelection(false)}
        onConfirm={handleColorConfirm}
        language={language}
      />

      <RiskIntensityModal
        isOpen={showRiskIntensity}
        onClose={() => setShowRiskIntensity(false)}
        onConfirm={handleIntensityConfirm}
        partner={selectedPartner}
        language={language}
      />

      <PatternIntensityModal
        isOpen={showPatternIntensity}
        onClose={() => setShowPatternIntensity(false)}
        onConfirm={handlePatternConfirm}
        partner={selectedPartner}
        language={language}
      />

      <SimulationPowerModal
        isOpen={showSimulationPower}
        onClose={() => setShowSimulationPower(false)}
        onConfirm={handleSimulationConfirm}
        language={language}
      />

      <IntuitionLevelModal
        isOpen={showIntuitionLevel}
        onClose={() => setShowIntuitionLevel(false)}
        onConfirm={handleIntuitionConfirm}
        language={language}
      />

      <CreditsDepletedPopup
        open={showOutOfCredits}
        onOpenChange={setShowOutOfCredits}
      />

      <SignUpDialog 
        open={showSignUpDialog} 
        onOpenChange={setShowSignUpDialog} 
      />

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
