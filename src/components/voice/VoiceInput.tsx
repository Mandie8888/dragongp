import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2, Sparkles } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { detectStock, isQuestion, extractStockFromQuestion } from '@/lib/stockDetector';
import { toast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface VoiceInputProps {
  onResult: (text: string) => void;
  onStockDetected?: (symbol: string) => void;
  placeholder?: string;
  className?: string;
  lang?: string;
  autoDetectStock?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onResult,
  onStockDetected,
  placeholder = '說出股票代碼...',
  className = '',
  lang = 'zh-HK',
  autoDetectStock = true,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedStock, setDetectedStock] = useState<string | null>(null);

  const { isListening, transcript, isSupported, toggleListening } = useVoiceInput({
    lang,
    onResult: (text, isFinal) => {
      if (isFinal && text.trim()) {
        setIsProcessing(true);
        const cleanedText = text.trim();
        
        // Try to detect stock symbol
        let symbol = detectStock(cleanedText);
        
        // If the input is a question, try to extract stock from it
        if (isQuestion(cleanedText)) {
          const extracted = extractStockFromQuestion(cleanedText);
          if (extracted) {
            symbol = extracted;
          }
        }
        
        // Check if we detected a valid stock
        const isValidStock = symbol !== cleanedText.toUpperCase() || 
                            /^[A-Z]{1,5}(?:\.[A-Z]{2,3})?$/.test(symbol);
        
        if (autoDetectStock && isValidStock && symbol) {
          setDetectedStock(symbol);
          onStockDetected?.(symbol);
          toast({
            title: '📊 股票識別成功',
            description: `已識別: ${symbol}`,
            duration: 3000,
          });
          onResult(symbol);
        } else {
          // Just return the raw text
          onResult(cleanedText);
        }
        
        setIsProcessing(false);
      }
    },
    onError: (error) => {
      toast({
        title: '語音識別錯誤',
        description: error.message,
        variant: 'destructive',
      });
      setIsProcessing(false);
    },
  });

  if (!isSupported) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={isListening ? 'destructive' : 'outline'}
            size="icon"
            className={`relative ${className}`}
            onClick={toggleListening}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isListening ? (
              <>
                <MicOff className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="absolute -bottom-1 -right-1 h-2 w-2 animate-ping rounded-full bg-red-500 opacity-75" />
              </>
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isListening ? '點擊停止聆聽' : '點擊開始語音輸入'}
        </TooltipContent>
      </Tooltip>
      
      {isListening && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-background border rounded-lg shadow-lg p-4 max-w-md w-full mx-4 animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                <div className="absolute inset-0 h-3 w-3 rounded-full bg-red-500 animate-ping opacity-75" />
              </div>
              <span className="text-sm font-medium">正在聆聽...</span>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleListening}>
              停止
            </Button>
          </div>
          {transcript && (
            <div className="mt-2 text-sm text-muted-foreground">
              "{transcript}"
              {detectedStock && (
                <span className="ml-2 inline-flex items-center gap-1 text-primary">
                  <Sparkles className="h-3 w-3" />
                  → {detectedStock}
                </span>
              )}
            </div>
          )}
          <div className="mt-2 text-xs text-muted-foreground">
            💡 說出股票名稱或代碼，例如「騰訊」、「TSLA」、「台積電」
          </div>
        </div>
      )}
    </TooltipProvider>
  );
};