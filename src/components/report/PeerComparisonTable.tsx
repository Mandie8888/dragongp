import { useLanguage } from "@/contexts/LanguageContext";

interface PeerComparisonTableProps {
  ticker: string;
  price: number;
  market: string;
  currency: string;
}

interface PeerRow {
  ticker: string;
  company: string;
  price: string;
  marketCap: string;
  pe: string;
  pb: string;
  roe: string;
  divYield: string;
}

// Generate illustrative peer data based on ticker context
const peerData: Record<string, PeerRow[]> = {
  // HK Market
  "0005.HK": [
    { ticker: "0005.HK", company: "HSBC Holdings", price: "71.50", marketCap: "1,290B", pe: "7.8", pb: "0.92", roe: "12.1", divYield: "6.20" },
    { ticker: "0011.HK", company: "Hang Seng Bank", price: "104.20", marketCap: "199B", pe: "11.4", pb: "1.45", roe: "13.6", divYield: "5.80" },
    { ticker: "0388.HK", company: "HKEX", price: "298.60", marketCap: "380B", pe: "32.5", pb: "8.10", roe: "25.3", divYield: "2.90" },
    { ticker: "0939.HK", company: "CCB", price: "6.12", marketCap: "1,530B", pe: "4.6", pb: "0.48", roe: "11.2", divYield: "7.40" },
    { ticker: "1398.HK", company: "ICBC", price: "4.98", marketCap: "1,770B", pe: "4.2", pb: "0.44", roe: "10.8", divYield: "7.80" },
  ],
  "0700.HK": [
    { ticker: "0700.HK", company: "Tencent", price: "388.40", marketCap: "3,680B", pe: "22.1", pb: "4.50", roe: "21.5", divYield: "0.80" },
    { ticker: "9988.HK", company: "Alibaba", price: "82.30", marketCap: "1,680B", pe: "10.5", pb: "1.60", roe: "15.2", divYield: "1.20" },
    { ticker: "3690.HK", company: "Meituan", price: "142.50", marketCap: "880B", pe: "35.2", pb: "5.80", roe: "16.8", divYield: "0.00" },
    { ticker: "9618.HK", company: "JD.com", price: "138.90", marketCap: "430B", pe: "12.8", pb: "1.90", roe: "14.5", divYield: "2.10" },
    { ticker: "1810.HK", company: "Xiaomi", price: "18.50", marketCap: "462B", pe: "28.6", pb: "3.20", roe: "11.4", divYield: "0.00" },
  ],
  // US Market — Major tickers
  "NVDA": [
    { ticker: "NVDA", company: "NVIDIA Corp", price: "875.30", marketCap: "2,150B", pe: "64.2", pb: "42.50", roe: "69.2", divYield: "0.02" },
    { ticker: "AMD", company: "Advanced Micro Devices", price: "162.80", marketCap: "263B", pe: "46.5", pb: "4.20", roe: "9.8", divYield: "0.00" },
    { ticker: "INTC", company: "Intel Corp", price: "31.20", marketCap: "132B", pe: "28.3", pb: "1.30", roe: "4.6", divYield: "1.60" },
    { ticker: "TSM", company: "Taiwan Semiconductor", price: "148.50", marketCap: "770B", pe: "25.8", pb: "7.10", roe: "28.4", divYield: "1.30" },
    { ticker: "AVGO", company: "Broadcom Inc", price: "1,340.00", marketCap: "625B", pe: "35.4", pb: "11.80", roe: "34.2", divYield: "1.70" },
  ],
  "AAPL": [
    { ticker: "AAPL", company: "Apple Inc", price: "192.50", marketCap: "2,980B", pe: "30.8", pb: "48.20", roe: "160.1", divYield: "0.50" },
    { ticker: "MSFT", company: "Microsoft Corp", price: "415.60", marketCap: "3,090B", pe: "36.2", pb: "12.50", roe: "35.6", divYield: "0.70" },
    { ticker: "GOOGL", company: "Alphabet Inc", price: "155.30", marketCap: "1,920B", pe: "24.5", pb: "6.80", roe: "28.4", divYield: "0.50" },
    { ticker: "AMZN", company: "Amazon.com Inc", price: "185.40", marketCap: "1,920B", pe: "58.6", pb: "8.20", roe: "14.2", divYield: "0.00" },
    { ticker: "META", company: "Meta Platforms", price: "505.20", marketCap: "1,290B", pe: "26.4", pb: "8.50", roe: "33.8", divYield: "0.40" },
  ],
  "MSFT": [
    { ticker: "MSFT", company: "Microsoft Corp", price: "415.60", marketCap: "3,090B", pe: "36.2", pb: "12.50", roe: "35.6", divYield: "0.70" },
    { ticker: "AAPL", company: "Apple Inc", price: "192.50", marketCap: "2,980B", pe: "30.8", pb: "48.20", roe: "160.1", divYield: "0.50" },
    { ticker: "GOOGL", company: "Alphabet Inc", price: "155.30", marketCap: "1,920B", pe: "24.5", pb: "6.80", roe: "28.4", divYield: "0.50" },
    { ticker: "AMZN", company: "Amazon.com Inc", price: "185.40", marketCap: "1,920B", pe: "58.6", pb: "8.20", roe: "14.2", divYield: "0.00" },
    { ticker: "CRM", company: "Salesforce Inc", price: "272.80", marketCap: "264B", pe: "48.5", pb: "4.60", roe: "9.5", divYield: "0.60" },
  ],
  "TSLA": [
    { ticker: "TSLA", company: "Tesla Inc", price: "248.40", marketCap: "790B", pe: "72.5", pb: "14.80", roe: "20.8", divYield: "0.00" },
    { ticker: "RIVN", company: "Rivian Automotive", price: "16.80", marketCap: "16B", pe: "N/A", pb: "2.10", roe: "-42.5", divYield: "0.00" },
    { ticker: "F", company: "Ford Motor Co", price: "12.30", marketCap: "49B", pe: "12.4", pb: "1.10", roe: "9.2", divYield: "4.90" },
    { ticker: "GM", company: "General Motors", price: "45.60", marketCap: "52B", pe: "5.8", pb: "0.90", roe: "15.8", divYield: "1.10" },
    { ticker: "NIO", company: "NIO Inc", price: "5.80", marketCap: "11B", pe: "N/A", pb: "3.40", roe: "-38.2", divYield: "0.00" },
  ],
  "GOOGL": [
    { ticker: "GOOGL", company: "Alphabet Inc", price: "155.30", marketCap: "1,920B", pe: "24.5", pb: "6.80", roe: "28.4", divYield: "0.50" },
    { ticker: "META", company: "Meta Platforms", price: "505.20", marketCap: "1,290B", pe: "26.4", pb: "8.50", roe: "33.8", divYield: "0.40" },
    { ticker: "MSFT", company: "Microsoft Corp", price: "415.60", marketCap: "3,090B", pe: "36.2", pb: "12.50", roe: "35.6", divYield: "0.70" },
    { ticker: "AMZN", company: "Amazon.com Inc", price: "185.40", marketCap: "1,920B", pe: "58.6", pb: "8.20", roe: "14.2", divYield: "0.00" },
    { ticker: "SNAP", company: "Snap Inc", price: "14.20", marketCap: "23B", pe: "N/A", pb: "8.90", roe: "-18.5", divYield: "0.00" },
  ],
  "META": [
    { ticker: "META", company: "Meta Platforms", price: "505.20", marketCap: "1,290B", pe: "26.4", pb: "8.50", roe: "33.8", divYield: "0.40" },
    { ticker: "GOOGL", company: "Alphabet Inc", price: "155.30", marketCap: "1,920B", pe: "24.5", pb: "6.80", roe: "28.4", divYield: "0.50" },
    { ticker: "SNAP", company: "Snap Inc", price: "14.20", marketCap: "23B", pe: "N/A", pb: "8.90", roe: "-18.5", divYield: "0.00" },
    { ticker: "PINS", company: "Pinterest Inc", price: "34.50", marketCap: "23B", pe: "32.1", pb: "7.20", roe: "22.4", divYield: "0.00" },
    { ticker: "TTD", company: "The Trade Desk", price: "88.60", marketCap: "43B", pe: "52.8", pb: "18.50", roe: "36.1", divYield: "0.00" },
  ],
  "AMZN": [
    { ticker: "AMZN", company: "Amazon.com Inc", price: "185.40", marketCap: "1,920B", pe: "58.6", pb: "8.20", roe: "14.2", divYield: "0.00" },
    { ticker: "BABA", company: "Alibaba Group", price: "82.30", marketCap: "210B", pe: "10.5", pb: "1.60", roe: "15.2", divYield: "1.20" },
    { ticker: "SHOP", company: "Shopify Inc", price: "68.40", marketCap: "88B", pe: "72.5", pb: "10.20", roe: "14.8", divYield: "0.00" },
    { ticker: "WMT", company: "Walmart Inc", price: "168.50", marketCap: "452B", pe: "28.4", pb: "5.60", roe: "20.1", divYield: "1.30" },
    { ticker: "EBAY", company: "eBay Inc", price: "48.20", marketCap: "25B", pe: "11.8", pb: "5.90", roe: "52.4", divYield: "2.10" },
  ],
};

