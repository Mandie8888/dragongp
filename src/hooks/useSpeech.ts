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
    rate = 0.9,
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
  const isProcessingQueue = useRef(false);

  // Define processQueue first so it's available when speak is called
  const processQueue = useCallback(() => {
    if (queueRef.current.length === 0) {
      isProcessingQueue.current = false;
      setIsSpeaking(false);
      return;
    }

    isProcessingQueue.current = true;
    const text = queueRef.current.shift();
    if (!text) {
      processQueue();
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
      // Process next item in queue after a small delay
      setTimeout(() => {
        processQueue();
      }, 200);
    };

    utterance.onerror = (event) => {
      console.warn('Speech error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
      // Continue to next item on error
      setTimeout(() => {
        processQueue();
      }, 200);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [lang, rate, pitch, volume, onStart, onEnd]);

  // speak function uses processQueue
  const speak = useCallback((text: string, immediate = true) => {
    if (!window.speechSynthesis) {
      onError?.(new Error('Speech synthesis not supported'));
      return;
    }

    if (!text || text.trim().length === 0) {
      return;
    }

    if (immediate) {
      window.speechSynthesis.cancel();
      queueRef.current = [];
      isProcessingQueue.current = false;
    }

    queueRef.current.push(text);

    if (!isProcessingQueue.current) {
      processQueue();
    }
  }, [onError, processQueue]);

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
    isProcessingQueue.current = false;
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