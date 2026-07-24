// src/components/FacebookShareButton.tsx
import { Button } from "@/components/ui/button";
import { Facebook } from "lucide-react";

interface FacebookShareButtonProps {
  url?: string;
  quote?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
  showText?: boolean;
}

export function FacebookShareButton({
  url,
  quote,
  className = "",
  size = "sm",
  variant = "default",
  showText = true,
}: FacebookShareButtonProps) {
  const handleShare = () => {
    const shareUrl = url || window.location.href;
    const shareQuote = quote || "Check out this AI analysis from DragonGp.Ai!";
    
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareQuote)}`;
    
    const width = 626;
    const height = 436;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    window.open(
      fbShareUrl,
      "facebook-share-dialog",
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,status=no`
    );
  };

  return (
    <Button
      onClick={handleShare}
      variant={variant}
      size={size}
      className={`flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#166FE5] text-white border-none transition-all duration-200 hover:scale-105 ${className}`}
    >
      <Facebook className="w-4 h-4" />
      {showText && <span className="text-xs font-medium">Facebook</span>}
    </Button>
  );
}