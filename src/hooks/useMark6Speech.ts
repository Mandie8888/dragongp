// src/hooks/useMark6Speech.ts
import { useState, useCallback, useRef, useEffect } from 'react';

interface UseMark6SpeechProps {
  lang?: string;
}

export function useMark6Speech({ lang = 'en-US' }: UseMark6SpeechProps = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Stop any ongoing speech
  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  // Speak text with the given language
  const speak = useCallback((text: string, language: string = lang) => {
    if (!isSupported || !text) return;
    
    // Cancel any ongoing speech
    stop();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;
    
    if (language === 'zh-HK') {
      selectedVoice = voices.find(v => v.lang.includes('zh-HK') || v.lang.includes('yue'));
      if (!selectedVoice) selectedVoice = voices.find(v => v.lang.includes('zh'));
    } else if (language === 'zh-CN') {
      selectedVoice = voices.find(v => v.lang.includes('zh-CN') || v.lang.includes('cmn'));
      if (!selectedVoice) selectedVoice = voices.find(v => v.lang.includes('zh'));
    } else {
      selectedVoice = voices.find(v => v.lang.includes('en-US') && v.name.includes('Google'));
      if (!selectedVoice) selectedVoice = voices.find(v => v.lang.includes('en-US'));
      if (!selectedVoice) selectedVoice = voices.find(v => v.lang.includes('en'));
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isSupported, lang, stop]);

  // Get partner name in the correct language
  const getPartnerName = useCallback((partnerId: string, language: string): string => {
    const names: Record<string, Record<string, string>> = {
      elon: { en: 'Elon', 'zh-TW': '伊隆', 'zh-CN': '伊隆' },
      'god-of-gambling': { en: 'God of Gambling', 'zh-TW': '賭神', 'zh-CN': '赌神' },
      'lucky-star': { en: 'Lucky Star', 'zh-TW': '幸運星', 'zh-CN': '幸运星' },
      achelois: { en: 'Achelois', 'zh-TW': '月光女神', 'zh-CN': '月光女神' },
      aladdin: { en: 'Aladdin', 'zh-TW': '阿拉丁', 'zh-CN': '阿拉丁' },
    };
    return names[partnerId]?.[language] || partnerId;
  }, []);

  // Get partner method in the correct language
  const getPartnerMethod = useCallback((partnerId: string, language: string): string => {
    const methods: Record<string, Record<string, string>> = {
      elon: { en: 'Banker and Leg Strategy', 'zh-TW': '膽拖策略', 'zh-CN': '胆拖策略' },
      'god-of-gambling': { en: 'Chaos Theory Logic', 'zh-TW': '混沌理論', 'zh-CN': '混沌理论' },
      'lucky-star': { en: 'Monte Carlo Simulation', 'zh-TW': '蒙特卡羅模擬', 'zh-CN': '蒙特卡罗模拟' },
      achelois: { en: 'Neural Network Entropy', 'zh-TW': '神經網絡熵值分析', 'zh-CN': '神经网络熵值分析' },
      aladdin: { en: 'Quantum Spooky Sync', 'zh-TW': '量子幽靈同步', 'zh-CN': '量子幽灵同步' },
    };
    return methods[partnerId]?.[language] || partnerId;
  }, []);

  // FULL REPORT - Combined partner intro + prediction summary (no interruption)
  const speakFullReport = useCallback((partnerId: string, partnerName: string, method: string, gameType: string, predictions: number[][]) => {
    if (!predictions || predictions.length === 0) {
      console.warn('No predictions available for speech');
      return;
    }
    
    const firstSet = predictions[0] || [];
    if (firstSet.length === 0) {
      console.warn('First set is empty');
      return;
    }
    
    const gameName = gameType === 'tw' 
      ? (lang === 'zh-HK' || lang === 'zh-TW' ? '台灣大樂透' : lang === 'zh-CN' ? '台湾大乐透' : 'Taiwan Big Lotto')
      : (lang === 'zh-HK' || lang === 'zh-TW' ? '香港六合彩' : lang === 'zh-CN' ? '香港六合彩' : 'Hong Kong Mark 6');
    
    const numbersStr = firstSet.join(lang === 'zh-HK' || lang === 'zh-TW' ? '、' : lang === 'zh-CN' ? '、' : ', ');
    
    // Build the full message in one go based on language
    let message = '';
    
    // Determine which language to use
    const isCantonese = lang === 'zh-HK' || lang === 'zh-TW';
    const isMandarin = lang === 'zh-CN';
    const isEnglish = lang === 'en-US' || lang === 'en';
    
    if (isEnglish) {
      message = `Your AI partner ${partnerName} is using ${method}. For ${gameName}, the first set of predicted numbers are: ${numbersStr}. Good luck to you!`;
    } else if (isCantonese) {
      const gameNameCn = gameType === 'tw' ? '台灣大樂透' : '香港六合彩';
      message = `您的 AI 夥伴 ${partnerName} 正在使用 ${method}。對於 ${gameNameCn}，第一組預測號碼是：${numbersStr}。祝您好運！`;
    } else if (isMandarin) {
      const gameNameCn = gameType === 'tw' ? '台湾大乐透' : '香港六合彩';
      message = `您的 AI 伙伴 ${partnerName} 正在使用 ${method}。对于 ${gameNameCn}，第一组预测号码是：${numbersStr}。祝您好运！`;
    } else {
      // Fallback to English
      message = `Your AI partner ${partnerName} is using ${method}. For ${gameName}, the first set of predicted numbers are: ${numbersStr}. Good luck to you!`;
    }
    
    console.log('📢 Speaking full report:', message);
    console.log('🗣️ Language:', lang);
    console.log('📊 First set:', firstSet);
    
    // Speak the full message - no interruption
    speak(message, lang);
  }, [speak, lang]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isSpeaking,
    stop,
    speak,
    speakFullReport,
    getPartnerName,
    getPartnerMethod,
    isSupported,
  };
}