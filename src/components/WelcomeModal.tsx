import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import dragonLogo from "@/assets/dragon-logo.png";

const WELCOME_SHOWN_KEY = "dragongp_welcome_shown_v2";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if welcome has been shown before
    const hasShown = localStorage.getItem(WELCOME_SHOWN_KEY);
    if (!hasShown) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(WELCOME_SHOWN_KEY, "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="max-w-lg border-0 p-0 overflow-hidden z-[300] mx-4 max-h-[90vh] overflow-y-auto"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)",
          boxShadow: "0 0 60px rgba(255, 215, 0, 0.3), 0 0 120px rgba(255, 191, 0, 0.15)",
          border: "2px solid rgba(255, 215, 0, 0.4)",
        }}
      >
        {/* Header with Logo */}
        <div className="pt-6 pb-3 text-center">
          <img 
            src={dragonLogo} 
            alt="DragonGp.Ai" 
            className="h-20 w-auto mx-auto mb-3"
          />
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span 
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{
                background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
                color: "#1a1a1a",
              }}
            >
              LIVE TEST: JAN 19-29
            </span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 text-center">
          {/* Main Title - Trilingual */}
          <h2 
            className="text-lg font-bold mb-1"
            style={{ 
              color: "#FFD700",
              textShadow: "0 0 20px rgba(255, 215, 0, 0.5)",
            }}
          >
            Welcome to the DragonGp.Ai Live Test!
          </h2>
          <p 
            className="text-sm mb-3"
            style={{ color: "#FFA500" }}
          >
            歡迎來到 DragonGp.Ai 實測啟動！
          </p>
          
          {/* English Description */}
          <p 
            className="text-xs mb-2 leading-relaxed"
            style={{ color: "#E0E0E0" }}
          >
            We are excited to invite you to our 10-day live testing phase. 
            Explore our AI Mark6 probability models and our neutral, data-driven stock analysis tools.
          </p>

          {/* Traditional Chinese Description */}
          <p 
            className="text-xs mb-2 leading-relaxed"
            style={{ 
              color: "#94A3B8",
              fontFamily: "'Georgia', serif",
            }}
          >
            我們誠邀您參與為期 10 天的實測階段。探索我們的 AI 六合彩概率模型與中立、數據驅動的股市分析工具。
          </p>

          {/* Simplified Chinese Description */}
          <p 
            className="text-xs mb-4 leading-relaxed"
            style={{ 
              color: "#94A3B8",
              fontFamily: "'Georgia', serif",
            }}
          >
            我们诚邀您参与为期 10 天的实测阶段。探索我们的 AI 六合彩概率模型与中立、数据驱动的股市分析工具。
          </p>

          {/* Principle of Self-Decision - Emphasized */}
          <div 
            className="mb-5 py-3 px-4 rounded-lg"
            style={{
              background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 165, 0, 0.05) 100%)",
              border: "1px solid rgba(255, 215, 0, 0.3)",
            }}
          >
            <p 
              className="text-sm font-semibold mb-1"
              style={{ color: "#FFD700" }}
            >
              ⚠️ Principle of Self-Decision
            </p>
            <p 
              className="text-xs"
              style={{ color: "#E0E0E0" }}
            >
              We provide the data; the final decision is always yours.
            </p>
            <p 
              className="text-xs mt-1"
              style={{ color: "#94A3B8" }}
            >
              我們提供數據，最終決定權始終在您手中。
            </p>
            <p 
              className="text-xs"
              style={{ color: "#94A3B8" }}
            >
              我们提供数据，最终决定权始终在您手中。
            </p>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleClose}
            className="w-full py-5 text-base font-black transition-all duration-300 hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
              color: "#1a1a1a",
              border: "none",
              boxShadow: "0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3), 0 8px 25px rgba(255, 215, 0, 0.4)",
            }}
          >
            <span className="flex flex-col items-center leading-tight">
              <span>Let's Begin!</span>
              <span className="text-xs opacity-80">開始體驗</span>
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
