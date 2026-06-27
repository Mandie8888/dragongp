import { useLanguage } from "@/contexts/LanguageContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

type TermKey = "rsi" | "macd" | "sentiment";

interface PatternTermProps {
  term: TermKey;
  children: React.ReactNode;
  showIcon?: boolean;
}

const dictionaryContent = {
  rsi: {
    en: {
      title: "RSI (Relative Strength Index)",
      description: "A momentum oscillator that measures the speed and change of price movements. Typically, a value above 70 suggests 'Overbought' (high heat), while below 30 suggests 'Oversold' (cool down).",
    },
    tc: {
      title: "RSI（相對強弱指數）",
      description: "一種動量震盪指標，用於衡量價格變動的速度和變化。通常，數值超過 70 表示「超買」（熱度過高），低於 30 則表示「超賣」（冷卻回落）。",
    },
    sc: {
      title: "RSI（相对强弱指数）",
      description: "一种动量震荡指标，用于衡量价格变动的速度和变化。通常，数值超过 70 表示'超买'（热度过高），低于 30 则表示'超卖'（冷却回落）。",
    },
  },
  macd: {
    en: {
      title: "MACD (Moving Average Convergence Divergence)",
      description: "A trend-following momentum indicator that shows the relationship between two moving averages of a stock's price. It helps identify when a new trend is gathering strength.",
    },
    tc: {
      title: "MACD（移動平均收斂發散指標）",
      description: "一種趨勢確認動量指標，顯示股票價格兩條移動平均線之間的關係。它有助於識別新趨勢何時開始增強。",
    },
    sc: {
      title: "MACD（移动平均收敛发散指标）",
      description: "一种趋势确认动量指标，显示股票价格两条移动平均线之间的关系。它有助于识别新趋势何时开始增强。",
    },
  },
  sentiment: {
    en: {
      title: "Sentiment Analysis (AI News Summary)",
      description: "Our AI scans global headlines from the last 48 hours to gauge market emotion. It categorizes news as Positive, Neutral, or Negative to provide context to the mathematical numbers.",
    },
    tc: {
      title: "情緒分析（AI 新聞摘要）",
      description: "我們的 AI 掃描過去 48 小時的全球頭條新聞以衡量市場情緒。它將新聞分為「正面」、「中性」或「負面」，為數學數據提供背景資訊。",
    },
    sc: {
      title: "情绪分析（AI 新闻摘要）",
      description: "我们的 AI 扫描过去 48 小时的全球头条新闻以衡量市场情绪。它将新闻分为'正面'、'中性'或'负面'，为数学数据提供背景信息。",
    },
  },
};

export function PatternTerm({ term, children, showIcon = true }: PatternTermProps) {
  const { language } = useLanguage();
  
  const langKey = language === "zh-TW" ? "tc" : language === "zh-CN" ? "sc" : "en";
  const content = dictionaryContent[term][langKey];

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 cursor-help border-b border-dashed border-gold/50 hover:border-gold hover:text-gold transition-colors">
            {children}
            {showIcon && <HelpCircle className="w-3 h-3 text-gold/60" />}
          </span>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs p-4 bg-card/95 backdrop-blur-md border-gold/30 shadow-lg"
        >
          <div className="space-y-2">
            <h4 className="font-display font-semibold text-gold text-sm">{content.title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{content.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Dictionary panel for the report page
export function PatternDictionary() {
  const { language } = useLanguage();

  const headerContent = {
    en: { title: "Pattern Dictionary", subtitle: "Tap any term to learn more" },
    tc: { title: "模式詞典", subtitle: "點擊任何術語了解更多" },
    sc: { title: "模式词典", subtitle: "点击任何术语了解更多" },
  };

  const langKey = language === "zh-TW" ? "tc" : language === "zh-CN" ? "sc" : "en";
  const header = headerContent[langKey];

  const terms: TermKey[] = ["rsi", "macd", "sentiment"];

  return (
    <div className="p-4 rounded-xl bg-muted/10 border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-display font-semibold text-foreground">{header.title}</h3>
          <p className="text-xs text-muted-foreground">{header.subtitle}</p>
        </div>
        <HelpCircle className="w-5 h-5 text-gold/60" />
      </div>

      <div className="flex flex-wrap gap-2">
        {terms.map((term) => {
          const content = dictionaryContent[term][langKey];
          return (
            <TooltipProvider key={term} delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="px-3 py-1.5 text-xs font-medium rounded-full bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 hover:border-gold/50 transition-all cursor-help">
                    {term.toUpperCase()}
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom" 
                  align="center"
                  className="max-w-sm p-4 bg-card/95 backdrop-blur-md border-gold/30 shadow-xl z-50"
                >
                  <div className="space-y-2">
                    <h4 className="font-display font-semibold text-gold text-sm">{content.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{content.description}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}
