interface ReportFooterProps {
  disclaimer?: string;
}

export function ReportFooter({ disclaimer }: ReportFooterProps) {
  return (
    <div className="mt-8 pt-4 border-t border-[#e5e7eb]">
      {/* Confidential watermark line */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-[0.6rem] tracking-[0.25em] uppercase font-body" style={{ color: "#94a3b8" }}>
          Confidential — For Intended Recipient Only
        </p>
        <p className="text-[0.6rem] font-body" style={{ color: "#94a3b8" }}>
          © {new Date().getFullYear()} DragonGp.Ai
        </p>
      </div>

      {/* Disclaimer */}
      {disclaimer && (
        <p className="text-[0.55rem] leading-relaxed font-body" style={{ color: "#94a3b8" }}>
          {disclaimer}
        </p>
      )}

      {/* Powered by Gemini footer — always visible */}
      <div className="mt-3 text-center">
        <p className="text-[0.55rem] font-body" style={{ color: "#94a3b8" }}>
          Strategic Insights by DragonGp.Ai | Powered by Gemini AI
        </p>
      </div>
    </div>
  );
}
