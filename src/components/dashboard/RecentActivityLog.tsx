import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dragonLogo from "@/assets/dragon-logo.png";
import { characters } from "@/components/mark6/CharacterData";
import { History, BarChart3, Dices, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface AnalysisRecord {
  id: string;
  created_at: string;
  type: string;
  model_used: string | null;
  ticker: string | null;
  status: string;
  report_data: unknown;
}

const RecentActivityLog = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const t = {
    en: {
      title: "Recent Activity",
      view: "View Results",
      stock: "Stock Analysis",
      game: "AI Mark 6",
      completed: "Completed",
      emptyTitle: "No analyses yet",
      emptyGameCta: "Choose a partner to begin your AI prediction journey.",
      emptyStockCta: "Pick a stock to run your first AI analysis.",
      startGame: "Play AI Mark 6",
      startStock: "Analyze a Stock",
    },
    "zh-TW": {
      title: "最近活動",
      view: "查看報告",
      stock: "股票分析",
      game: "AI 六合彩",
      completed: "已完成",
      emptyTitle: "尚無分析紀錄",
      emptyGameCta: "選擇一位 AI 夥伴，開啟您的預測之旅。",
      emptyStockCta: "選擇一支股票，開始您的第一次 AI 分析。",
      startGame: "玩 AI Mark 6",
      startStock: "分析股票",
    },
    "zh-CN": {
      title: "最近活动",
      view: "查看报告",
      stock: "股票分析",
      game: "AI 六合彩",
      completed: "已完成",
      emptyTitle: "尚无分析记录",
      emptyGameCta: "选择一位 AI 伙伴，开启您的预测之旅。",
      emptyStockCta: "选择一支股票，开始您的第一次 AI 分析。",
      startGame: "玩 AI Mark 6",
      startStock: "分析股票",
    },
  }[language] || {
    title: "Recent Activity",
    view: "View Results",
    stock: "Stock Analysis",
    game: "AI Mark 6",
    completed: "Completed",
    emptyTitle: "No analyses yet",
    emptyGameCta: "Choose a partner to begin your AI prediction journey.",
    emptyStockCta: "Pick a stock to run your first AI analysis.",
    startGame: "Play AI Mark 6",
    startStock: "Analyze a Stock",
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("analysis_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(8);

      if (!error && data) setRecords(data as AnalysisRecord[]);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  // Get character avatar for game-type analyses
  const getCharacterAvatar = (modelUsed: string | null) => {
    if (!modelUsed) return null;
    const char = characters.find((c) => c.id === modelUsed || c.name.en.toLowerCase() === modelUsed?.toLowerCase());
    return char?.image || null;
  };

  const getCharacterName = (modelUsed: string | null) => {
    if (!modelUsed) return modelUsed;
    const char = characters.find((c) => c.id === modelUsed || c.name.en.toLowerCase() === modelUsed?.toLowerCase());
    if (!char) return modelUsed;
    return char.name[language] || char.name.en;
  };

  const handleViewResult = (rec: AnalysisRecord) => {
    if (rec.type === "stock" && rec.report_data) {
      // Navigate to stock report with stored data — no credit charge
      navigate("/report", { state: { reportData: rec.report_data } });
    } else if (rec.type === "stock" && rec.ticker) {
      navigate(`/report?symbol=${rec.ticker}`);
    } else {
      navigate("/mark6-results");
    }
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card" id="history">
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : records.length === 0 ? (
          <EmptyState t={t} navigate={navigate} />
        ) : (
          <div className="space-y-3">
            {records.map((rec) => {
              const avatar = rec.type === "game" ? getCharacterAvatar(rec.model_used) : null;
              const partnerName = rec.type === "game" ? getCharacterName(rec.model_used) : null;
              const isStock = rec.type === "stock";

              return (
                <div
                  key={rec.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  {/* Avatar / Icon */}
                  <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center shrink-0 border border-border overflow-hidden">
                    {avatar ? (
                      <img src={avatar} alt={partnerName || ""} className="w-full h-full object-cover" />
                    ) : isStock ? (
                      <BarChart3 className="w-5 h-5 text-primary" />
                    ) : (
                      <Dices className="w-5 h-5 text-accent" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${isStock ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>
                        {isStock ? t.stock : t.game}
                      </span>
                      {rec.ticker && (
                        <span className="text-sm font-semibold text-foreground truncate">{rec.ticker}</span>
                      )}
                      {partnerName && (
                        <span className="text-xs text-muted-foreground truncate hidden sm:inline">
                          w/ {partnerName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(rec.created_at), "MMM d, yyyy · h:mm a")}
                    </p>
                  </div>

                  {/* Status + Action */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 hidden sm:inline-block">
                      {t.completed}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary text-xs"
                      onClick={() => handleViewResult(rec)}
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      <span className="hidden sm:inline">{t.view}</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Extracted empty state component
const EmptyState = ({ t, navigate }: { t: Record<string, string>; navigate: (path: string) => void }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center shadow-gold">
        <img src={dragonLogo} alt="Dragon" className="w-16 h-16 glow-gold" />
      </div>
      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
        <Dices className="w-3.5 h-3.5 text-accent-foreground" />
      </div>
      <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
        <BarChart3 className="w-3.5 h-3.5 text-primary-foreground" />
      </div>
    </div>

    <h3 className="font-display text-xl font-semibold text-foreground mb-2">{t.emptyTitle}</h3>

    <div className="space-y-3 w-full max-w-xs">
      <div className="rounded-xl border border-border bg-secondary/50 p-4 text-center">
        <Dices className="w-6 h-6 text-accent mx-auto mb-2" />
        <p className="text-sm text-muted-foreground mb-3">{t.emptyGameCta}</p>
        <Button
          size="sm"
          className="bg-gradient-dragon text-foreground font-semibold hover:opacity-90 w-full"
          onClick={() => navigate("/mark6-game")}
        >
          {t.startGame}
        </Button>
      </div>
      <div className="rounded-xl border border-border bg-secondary/50 p-4 text-center">
        <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
        <p className="text-sm text-muted-foreground mb-3">{t.emptyStockCta}</p>
        <Button
          size="sm"
          className="bg-gradient-gold text-primary-foreground font-semibold hover:opacity-90 w-full"
          onClick={() => navigate("/ai-stocks")}
        >
          {t.startStock}
        </Button>
      </div>
    </div>
  </div>
);

export default RecentActivityLog;
