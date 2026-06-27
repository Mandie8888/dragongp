import { cn } from "@/lib/utils";

// Mark6 number color zones (Hong Kong style)
const redNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40];
const blueNumbers = [10, 11, 12, 13, 14, 15, 16, 41, 42, 43, 44, 45, 46, 47, 48, 49];

type BallColor = "red" | "blue" | "green" | "gold";

const getNumberColor = (num: number): BallColor => {
  if (redNumbers.includes(num)) return "red";
  if (blueNumbers.includes(num)) return "blue";
  return "green";
};

// 3D gradient styles for each color
const ballStyles: Record<BallColor, { background: string; shadow: string; highlight: string }> = {
  red: {
    background: "radial-gradient(circle at 30% 25%, #FF6B6B 0%, #E31937 35%, #B8001E 70%, #8B0016 100%)",
    shadow: "0 4px 15px rgba(227, 25, 55, 0.5), inset 0 -3px 10px rgba(0, 0, 0, 0.2)",
    highlight: "rgba(255, 255, 255, 0.8)",
  },
  blue: {
    background: "radial-gradient(circle at 30% 25%, #6BB5FF 0%, #0066CC 35%, #004A99 70%, #003366 100%)",
    shadow: "0 4px 15px rgba(0, 102, 204, 0.5), inset 0 -3px 10px rgba(0, 0, 0, 0.2)",
    highlight: "rgba(255, 255, 255, 0.8)",
  },
  green: {
    background: "radial-gradient(circle at 30% 25%, #5DD58D 0%, #00A651 35%, #007A3D 70%, #005A2D 100%)",
    shadow: "0 4px 15px rgba(0, 166, 81, 0.5), inset 0 -3px 10px rgba(0, 0, 0, 0.2)",
    highlight: "rgba(255, 255, 255, 0.8)",
  },
  gold: {
    background: "radial-gradient(circle at 30% 25%, #FFE066 0%, #FFD700 35%, #B8860B 70%, #8B6914 100%)",
    shadow: "0 4px 15px rgba(255, 215, 0, 0.6), inset 0 -3px 10px rgba(0, 0, 0, 0.15)",
    highlight: "rgba(255, 255, 255, 0.9)",
  },
};

interface LotteryBallProps {
  number: number;
  isBanker?: boolean;
  size?: "sm" | "md" | "lg";
  isGlassMorphism?: boolean;
  className?: string;
}

export const LotteryBall = ({ 
  number, 
  isBanker = false, 
  size = "md",
  isGlassMorphism = false,
  className 
}: LotteryBallProps) => {
  const color: BallColor = isBanker ? "gold" : getNumberColor(number);
  const style = ballStyles[color];

  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  };

  // Enlarged print sizes for better visibility - BIGGER and BOLDER with vibrant colors
  const printSizeClasses = {
    sm: "print:!w-9 print:!h-9 print:!text-base print:!font-black",
    md: "print:!w-10 print:!h-10 print:!text-lg print:!font-black",
    lg: "print:!w-12 print:!h-12 print:!text-xl print:!font-black",
  };

  // Print-specific vibrant colors for each ball type - HIGH CONTRAST
  const printColors: Record<BallColor, { bg: string; text: string; border: string }> = {
    red: { bg: "#DC2626", text: "#FFFFFF", border: "#991B1B" },
    blue: { bg: "#2563EB", text: "#FFFFFF", border: "#1E40AF" },
    green: { bg: "#16A34A", text: "#FFFFFF", border: "#15803D" },
    gold: { bg: "#EAB308", text: "#000000", border: "#A16207" },
  };

  const currentPrintColors = printColors[color];

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold relative lottery-ball",
        sizeClasses[size],
        printSizeClasses[size],
        className
      )}
      style={{
        background: style.background,
        boxShadow: isGlassMorphism 
          ? `${style.shadow}, inset 0 2px 6px rgba(255, 255, 255, 0.4)`
          : style.shadow,
        fontFamily: "'Georgia', serif",
        textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
        border: isGlassMorphism ? "2px solid rgba(255, 255, 255, 0.3)" : "none",
        // CSS custom properties for print styling - inline to ensure they work
        "--print-bg": currentPrintColors.bg,
        "--print-text": currentPrintColors.text,
        "--print-border": currentPrintColors.border,
      } as React.CSSProperties}
    >
      {/* Highlight reflection - Hidden in print */}
      <div
        className="absolute top-[15%] left-[20%] w-[30%] h-[25%] rounded-full opacity-60 print:!hidden"
        style={{
          background: `radial-gradient(ellipse at center, ${style.highlight} 0%, transparent 100%)`,
        }}
      />
      
      {/* Number text - CRITICAL: Make sure number is VISIBLE in print */}
      <span 
        className="relative z-10 font-bold print:!font-black print:!text-lg"
        style={{ 
          color: color === "gold" ? "#000000" : "#FFFFFF",
        }}
      >
        {number}
      </span>
      
      {/* Print-specific style injection - Force solid colors and visible text */}
      <style>{`
        @media print {
          .lottery-ball {
            background: var(--print-bg) !important;
            border: 3px solid var(--print-border) !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .lottery-ball span {
            color: var(--print-text) !important;
            font-weight: 900 !important;
            font-size: 0.9rem !important;
            text-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};
