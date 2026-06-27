import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Testimonial card interface for the premium feedback carousel
 */
export interface FeedbackItem {
  name: string;      // Hidden name format: "S. Wang"
  rating: number;    // 1-5 stars
  subject: string;   // e.g., "AI Stock"
  message: string;   // The feedback message
}

// Generate star string from rating
const getStars = (rating: number): string => {
  return "★".repeat(Math.min(5, Math.max(1, rating)));
};

// Trilingual English testimonials data
const getEnglishFeedback = (language: string): FeedbackItem[] => {
  const translations = {
    en: {
      sWang: { subject: "AI Stock", message: "Very friendly to get stock analysis! Thanks." },
      mChen: { subject: "Daily Report", message: "Clean data presentation. No bias detected." },
      kLee: { subject: "HK Market", message: "Useful for Hong Kong stock insights." },
      jWu: { subject: "US Stocks", message: "Great tool for tracking tech stocks." },
      tLiu: { subject: "AI Analysis", message: "Mathematical approach I was looking for." }
    },
    "zh-TW": {
      sWang: { subject: "AI 股票", message: "獲取股票分析非常方便！謝謝。" },
      mChen: { subject: "每日報告", message: "數據呈現清晰。未檢測到偏見。" },
      kLee: { subject: "港股市場", message: "對香港股票洞察非常有用。" },
      jWu: { subject: "美股時事", message: "追蹤科技股的絕佳工具。" },
      tLiu: { subject: "AI 分析", message: "這就是我一直在尋找的數學分析方法。" }
    },
    "zh-CN": {
      sWang: { subject: "AI 股票", message: "获取股票分析非常方便！谢谢。" },
      mChen: { subject: "每日报告", message: "数据呈现清晰。未检测到偏见。" },
      kLee: { subject: "港股市场", message: "对香港股票洞察非常有用。" },
      jWu: { subject: "美股时事", message: "追踪科技股的绝佳工具。" },
      tLiu: { subject: "AI 分析", message: "这就是我一直在寻找的数学分析方法。" }
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  return [
    { name: "S. Wang", rating: 5, subject: t.sWang.subject, message: t.sWang.message },
    { name: "M. Chen", rating: 5, subject: t.mChen.subject, message: t.mChen.message },
    { name: "K. Lee", rating: 4, subject: t.kLee.subject, message: t.kLee.message },
    { name: "J. Wu", rating: 5, subject: t.jWu.subject, message: t.jWu.message },
    { name: "T. Liu", rating: 5, subject: t.tLiu.subject, message: t.tLiu.message }
  ];
};

// Chinese testimonials (Bottom Row - scrolls left to right)
const chineseFeedback: FeedbackItem[] = [
  // Traditional Chinese
  {
    name: "陳先生",
    rating: 4,
    subject: "AI 概率分",
    message: "數據非常準確，對我的資產配置很有幫助。"
  },
  {
    name: "L. 張小姐",
    rating: 4,
    subject: "港股研究",
    message: "界面簡潔，AI 摘要節省了很多閱讀報表的時間。"
  },
  {
    name: "林工程師",
    rating: 4,
    subject: "認知強化",
    message: "每日看這個「大腦健身房」，思維確實敏銳了。"
  },
  {
    name: "K. 鄭先生",
    rating: 4,
    subject: "美股趨勢",
    message: "算法邏輯清晰，不再受市場情緒干擾。"
  },
  {
    name: "趙女士",
    rating: 4,
    subject: "自主決策",
    message: "無壓力的環境讓我能冷靜分析數據，非常推薦。"
  },
  // Simplified Chinese
  {
    name: "王先生",
    rating: 4,
    subject: "智能选股",
    message: "AI 概率预测非常有参考价值，逻辑很硬。"
  },
  {
    name: "P. 李小姐",
    rating: 4,
    subject: "零压力体验",
    message: "不推销、不误导，这就是我想要的纯净数据。"
  },
  {
    name: "刘博士",
    rating: 4,
    subject: "算法数学",
    message: "看到 RSI 和 MACD 的深度整合，感觉背后数学模型很专业。"
  },
  {
    name: "H. 孙先生",
    rating: 4,
    subject: "效率工具",
    message: "帮我做了最繁重的数学计算，省时省力。"
  },
  {
    name: "周女士",
    rating: 4,
    subject: "每日洞察",
    message: "每天花五分钟看看，已经成了我的分析习惯。"
  }
];

// Individual testimonial card component - Compact version (50% height reduction)
const TestimonialCard = ({ item }: { item: FeedbackItem }) => (
  <div 
    className="flex-shrink-0 w-[220px] p-2 mx-2 rounded-lg border border-gold/20 backdrop-blur-sm"
    style={{ 
      backgroundColor: 'rgba(26, 22, 20, 0.8)',
      boxShadow: '0 0 15px rgba(212, 175, 55, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
    }}
  >
    {/* Line 1: Name (left) and Stars (right) */}
    <div className="flex justify-between items-center mb-1">
      <span 
        className="text-white/90 text-xs font-medium"
        style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
      >
        {item.name}
      </span>
      <span className="text-gold text-xs tracking-wider">
        {getStars(item.rating)}
      </span>
    </div>
    
    {/* Line 2: Subject (bolded) */}
    <div 
      className="text-gold font-bold text-sm mb-1"
      style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
    >
      {item.subject}
    </div>
    
    {/* Line 3: Message in quotes - truncated */}
    <p 
      className="text-white/80 text-xs italic leading-tight line-clamp-2"
      style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
    >
      "{item.message}"
    </p>
  </div>
);

// Marquee row component
interface MarqueeRowProps {
  items: FeedbackItem[];
  direction: 'left' | 'right';
  duration?: string;
  backgroundColor?: string;
}

const MarqueeRow = ({ items, direction, duration = "45s", backgroundColor = "transparent" }: MarqueeRowProps) => {
  const [isPaused, setIsPaused] = useState(false);
  
  const cards = items.map((item, idx) => (
    <TestimonialCard key={idx} item={item} />
  ));

  const animationClass = direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right';

  return (
    <div className="overflow-hidden" style={{ backgroundColor }}>
      <div 
        className={`flex ${animationClass}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        style={{ 
          width: "fit-content",
          animationPlayState: isPaused ? "paused" : "running",
          animationDuration: duration
        }}
      >
        {cards}
        {cards}
        {cards}
      </div>
    </div>
  );
};

const FeedbackMarquee = () => {
  const { language } = useLanguage();
  const englishFeedback = getEnglishFeedback(language);

  return (
    <section 
      className="border-y border-gold/20 overflow-hidden -mt-8"
    >
      {/* Top Row: Translatable - scrolls right to left - Tobacco Bronze - Compact height */}
      <div className="py-1" style={{ backgroundColor: '#1A1614' }}>
        <MarqueeRow items={englishFeedback} direction="left" duration="40s" backgroundColor="#1A1614" />
      </div>
      
      {/* Muted Gold Divider */}
      <div className="h-px" style={{ backgroundColor: 'rgba(212, 175, 55, 0.3)' }} />
      
      {/* Bottom Row: Chinese - scrolls left to right - Obsidian - Compact height */}
      <div className="py-1" style={{ backgroundColor: '#0E0C0B' }}>
        <MarqueeRow items={chineseFeedback} direction="right" duration="50s" backgroundColor="#0E0C0B" />
      </div>
    </section>
  );
};

export default FeedbackMarquee;
