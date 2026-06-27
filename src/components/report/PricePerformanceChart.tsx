import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PricePerformanceChartProps {
  ticker: string;
  name: string;
  price: number;
  market: string;
}

export function PricePerformanceChart({ ticker, name, price, market }: PricePerformanceChartProps) {
  const { language } = useLanguage();

  const labels = {
    en: {
      title: "12-Month Price vs. Index Performance",
      stock: ticker,
      index: market === "HK" ? "HSI" : market === "TW" ? "TAIEX" : "S&P 500",
      note: "Indexed to 100 at start of period. AI-simulated for illustration.",
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
    "zh-TW": {
      title: "12個月股價 vs 指數表現",
      stock: ticker,
      index: market === "HK" ? "恒生指數" : market === "TW" ? "加權指數" : "標普500",
      note: "以期初 = 100 為基準。AI 模擬，僅供參考。",
      month: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    },
    "zh-CN": {
      title: "12个月股价 vs 指数表现",
      stock: ticker,
      index: market === "HK" ? "恒生指数" : market === "TW" ? "加权指数" : "标普500",
      note: "以期初 = 100 为基准。AI 模拟，仅供参考。",
      month: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    },
  };

  const lang = language === "zh-TW" ? "zh-TW" : language === "zh-CN" ? "zh-CN" : "en";
  const t = labels[lang];

  // Generate deterministic simulated data based on ticker
  const chartData = useMemo(() => {
    const seed = ticker.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const rng = (i: number) => Math.sin(seed * 0.1 + i * 0.7) * 0.5 + 0.5;

    // Both start at exactly 100 for proper normalization
    const data: { month: string; stock: number; index: number }[] = [];
    let stockVal = 100;
    let indexVal = 100;

    // First point is the base
    data.push({ month: t.month[0], stock: 100, index: 100 });

    for (let i = 1; i < t.month.length; i++) {
      // Monthly percentage changes
      const stockReturn = (rng(i) - 0.45) * 8;
      const indexReturn = (rng(i + 50) - 0.47) * 5;
      stockVal *= (1 + stockReturn / 100);
      indexVal *= (1 + indexReturn / 100);
      data.push({
        month: t.month[i],
        stock: Math.round(stockVal * 10) / 10,
        index: Math.round(indexVal * 10) / 10,
      });
    }

    return data;
  }, [ticker, t.month]);

  return (
    <div className="mb-5 rounded-sm p-4 font-body" style={{ border: "0.5pt solid #d1d5db", backgroundColor: "#f9fafb", pageBreakInside: "avoid", breakInside: "avoid" }}>
      <h2 className="text-[0.95rem] font-bold mb-3 font-display flex items-center gap-2" style={{ color: "#1e293b" }}>
        📈 {t.title}
      </h2>

      <div className="bg-white rounded-sm p-3" style={{ border: "0.5pt solid #e5e7eb" }}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#64748b", fontFamily: "'Inter', sans-serif" }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={{ stroke: "#cbd5e1" }}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#64748b", fontFamily: "'Inter', sans-serif" }}
              axisLine={{ stroke: "#cbd5e1" }}
              tickLine={{ stroke: "#cbd5e1" }}
              domain={["dataMin - 5", "dataMax + 5"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "4px",
                fontSize: "11px",
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", fontFamily: "'Inter', sans-serif" }}
            />
            <Line
              type="monotone"
              dataKey="stock"
              name={t.stock}
              stroke="#003366"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="index"
              name={t.index}
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              dot={false}
              activeDot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-[0.6rem] mt-2 italic font-body text-right" style={{ color: "#94a3b8" }}>
        * {t.note}
      </p>
    </div>
  );
}
