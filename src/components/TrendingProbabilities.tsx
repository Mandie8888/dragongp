import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye } from "lucide-react";

interface TrendingTicker {
  symbol: string;
  market: string;
  search_count: number;
  mockProbability: number;
  mockDirection: "bullish" | "bearish" | "neutral";
}

// Company name mapping for display
const companyNames: Record<string, { en: string; "zh-TW": string; "zh-CN": string }> = {
  // US Stocks
  TSLA: { en: "Tesla", "zh-TW": "特斯拉", "zh-CN": "特斯拉" },
  AAPL: { en: "Apple", "zh-TW": "蘋果", "zh-CN": "苹果" },
  NVDA: { en: "NVIDIA", "zh-TW": "輝達", "zh-CN": "英伟达" },
  MSFT: { en: "Microsoft", "zh-TW": "微軟", "zh-CN": "微软" },
  AMZN: { en: "Amazon", "zh-TW": "亞馬遜", "zh-CN": "亚马逊" },
  GOOGL: { en: "Alphabet", "zh-TW": "谷歌", "zh-CN": "谷歌" },
  META: { en: "Meta", "zh-TW": "Meta", "zh-CN": "Meta" },
  AMD: { en: "AMD", "zh-TW": "超微", "zh-CN": "超微" },
  INTC: { en: "Intel", "zh-TW": "英特爾", "zh-CN": "英特尔" },
  COIN: { en: "Coinbase", "zh-TW": "Coinbase", "zh-CN": "Coinbase" },
  // HK Stocks
  "0700.HK": { en: "Tencent", "zh-TW": "騰訊", "zh-CN": "腾讯" },
  "0001.HK": { en: "CK Hutchison", "zh-TW": "長和", "zh-CN": "长和" },
  "9988.HK": { en: "Alibaba", "zh-TW": "阿里巴巴", "zh-CN": "阿里巴巴" },
  "3690.HK": { en: "Meituan", "zh-TW": "美團", "zh-CN": "美团" },
  "1810.HK": { en: "Xiaomi", "zh-TW": "小米", "zh-CN": "小米" },
  "2318.HK": { en: "Ping An", "zh-TW": "平安", "zh-CN": "平安" },
  "0005.HK": { en: "HSBC", "zh-TW": "滙豐", "zh-CN": "汇丰" },
  "0388.HK": { en: "HKEX", "zh-TW": "港交所", "zh-CN": "港交所" },
  "0941.HK": { en: "China Mobile", "zh-TW": "中國移動", "zh-CN": "中国移动" },
  "1299.HK": { en: "AIA", "zh-TW": "友邦", "zh-CN": "友邦" },
};