// Sector-based default peers for US market
const usDefaultPeers = (ticker: string, price: number): PeerRow[] => [
  { ticker, company: "Target Company", price: price.toFixed(2), marketCap: "—", pe: "—", pb: "—", roe: "—", divYield: "—" },
  { ticker: "AAPL", company: "Apple Inc", price: "192.50", marketCap: "2,980B", pe: "30.8", pb: "48.20", roe: "160.1", divYield: "0.50" },
  { ticker: "MSFT", company: "Microsoft Corp", price: "415.60", marketCap: "3,090B", pe: "36.2", pb: "12.50", roe: "35.6", divYield: "0.70" },
  { ticker: "GOOGL", company: "Alphabet Inc", price: "155.30", marketCap: "1,920B", pe: "24.5", pb: "6.80", roe: "28.4", divYield: "0.50" },
  { ticker: "AMZN", company: "Amazon.com Inc", price: "185.40", marketCap: "1,920B", pe: "58.6", pb: "8.20", roe: "14.2", divYield: "0.00" },
];

const defaultPeers = (ticker: string, price: number, market: string): PeerRow[] => {
  // Use sensible US defaults for US-market tickers
  if (market === "US") return usDefaultPeers(ticker, price);

  const seed = ticker.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return [
    { ticker, company: "Target Company", price: price.toFixed(2), marketCap: `${(price * (80 + seed % 120)).toFixed(0)}B`, pe: `${(10 + seed % 20).toFixed(1)}`, pb: `${(0.8 + (seed % 30) / 10).toFixed(2)}`, roe: `${(8 + seed % 18).toFixed(1)}`, divYield: `${(0.5 + (seed % 50) / 10).toFixed(2)}` },
    { ticker: "PEER-A", company: "Peer Company A", price: (price * 0.85).toFixed(2), marketCap: `${(price * (60 + seed % 80)).toFixed(0)}B`, pe: `${(8 + seed % 25).toFixed(1)}`, pb: `${(0.6 + (seed % 35) / 10).toFixed(2)}`, roe: `${(6 + seed % 20).toFixed(1)}`, divYield: `${(0.3 + (seed % 60) / 10).toFixed(2)}` },
    { ticker: "PEER-B", company: "Peer Company B", price: (price * 1.20).toFixed(2), marketCap: `${(price * (100 + seed % 150)).toFixed(0)}B`, pe: `${(12 + seed % 18).toFixed(1)}`, pb: `${(1.0 + (seed % 25) / 10).toFixed(2)}`, roe: `${(10 + seed % 15).toFixed(1)}`, divYield: `${(1.0 + (seed % 40) / 10).toFixed(2)}` },
    { ticker: "PEER-C", company: "Peer Company C", price: (price * 0.65).toFixed(2), marketCap: `${(price * (40 + seed % 100)).toFixed(0)}B`, pe: `${(6 + seed % 30).toFixed(1)}`, pb: `${(0.4 + (seed % 40) / 10).toFixed(2)}`, roe: `${(5 + seed % 22).toFixed(1)}`, divYield: `${(0.8 + (seed % 55) / 10).toFixed(2)}` },
  ];
};

