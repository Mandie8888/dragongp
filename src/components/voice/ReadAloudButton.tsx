import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';
import { toast } from '@/components/ui/use-toast';

interface ReadAloudButtonProps {
  text: string;
  autoRead?: boolean;
  className?: string;
  lang?: string;
}

export const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({
  text,
  autoRead = false,
  className = '',
  lang = 'zh-HK',
}) => {
  const { speak, isSpeaking, isSupported, stop } = useSpeech({
    lang,
    onError: (error) => {
      toast({
        title: '語音播放錯誤',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (autoRead && text && !isSpeaking) {
      speak(text);
    }
  }, [autoRead, text, speak, isSpeaking]);

  const handleToggle = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(text);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={className}
      onClick={handleToggle}
      title={isSpeaking ? '停止朗讀' : '朗讀內容'}
    >
      {isSpeaking ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      <span className="ml-2 text-sm">
        {isSpeaking ? '停止' : '朗讀'}
      </span>
    </Button>
  );
};