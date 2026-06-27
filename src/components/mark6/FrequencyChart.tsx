import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

// Mark6 number color zones (Hong Kong style)
const redNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
const blueNumbers = [10, 11, 12, 13, 14, 15, 16, 41, 42, 43, 44, 45, 46, 47, 48, 49];

const getNumberColor = (num: number): string => {
  if (redNumbers.includes(num)) return "#E31937";
  if (blueNumbers.includes(num)) return "#0066CC";
  return "#00A651";
};

interface FrequencyChartProps {
  predictions: number[][];
}

export const FrequencyChart = ({ predictions }: FrequencyChartProps) => {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Number Frequency Analysis",
      subtitle: "Distribution of predicted numbers across all 10 sets",
      frequency: "Frequency",
      number: "Number",
    },
    "zh-TW": {
      title: "號碼頻率分析",
      subtitle: "10組預測號碼的分佈統計",
      frequency: "出現次數",
      number: "號碼",
    },
    "zh-CN": {
      title: "号码频率分析",
      subtitle: "10组预测号码的分布统计",
      frequency: "出现次数",
      number: "号码",
    },
  };

  const t = content[language] || content.en;

  // Calculate frequency of each number across all predictions
  const frequencyData = useMemo(() => {
    const counts: Record<number, number> = {};
    
    // Initialize all numbers 1-49
    for (let i = 1; i <= 49; i++) {
      counts[i] = 0;
    }
    
    // Count occurrences
    predictions.forEach(set => {
      set.forEach(num => {
        counts[num] = (counts[num] || 0) + 1;
      });
    });
    
    // Convert to array and sort by frequency (descending)
    return Object.entries(counts)
      .map(([num, count]) => ({
        number: parseInt(num),
        count,
        color: getNumberColor(parseInt(num)),
      }))
      .filter(item => item.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 15); // Top 15 most frequent
  }, [predictions]);

  if (frequencyData.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-4 print:p-3 print:border print:border-gray-300">
      <div className="text-center mb-3">
        <h3 className="text-lg font-bold text-gray-800 print:text-base">
          📊 {t.title}
        </h3>
        <p className="text-xs text-gray-500 print:text-[10px]">{t.subtitle}</p>
      </div>
      
      <div className="h-48 print:h-36">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={frequencyData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
            <XAxis 
              dataKey="number" 
              tick={{ fontSize: 10, fill: "#374151" }}
              axisLine={{ stroke: "#D1D5DB" }}
              tickLine={{ stroke: "#D1D5DB" }}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: "#374151" }}
              axisLine={{ stroke: "#D1D5DB" }}
              tickLine={{ stroke: "#D1D5DB" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelFormatter={(value) => `${t.number}: ${value}`}
              formatter={(value: number) => [`${value}x`, t.frequency]}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {frequencyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-2 text-xs print:text-[10px]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E31937" }} />
          <span className="text-gray-600">Red (紅/红)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#0066CC" }} />
          <span className="text-gray-600">Blue (藍/蓝)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#00A651" }} />
          <span className="text-gray-600">Green (綠/绿)</span>
        </div>
      </div>
    </div>
  );
};
