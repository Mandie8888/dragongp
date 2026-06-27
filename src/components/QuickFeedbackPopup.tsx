import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FEEDBACK_POPUP_KEY = "dragongp_feedback_shown_v1";
const REPORT_VIEW_KEY = "dragongp_report_views";
const TRIAL_END = new Date("2026-02-25T00:00:00Z");

const content = {
  en: {
    title: "🌟 How's your experience?",
    subtitle: "Quick rating helps us improve!",
    placeholder: "Any thoughts? (optional)",
    submit: "Submit",
    skip: "Maybe Later",
    thanks: "Thank you for your feedback!",
  },
  "zh-TW": {
    title: "🌟 您的體驗如何？",
    subtitle: "快速評分幫助我們改進！",
    placeholder: "有什麼想法？（選填）",
    submit: "提交",
    skip: "稍後再說",
    thanks: "感謝您的回饋！",
  },
  "zh-CN": {
    title: "🌟 您的体验如何？",
    subtitle: "快速评分帮助我们改进！",
    placeholder: "有什么想法？（选填）",
    submit: "提交",
    skip: "稍后再说",
    thanks: "感谢您的反馈！",
  },
};

export function useReportViewTracker() {
  const incrementViews = () => {
    const current = parseInt(localStorage.getItem(REPORT_VIEW_KEY) || "0", 10);
    localStorage.setItem(REPORT_VIEW_KEY, String(current + 1));
    return current + 1;
  };

  const getViews = () => parseInt(localStorage.getItem(REPORT_VIEW_KEY) || "0", 10);

  const shouldShowFeedback = () => {
    if (new Date() >= TRIAL_END) return false;
    if (localStorage.getItem(FEEDBACK_POPUP_KEY)) return false;
    const views = getViews();
    return views >= 3 && views % 3 === 0; // every 3rd report
  };

  return { incrementViews, shouldShowFeedback };
}

interface QuickFeedbackPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickFeedbackPopup({ open, onOpenChange }: QuickFeedbackPopupProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const t = content[language] || content.en;
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      await supabase.functions.invoke("send-contact-email", {
        body: {
          name: user?.email?.split("@")[0] || "Anonymous",
          email: user?.email || "no-email@unknown.com",
          subject: "Quick Feedback Rating",
          message: `Rating: ${rating}/5${comment ? `\nComment: ${comment}` : ""}`,
          rating,
        },
      });

      localStorage.setItem(FEEDBACK_POPUP_KEY, "true");
      toast({ title: t.thanks });
      onOpenChange(false);
    } catch (err) {
      console.error("Feedback error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Don't mark as permanently dismissed, just close
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm border-0 p-0 overflow-hidden mx-4"
        style={{
          background: "linear-gradient(135deg, #1a0a0a 0%, #2a1a1e 50%, #0a0a0a 100%)",
          border: "2px solid rgba(255, 215, 0, 0.4)",
          boxShadow: "0 0 40px rgba(255, 215, 0, 0.15)",
        }}
      >
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold mb-1" style={{ color: "#FFD700" }}>
            {t.title}
          </h3>
          <p className="text-xs mb-4" style={{ color: "#999" }}>
            {t.subtitle}
          </p>

          {/* Star Rating */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className="w-8 h-8 transition-colors"
                  fill={star <= (hovered || rating) ? "#FFD700" : "transparent"}
                  stroke={star <= (hovered || rating) ? "#FFD700" : "#555"}
                />
              </button>
            ))}
          </div>

          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={t.placeholder}
            className="bg-background/50 resize-none mb-4 text-sm"
            rows={2}
          />

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="flex-1 text-muted-foreground text-xs"
            >
              {t.skip}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || submitting}
              className="flex-1 font-bold"
              style={{
                background: rating > 0 ? "linear-gradient(135deg, #FFD700, #FFA500)" : undefined,
                color: rating > 0 ? "#1a1a1a" : undefined,
              }}
            >
              {t.submit}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
