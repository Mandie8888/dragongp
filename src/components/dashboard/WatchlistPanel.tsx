import { useLanguage } from "@/contexts/LanguageContext";
import { useWatchlist, WatchlistItem } from "@/hooks/useWatchlist";
import { useCredits } from "@/hooks/useCredits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, RefreshCw, TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const WatchlistPanel = () => {
  const { language } = useLanguage();
  const { watchlist } = useWatchlist();
  const { consumeCredit, isAuthenticated } = useCredits();
  const navigate = useNavigate();
  const { toast } = useToast();

  const t = {
    en: {
      title: "My Watchlist",
      rerun: "Re-run",
      emptyTitle: "Your watchlist is empty",
      emptyDesc: "Pick a stock to analyze and it will appear here for quick re-runs.",
      goAnalyze: "Choose a Stock",
    },
    "zh-TW": {
      title: "我的關注清單",
      rerun: "重新分析",
      emptyTitle: "您的關注清單為空",
      emptyDesc: "選擇一支股票進行分析，它將出現在這裡以便快速重新分析。",
      goAnalyze: "選擇股票",
    },
    "zh-CN": {
      title: "我的关注列表",
      rerun: "重新分析",
      emptyTitle: "您的关注列表为空",
      emptyDesc: "选择一支股票进行分析，它将出现在这里以便快速重新分析。",
      goAnalyze: "选择股票",
    },
  }[language] || {
    title: "My Watchlist",
    rerun: "Re-run",
    emptyTitle: "Your watchlist is empty",
    emptyDesc: "Pick a stock to analyze and it will appear here for quick re-runs.",
    goAnalyze: "Choose a Stock",
  };

  const handleRerun = async (item: WatchlistItem) => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }
    const success = await consumeCredit();
    if (success) {
      navigate(`/ai-stocks?symbol=${item.ticker}`);
    } else {
      toast({
        title: language === "en" ? "Insufficient Credits" : "积分不足",
        description: language === "en" ? "Please top up to continue." : "请充值以继续。",
        variant: "destructive",
      });
    }
  };

  const signalIcon = (signal: string) => {
    if (signal === "buy") return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (signal === "sell") return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center text-center py-8 px-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-display text-base font-semibold text-foreground mb-1">{t.emptyTitle}</h4>
            <p className="text-muted-foreground text-sm mb-4 max-w-[200px]">{t.emptyDesc}</p>
            <Button
              size="sm"
              className="bg-gradient-gold text-primary-foreground font-semibold hover:opacity-90"
              onClick={() => navigate("/ai-stocks")}
            >
              <BarChart3 className="w-4 h-4 mr-1" />
              {t.goAnalyze}
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {watchlist.slice(0, 6).map((item) => (
              <li
                key={item.ticker}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="flex items-center gap-3">
                  {signalIcon(item.aiSignal)}
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.ticker}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[120px]">{item.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${item.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {item.change >= 0 ? "+" : ""}{item.change.toFixed(2)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary"
                    onClick={() => handleRerun(item)}
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    {t.rerun}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default WatchlistPanel;