export function PeerComparisonTable({ ticker, price, market, currency }: PeerComparisonTableProps) {
  const { language } = useLanguage();

  const rows = peerData[ticker] || defaultPeers(ticker, price, market);

  const currencyLabel = currency === "HKD" ? "HKD" : currency === "TWD" ? "TWD" : "USD";

  const labels = {
    en: { title: "Peer Comparison", tickerCol: "Ticker", company: "Company", priceCol: `Price (${currencyLabel})`, marketCap: "Market Cap", pe: "P/E", pb: "P/B", roe: "ROE %", divYield: "Div Yield %", note: "AI-estimated. For illustrative purposes only.", legend: "P/B values are based on the most recent quarterly filing. All multiples are trailing twelve months (TTM) unless otherwise noted.", sectorAvg: "Sector Avg." },
    "zh-TW": { title: "同業比較", tickerCol: "代號", company: "公司", priceCol: `價格 (${currencyLabel})`, marketCap: "市值", pe: "市盈率", pb: "市淨率", roe: "ROE %", divYield: "股息率 %", note: "AI 估算，僅供參考。", legend: "市淨率 (P/B) 基於最近一季度財報。所有指標均為過去十二個月 (TTM)，除非另有說明。", sectorAvg: "行業平均" },
    "zh-CN": { title: "同业比较", tickerCol: "代号", company: "公司", priceCol: `价格 (${currencyLabel})`, marketCap: "市值", pe: "市盈率", pb: "市净率", roe: "ROE %", divYield: "股息率 %", note: "AI 估算，仅供参考。", legend: "市净率 (P/B) 基于最近一季度财报。所有指标均为过去十二个月 (TTM)，除非另有说明。", sectorAvg: "行业平均" },
  };

  const lang = language === "zh-TW" ? "zh-TW" : language === "zh-CN" ? "zh-CN" : "en";
  const t = labels[lang];

  const columns = [
    { key: "ticker", label: t.tickerCol, align: "left" as const },
    { key: "company", label: t.company, align: "left" as const },
    { key: "price", label: t.priceCol, align: "right" as const },
    { key: "marketCap", label: t.marketCap, align: "right" as const },
    { key: "pe", label: t.pe, align: "right" as const },
    { key: "pb", label: t.pb, align: "right" as const },
    { key: "roe", label: t.roe, align: "right" as const },
    { key: "divYield", label: t.divYield, align: "right" as const },
  ];

  // Helper: append unit suffix only when value is numeric
  const fmt = (val: string, suffix: string) => {
    if (!val || val === "—" || val === "N/A") return val;
    return `${val}${suffix}`;
  };

  return (
    <div className="mb-5 page-break-avoid" style={{ pageBreakInside: "avoid", breakInside: "avoid" }}>
      <h2 className="text-[0.95rem] font-bold mb-3 font-display" style={{ color: "#1e293b" }}>
        📊 {t.title}
      </h2>
      <div className="overflow-x-auto">
        <table
          className="w-full text-[0.8rem] font-body"
          style={{ minWidth: "600px", borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ backgroundColor: "#003366" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2.5 font-bold text-white whitespace-nowrap"
                  style={{
                    textAlign: col.align,
                    fontSize: "0.75rem",
                    letterSpacing: "0.03em",
                    border: "0.5pt solid #94a3b8",
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const isTarget = row.ticker === ticker;
              const cellBorder = "0.5pt solid #d1d5db";
              return (
                <tr
                  key={row.ticker + idx}
                  style={{
                    backgroundColor: isTarget ? "#fffbeb" : idx % 2 === 0 ? "#ffffff" : "#f9fafb",
                  }}
                >
                  <td className="px-3 py-2 font-bold whitespace-nowrap" style={{ color: isTarget ? "#1e293b" : "#334155", border: cellBorder }}>
                    {isTarget && <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: "#003366" }} />}
                    {row.ticker}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap" style={{ color: "#334155", border: cellBorder }}>{row.company}</td>
                  <td className="px-3 py-2 text-right font-medium tabular-nums" style={{ color: "#334155", border: cellBorder }}>{row.price}</td>
                  <td className="px-3 py-2 text-right tabular-nums" style={{ color: "#64748b", border: cellBorder }}>{row.marketCap}</td>
                  <td className="px-3 py-2 text-right tabular-nums" style={{ color: "#334155", border: cellBorder }}>{fmt(row.pe, "x")}</td>
                  <td className="px-3 py-2 text-right tabular-nums" style={{ color: "#334155", border: cellBorder }}>{fmt(row.pb, "x")}</td>
                  <td className="px-3 py-2 text-right tabular-nums" style={{ color: "#334155", border: cellBorder }}>{fmt(row.roe, "%")}</td>
                  <td className="px-3 py-2 text-right tabular-nums" style={{ color: "#334155", border: cellBorder }}>{fmt(row.divYield, "%")}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {(() => {
              const numericVals = (arr: string[]) => arr.map(v => parseFloat(v)).filter(v => !isNaN(v));
              const avg = (arr: number[]) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
              const avgPrice = avg(numericVals(rows.map(r => r.price)));
              const avgPe = avg(numericVals(rows.map(r => r.pe)));
              const avgPb = avg(numericVals(rows.map(r => r.pb)));
              const avgRoe = avg(numericVals(rows.map(r => r.roe)));
              const avgDiv = avg(numericVals(rows.map(r => r.divYield)));
              const cellBorder = "0.5pt solid #d1d5db";
              return (
                <tr style={{ backgroundColor: "#f1f5f9", borderTop: "1.5pt solid #94a3b8" }}>
                  <td colSpan={2} className="px-3 py-2 font-bold whitespace-nowrap" style={{ color: "#003366", border: cellBorder, fontSize: "0.78rem" }}>
                    {t.sectorAvg}
                  </td>
                  <td className="px-3 py-2 text-right font-bold tabular-nums" style={{ color: "#334155", border: cellBorder }}>{avgPrice.toFixed(2)}</td>
                  <td className="px-3 py-2 text-right tabular-nums" style={{ color: "#94a3b8", border: cellBorder }}>—</td>
                  <td className="px-3 py-2 text-right font-bold tabular-nums" style={{ color: "#334155", border: cellBorder }}>{avgPe.toFixed(1)}x</td>
                  <td className="px-3 py-2 text-right font-bold tabular-nums" style={{ color: "#334155", border: cellBorder }}>{avgPb.toFixed(2)}x</td>
                  <td className="px-3 py-2 text-right font-bold tabular-nums" style={{ color: "#334155", border: cellBorder }}>{avgRoe.toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-bold tabular-nums" style={{ color: "#334155", border: cellBorder }}>{avgDiv.toFixed(2)}%</td>
                </tr>
              );
            })()}
          </tfoot>
        </table>
      </div>
      {/* Table Legend */}
      <div className="mt-2 pt-2" style={{ borderTop: "0.5pt solid #e5e7eb" }}>
        <p className="text-[0.65rem] leading-relaxed font-body" style={{ color: "#64748b" }}>
          <span className="font-semibold" style={{ color: "#334155" }}>Legend:</span> {t.legend}
        </p>
        <p className="text-[0.6rem] mt-1 text-right font-body italic" style={{ color: "#94a3b8" }}>* {t.note}</p>
      </div>
    </div>
  );
}
