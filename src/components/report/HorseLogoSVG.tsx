const HorseLogoSVG = ({ className = "", size = 40, asWatermark = false }: { className?: string; size?: number; asWatermark?: boolean }) => {
  const gradientId = asWatermark ? "horse-gradient-watermark" : "horse-gradient-main";
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" />
          <stop offset="50%" stopColor="#B8860B" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>
      {/* Stylized galloping horse silhouette - fast, modern, AI-tech inspired */}
      <path
        d={`
          M 78 18 C 75 15, 70 14, 67 16 C 64 18, 62 22, 63 26
          C 60 24, 56 22, 52 23 C 48 24, 45 27, 44 31
          C 40 28, 35 27, 31 29 C 27 31, 25 35, 26 39
          C 23 38, 19 39, 17 42 C 15 45, 15 49, 18 52
          L 22 56 C 20 60, 18 65, 16 72 C 14 78, 16 82, 20 82
          C 23 82, 25 79, 26 75 L 30 64
          C 32 68, 34 73, 33 79 C 32 83, 35 86, 39 85
          C 42 84, 43 80, 42 76 L 40 66
          C 44 70, 48 73, 50 78 C 52 82, 55 84, 58 82
          C 61 80, 60 76, 58 72 L 54 64
          C 58 67, 62 72, 65 78 C 67 82, 71 83, 74 80
          C 76 77, 74 73, 72 69 L 66 58
          C 70 55, 74 50, 76 44 C 78 38, 80 32, 82 26
          C 83 22, 81 19, 78 18 Z
          M 72 24 C 73 23, 75 23, 75 25 C 75 27, 73 27, 72 26 Z
        `}
        fill={`url(#${gradientId})`}
      />
      {/* Speed lines for dynamic feel */}
      <line x1="10" y1="45" x2="22" y2="45" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="8" y1="50" x2="18" y2="50" stroke={`url(#${gradientId})`} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <line x1="12" y1="55" x2="20" y2="55" stroke={`url(#${gradientId})`} strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
};

export default HorseLogoSVG;
