import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { toast } from '@/components/ui/use-toast';
import { useVoiceInput } from '@/hooks/useVoiceInput';

interface QuickAddButtonProps {
  className?: string;
  onAdd?: (symbol: string) => void;
}

export const QuickAddButton: React.FC<QuickAddButtonProps> = ({
  className = '',
  onAdd,
}) => {
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addToWatchlist } = useWatchlist();

  const { isListening, toggleListening, transcript, isSupported } = useVoiceInput({
    lang: 'zh-HK',
    onResult: (text) => {
      const cleaned = text.trim().toUpperCase();
      const stockMatch = cleaned.match(/[A-Z]{1,5}(?:\.[A-Z]{2,3})?/);
      if (stockMatch) {
        setSymbol(stockMatch[0]);
        toast({
          title: '語音輸入成功',
          description: `已識別: ${stockMatch[0]}`,
        });
      }
    },
  });

  const handleAdd = async () => {
    if (!symbol.trim()) {
      toast({
        title: '請輸入股票代碼',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await addToWatchlist(symbol.trim().toUpperCase());
      toast({
        title: '已添加自選股',
        description: `${symbol.trim().toUpperCase()} 已加入您的自選股清單`,
      });
      setSymbol('');
      setOpen(false);
      onAdd?.(symbol.trim().toUpperCase());
    } catch (error) {
      toast({
        title: '添加失敗',
        description: error instanceof Error ? error.message : '請稍後重試',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          添加自選
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加自選股</DialogTitle>
          <DialogDescription>
            輸入股票代碼或使用語音輸入快速添加
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label htmlFor="symbol" className="sr-only">
                股票代碼
              </Label>
              <Input
                id="symbol"
                placeholder="例如: NVDA, 0700.HK, 2330.TW"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            {isSupported && (
              <Button
                type="button"
                variant={isListening ? 'destructive' : 'outline'}
                size="icon"
                onClick={toggleListening}
                title={isListening ? '停止聆聽' : '語音輸入'}
              >
                {isListening ? '🎤' : '🎙️'}
              </Button>
            )}
          </div>
          {isListening && (
            <p className="text-sm text-muted-foreground text-center animate-pulse">
              正在聆聽... {transcript && `"${transcript}"`}
            </p>
          )}
          <div className="text-xs text-muted-foreground">
            💡 支援格式: NVDA, 0700.HK, 2330.TW
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleAdd} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                添加中...
              </>
            ) : (
              '確認添加'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};