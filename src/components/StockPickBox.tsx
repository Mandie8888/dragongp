import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo } from "react";

interface StockData {
  ticker: string;
  livePrice: string;
  aiProbability: number;
  buyTarget: string;
  buyProb: number;
  sellTarget: string;
  sellProb: number;
  market: "US" | "HK";
  startPosition: { top: string; left: string };
  animationDelay: string;
}

// Helper to generate random price within range
const randomPrice = (base: number, variance: number): number => {
  return base + (Math.random() - 0.5) * 2 * variance;
};

// Helper to generate random probability
const randomProb = (base: number, variance: number): number => {
  return Math.min(99, Math.max(50, Math.round(base + (Math.random() - 0.5) * 2 * variance)));
};

const StockPickBox = () => {
  const { language } = useLanguage();

  // Trilingual labels
  const labels = {
    title: {
      en: "Stock Pick of the Day!",
      "zh-TW": "今日精選股票！",
      "zh-CN": "今日精选股票！",
    },
    aiProbability: {
      en: "AI Probability",
      "zh-TW": "人工智能概率",
      "zh-CN": "人工智能概率",
    },
    buyTarget: {
      en: "Buy",
      "zh-TW": "買入",
      "zh-CN": "买入",
    },
    sellTarget: {
      en: "Sell",
      "zh-TW": "賣出",
      "zh-CN": "卖出",
    },
    prob: {
      en: "Prob",
      "zh-TW": "概率",
      "zh-CN": "概率",
    },
  };

  // Generate fresh stock data on each page load/refresh
  const stocks: StockData[] = useMemo(() => {
    const nvdaLive = randomPrice(187, 8);
    const nvdaBuy = randomPrice(nvdaLive * 0.98, 3);
    const nvdaSell = randomPrice(nvdaLive * 1.4, 10);
    
    const hkLive = randomPrice(622, 20);
    const hkBuy = randomPrice(hkLive * 0.98, 8);
    const hkSell = randomPrice(hkLive * 1.24, 15);

    return [
      {
        ticker: "NVDA",
        livePrice: `$${nvdaLive.toFixed(2)}`,
        aiProbability: randomProb(92, 5),
        buyTarget: `$${nvdaBuy.toFixed(2)}`,
        buyProb: randomProb(88, 8),
        sellTarget: `$${nvdaSell.toFixed(2)}`,
        sellProb: randomProb(75, 10),
        market: "US",
        startPosition: { top: "15%", left: "5%" },
        animationDelay: "0s",
      },
      {
        ticker: "0700.HK",
        livePrice: `HK$${hkLive.toFixed(2)}`,
        aiProbability: randomProb(85, 6),
        buyTarget: `HK$${hkBuy.toFixed(2)}`,
        buyProb: randomProb(85, 8),
        sellTarget: `HK$${hkSell.toFixed(2)}`,
        sellProb: randomProb(70, 10),
        market: "HK",
        startPosition: { top: "25%", left: "65%" },
        animationDelay: "-20s",
      },
    ];
  }, []);

  // US: Green for Buy, Red for Sell
  // HK: Red for Buy, Green for Sell
  const getBuyColor = (market: "US" | "HK") => (market === "US" ? "#22C55E" : "#EF4444");
  const getSellColor = (market: "US" | "HK") => (market === "US" ? "#EF4444" : "#22C55E");

  return (
    <>
      {/* Show on all devices, positioned in center for visibility */}
      {stocks.map((stock, index) => (
        <div
          key={stock.ticker}
          className="fixed pointer-events-none animate-float-screen"
          style={{
            zIndex: 20,
            top: `${25 + index * 35}%`,
            left: "50%",
            transform: "translateX(-50%)",
            animationDelay: stock.animationDelay,
          }}
        >
          <div
            style={{
              minWidth: "120px",
              minHeight: "75px",
              backgroundColor: "rgba(20, 20, 20, 0.95)",
              border: "1.5px solid #22C55E",
              borderRadius: "6px",
              padding: "6px 8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              boxShadow: "0 3px 12px rgba(0, 0, 0, 0.8)",
            }}
          >
            {/* Title - Further reduced */}
            <span
              className="animate-pulse"
              style={{
                color: "#EF4444",
                fontSize: "0.65rem",
                fontWeight: 700,
                textAlign: "center",
                textShadow: "0 0 6px rgba(239, 68, 68, 0.9), 0 0 10px rgba(239, 68, 68, 0.7)",
              }}
            >
              {labels.title[language]}
            </span>

            {/* Ticker + Live Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span
                style={{
                  color: "#FFFFFF",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                {stock.ticker}
              </span>
              <span
                style={{
                  color: "#FFFFFF",
                  fontSize: "0.5rem",
                  fontWeight: 500,
                }}
              >
                {stock.livePrice}
              </span>
            </div>

            {/* AI Probability */}
            <span
              style={{
                color: "#D4AF37",
                fontSize: "0.45rem",
                fontWeight: 600,
              }}
            >
              {labels.aiProbability[language]}: {stock.aiProbability}%
            </span>

            {/* Buy Target Row */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                alignItems: "center",
                fontSize: "0.45rem",
                color: getBuyColor(stock.market),
                fontWeight: 600,
              }}
            >
              <span>
                {labels.buyTarget[language]}: {stock.buyTarget}
              </span>
              <span>({stock.buyProb}%)</span>
            </div>

            {/* Sell Target Row */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                alignItems: "center",
                fontSize: "0.45rem",
                color: getSellColor(stock.market),
                fontWeight: 600,
              }}
            >
              <span>
                {labels.sellTarget[language]}: {stock.sellTarget}
              </span>
              <span>({stock.sellProb}%)</span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default StockPickBox;
