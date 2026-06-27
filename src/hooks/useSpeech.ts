import { useState, useCallback, useRef } from 'react';

interface UseSpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

export const useSpeech = (options: UseSpeechOptions = {}) => {
  const {
    lang = 'zh-HK',
    rate = 1,
    pitch = 1,
    volume = 1,
    onStart,
    onEnd,
    onError,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueRef = useRef<string[]>([]);

  const speak = useCallback((text: string, immediate = true) => {
    if (!window.speechSynthesis) {
      onError?.(new Error('Speech synthesis not supported'));
      return;
    }

    if (immediate) {
      window.speechSynthesis.cancel();
      queueRef.current = [];
    }

    if (window.speechSynthesis.speaking && !isPaused) {
      queueRef.current.push(text);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      onEnd?.();

      if (queueRef.current.length > 0) {
        const nextText = queueRef.current.shift();
        if (nextText) {
          speak(nextText, true);
        }
      }
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      setIsPaused(false);
      onError?.(new Error(event.error));
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [lang, rate, pitch, volume, onStart, onEnd, onError, isPaused]);

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    queueRef.current = [];
    setIsSpeaking(false);
    setIsPaused(false);
    utteranceRef.current = null;
  }, []);

  const togglePause = useCallback(() => {
    if (isPaused) {
      resume();
    } else if (isSpeaking) {
      pause();
    }
  }, [isPaused, isSpeaking, pause, resume]);

  const isSupported = typeof window !== 'undefined' && !!window.speechSynthesis;

  return {
    speak,
    pause,
    resume,
    stop,
    togglePause,
    isSpeaking,
    isPaused,
    isSupported,
    hasUtterance: !!utteranceRef.current,
  };
};