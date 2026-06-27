import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, Volume2 } from 'lucide-react';
import { useSpeech } from '@/hooks/useSpeech';

interface AudioControlsProps {
  text: string;
  className?: string;
  lang?: string;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  text,
  className = '',
  lang = 'zh-HK',
}) => {
  const { 
    speak, 
    pause, 
    resume, 
    stop, 
    isSpeaking, 
    isPaused, 
    isSupported 
  } = useSpeech({
    lang,
  });

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => speak(text)}
        disabled={isSpeaking && !isPaused}
        title="Play"
      >
        <Volume2 className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={isPaused ? resume : pause}
        disabled={!isSpeaking}
        title={isPaused ? 'Resume' : 'Pause'}
      >
        {isPaused ? (
          <Play className="h-4 w-4" />
        ) : (
          <Pause className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={stop}
        disabled={!isSpeaking}
        title="Stop"
      >
        <Square className="h-4 w-4" />
      </Button>
    </div>
  );
};