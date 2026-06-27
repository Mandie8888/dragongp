import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield } from "lucide-react";
import { Language } from "@/contexts/LanguageContext";

interface GamblingDisclaimerProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  language: Language;
}

export function GamblingDisclaimer({ isOpen, onAccept, onDecline, language }: GamblingDisclaimerProps) {
  const content = {
    en: {
      title: "⚠️ GAMBLING WARNING",
      subtitle: "Important Disclaimer - Please Read Carefully",
      points: [
        "This AI Mark6 Game is for ENTERTAINMENT and EDUCATIONAL purposes ONLY.",
        "We do NOT hold any gambling, gaming, or financial advisory licenses.",
        "All predictions are based on mathematical probability models and historical data analysis.",
        "Past results do NOT guarantee future outcomes.",
        "Gambling can be addictive and harmful to your health, finances, and relationships.",
        "Never gamble more than you can afford to lose.",
        "If you or someone you know has a gambling problem, please seek professional help.",
        "We are NOT responsible for any financial losses or consequences arising from the use of this service.",
      ],
      accept: "I Understand & Accept",
      decline: "Decline",
      footer: "By clicking 'Accept', you confirm that you are of legal gambling age in your jurisdiction and agree to these terms.",
    },
    "zh-TW": {
      title: "⚠️ 賭博警告",
      subtitle: "重要聲明 - 請仔細閱讀",
      points: [
        "此 AI 六合遊戲僅供娛樂和教育目的。",
        "我們不持有任何賭博、博彩或財務顧問牌照。",
        "所有預測均基於數學概率模型和歷史數據分析。",
        "過往結果不保證未來結果。",
        "賭博可能會上癮並對您的健康、財務和人際關係造成傷害。",
        "切勿賭博超過您能承受的損失。",
        "如果您或您認識的人有賭博問題，請尋求專業幫助。",
        "我們對使用本服務產生的任何財務損失或後果不承擔責任。",
      ],
      accept: "我理解並接受",
      decline: "拒絕",
      footer: "點擊「接受」即表示您確認您已達到您所在司法管轄區的法定賭博年齡並同意這些條款。",
    },
    "zh-CN": {
      title: "⚠️ 赌博警告",
      subtitle: "重要声明 - 请仔细阅读",
      points: [
        "此 AI 六合游戏仅供娱乐和教育目的。",
        "我们不持有任何赌博、博彩或财务顾问牌照。",
        "所有预测均基于数学概率模型和历史数据分析。",
        "过往结果不保证未来结果。",
        "赌博可能会上瘾并对您的健康、财务和人际关系造成伤害。",
        "切勿赌博超过您能承受的损失。",
        "如果您或您认识的人有赌博问题，请寻求专业帮助。",
        "我们对使用本服务产生的任何财务损失或后果不承担责任。",
      ],
      accept: "我理解并接受",
      decline: "拒绝",
      footer: "点击「接受」即表示您确认您已达到您所在司法管辖区的法定赌博年龄并同意这些条款。",
    },
  };

  const t = content[language] || content.en;

  return (
    <Dialog open={isOpen} onOpenChange={() => onDecline()}>
      <DialogContent 
        className="max-w-lg border-2 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a0a0a 0%, #2a1515 50%, #1a0a0a 100%)",
          borderColor: "#DC2626",
          boxShadow: "0 0 60px rgba(220, 38, 38, 0.4)",
          maxHeight: "85vh",
        }}
      >
        <DialogHeader className="pb-2">
          <div className="flex justify-center mb-2">
            <div 
              className="p-3 rounded-full"
              style={{
                background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)",
                boxShadow: "0 0 20px rgba(220, 38, 38, 0.6)",
              }}
            >
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <DialogTitle 
            className="text-center text-xl font-black tracking-wider"
            style={{ 
              color: "#EF4444",
              textShadow: "0 0 20px rgba(239, 68, 68, 0.5)",
            }}
          >
            {t.title}
          </DialogTitle>
          
          <DialogDescription className="text-center text-[#FCA5A5] text-xs font-medium">
            {t.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          {/* Warning Points - Compact scrollable area */}
          <div 
            className="p-2 rounded-lg space-y-1.5 max-h-[35vh] overflow-y-auto"
            style={{
              background: "rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(220, 38, 38, 0.3)",
            }}
          >
            {t.points.map((point, index) => (
              <div key={index} className="flex items-start gap-2">
                <Shield className="w-3 h-3 text-[#F87171] flex-shrink-0 mt-0.5" />
                <p 
                  className="text-[11px] leading-tight"
                  style={{ color: "#E2E8F0" }}
                >
                  {point}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p 
            className="text-[10px] italic text-center"
            style={{ color: "#94A3B8" }}
          >
            {t.footer}
          </p>

          {/* Buttons - Always visible */}
          <div className="flex gap-3 pt-1">
            <Button
              onClick={onDecline}
              variant="outline"
              className="flex-1 py-2.5 font-bold border-2 text-sm"
              style={{
                borderColor: "#6B7280",
                color: "#9CA3AF",
                background: "transparent",
              }}
            >
              {t.decline}
            </Button>
            <Button
              onClick={onAccept}
              className="flex-1 py-2.5 font-bold text-sm"
              style={{
                background: "linear-gradient(90deg, #22C55E 0%, #16A34A 100%)",
                color: "#FFFFFF",
                boxShadow: "0 0 20px rgba(34, 197, 94, 0.4)",
              }}
            >
              {t.accept}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
