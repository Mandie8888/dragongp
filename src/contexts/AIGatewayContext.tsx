import React, { createContext, useContext, useState, useEffect } from 'react';

export type AIGateway = 'OPENAI' | 'GEMINI' | 'CLAUDE' | 'LOCAL';

export interface AIGatewayConfig {
  id: AIGateway;
  label: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export const GATEWAY_CONFIGS: AIGatewayConfig[] = [
  {
    id: 'OPENAI',
    label: 'OpenAI GPT-4',
    description: '最強大的AI分析，需付費',
    icon: '🤖',
    enabled: true,
  },
  {
    id: 'GEMINI',
    label: 'Google Gemini',
    description: '免費備用方案',
    icon: '✨',
    enabled: true,
  },
  {
    id: 'CLAUDE',
    label: 'Claude',
    description: '深度分析專用',
    icon: '🧠',
    enabled: true,
  },
  {
    id: 'LOCAL',
    label: '本地 LLM',
    description: '使用本地模型 (Ollama)',
    icon: '💻',
    enabled: true,
  },
];

interface AIGatewayContextType {
  currentGateway: AIGateway;
  setGateway: (gateway: AIGateway) => void;
  getGatewayConfig: (gateway: AIGateway) => AIGatewayConfig | undefined;
  availableGateways: AIGatewayConfig[];
}

const AIGatewayContext = createContext<AIGatewayContextType | undefined>(undefined);

export const AIGatewayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentGateway, setCurrentGateway] = useState<AIGateway>(() => {
    const saved = localStorage.getItem('preferred_gateway') as AIGateway;
    return saved && GATEWAY_CONFIGS.some(g => g.id === saved) ? saved : 'OPENAI';
  });

  useEffect(() => {
    localStorage.setItem('preferred_gateway', currentGateway);
  }, [currentGateway]);

  const setGateway = (gateway: AIGateway) => {
    setCurrentGateway(gateway);
  };

  const getGatewayConfig = (gateway: AIGateway) => {
    return GATEWAY_CONFIGS.find(g => g.id === gateway);
  };

  return (
    <AIGatewayContext.Provider
      value={{
        currentGateway,
        setGateway,
        getGatewayConfig,
        availableGateways: GATEWAY_CONFIGS,
      }}
    >
      {children}
    </AIGatewayContext.Provider>
  );
};

export const useAIGateway = () => {
  const context = useContext(AIGatewayContext);
  if (!context) {
    throw new Error('useAIGateway must be used within AIGatewayProvider');
  }
  return context;
};