export function TrendingProbabilities() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [usTicker, setUsTicker] = useState<TrendingTicker | null>(null);
  const [hkTicker, setHkTicker] = useState<TrendingTicker | null>(null);
  const [loading, setLoading] = useState(true);

  const content = {
    en: {
      usLabel: "US",
      hkLabel: "HK",
      aiScore: "AI Prediction",
      stockPick: "Stock Pick of the Day",
      probability: "Probability",
      targetPrice: "Target Price",
    },
    "zh-TW": {
      usLabel: "美股",
      hkLabel: "港股",
      aiScore: "AI預測",
      stockPick: "今日精選股票",
      probability: "概率",
      targetPrice: "目標價",
    },
    "zh-CN": {
      usLabel: "美股",
      hkLabel: "港股",
      aiScore: "AI预测",
      stockPick: "今日精选股票",
      probability: "概率",
      targetPrice: "目标价",
    },
  };

  const t = content[language] || content.en;

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        // Fetch top US ticker
        const { data: usData } = await supabase.rpc("get_trending_tickers", {
          p_market: "US",
          p_limit: 1,
        });

        // Fetch top HK ticker
        const { data: hkData } = await supabase.rpc("get_trending_tickers", {
          p_market: "HK",
          p_limit: 1,
        });

        const enrichTicker = (item: { symbol: string; market: string; search_count: number }): TrendingTicker => {
          const probability = 45 + Math.random() * 35;
          let direction: "bullish" | "bearish" | "neutral";
          if (probability > 60) direction = "bullish";
          else if (probability < 45) direction = "bearish";
          else direction = "neutral";
          return { ...item, mockProbability: probability, mockDirection: direction };
        };

        if (usData && usData.length > 0) {
          setUsTicker(enrichTicker(usData[0]));
        }
        if (hkData && hkData.length > 0) {
          setHkTicker(enrichTicker(hkData[0]));
        }
      } catch (err) {
        console.error("Error fetching trending:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const getCompanyName = (symbol: string) => {
    const company = companyNames[symbol];
    if (company) {
      return company[language] || company.en;
    }
    return symbol;
  };

  const handleView = (symbol: string) => {
    navigate(`/ai-stocks?symbol=${encodeURIComponent(symbol)}`);
  };

  const renderCard = (ticker: TrendingTicker | null, marketLabel: string) => {
    if (loading || !ticker) {
      return (
        <div className="rounded-lg bg-card/50 backdrop-blur-md border border-border/50 p-2.5 w-[120px] shadow-lg">
          <Skeleton className="h-6 w-6 rounded-full mx-auto mb-1.5" />
          <Skeleton className="h-3 w-12 mx-auto mb-1" />
          <Skeleton className="h-2 w-14 mx-auto" />
        </div>
      );
    }

    return (
      <div
        onClick={() => handleView(ticker.symbol)}
        className="relative rounded-xl cursor-pointer transition-all duration-300"
        style={{
          minWidth: '220px',
          minHeight: '120px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
          backgroundColor: '#1e1e23',
          background: 'linear-gradient(145deg, #252530 0%, #1a1a1f 100%)',
          border: '3px solid #d4af37',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.25)',
          zIndex: 50,
        }}
      >
        {/* Stock Pick Title */}
        <p 
          style={{ 
            color: '#FFD700', 
            fontSize: '0.875rem',
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: '8px',
            lineHeight: 1.3,
            overflow: 'visible',
            whiteSpace: 'nowrap',
            zIndex: 51,
            position: 'relative',
          }}
        >
          {t.stockPick}
        </p>

        {/* Market Badge */}
        <div 
          style={{
            position: 'absolute',
            top: '-10px',
            left: '-10px',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.625rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
            color: '#000',
            zIndex: 52,
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          {marketLabel}
        </div>

        {/* Company Initial Circle */}
        <div 
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '6px',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.4) 0%, rgba(184, 134, 11, 0.4) 100%)',
            border: '2px solid #d4af37',
          }}
        >
          <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '14px' }}>
            {ticker.symbol.replace(/\d+\.?/, "").charAt(0)}
          </span>
        </div>

        {/* Ticker Symbol */}
        <p 
          style={{ 
            color: '#FFFFFF', 
            fontSize: '1.25rem',
            fontWeight: 700,
            fontFamily: 'monospace',
            textAlign: 'center',
            marginBottom: '2px',
            zIndex: 51,
            position: 'relative',
          }}
        >
          {ticker.symbol}
        </p>

        {/* Company Name */}
        <p 
          style={{ 
            color: '#b0b0b0', 
            fontSize: '0.75rem',
            textAlign: 'center',
            marginBottom: '10px',
            zIndex: 51,
            position: 'relative',
          }}
        >
          {getCompanyName(ticker.symbol)}
        </p>

        {/* Probability Label & Score - Blurred */}
        <div style={{ zIndex: 51, position: 'relative', marginBottom: '10px', textAlign: 'center' }}>
          <p 
            style={{ 
              color: '#FFD700',
              fontSize: '0.875rem',
              fontWeight: 500,
              marginBottom: '2px',
            }}
          >
            {t.probability}
          </p>
          <div style={{ filter: 'blur(3px)', userSelect: 'none' }}>
            <span
              style={{
                fontWeight: 'bold',
                fontSize: '1rem',
                color: ticker.mockDirection === "bullish"
                  ? "#34d399"
                  : ticker.mockDirection === "bearish"
                  ? "#f87171"
                  : "#fbbf24"
              }}
            >
              ↑{ticker.mockProbability.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Electric Green View Button with Neon Glow */}
        <button
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            fontWeight: 700,
            fontSize: '0.75rem',
            background: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
            color: '#000000',
            boxShadow: '0 0 12px rgba(0, 255, 136, 0.6), 0 0 24px rgba(0, 255, 136, 0.3)',
            textShadow: '0 0 2px rgba(0, 0, 0, 0.3)',
            zIndex: 51,
            position: 'relative',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleView(ticker.symbol);
          }}
        >
          <Eye style={{ width: '14px', height: '14px' }} />
          View
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Full-viewport floating cards - fixed screensaver style on top of all elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
        {/* US Card - bounces independently */}
        <div className="absolute top-16 left-4 animate-screensaver-1 pointer-events-auto">
          <div>{renderCard(usTicker, t.usLabel)}</div>
        </div>

        {/* HK Card - bounces independently with offset timing */}
        <div className="absolute top-32 right-4 animate-screensaver-2 pointer-events-auto">
          <div>{renderCard(hkTicker, t.hkLabel)}</div>
        </div>
      </div>
    </>
  );
}
