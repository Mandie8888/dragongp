import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, ChevronDown, Sparkles, Box } from 'lucide-react';
import { useAIGateway, GATEWAY_CONFIGS } from '@/contexts/AIGatewayContext';
import { cn } from '@/lib/utils';

interface GatewaySelectorProps {
  className?: string;
  variant?: 'default' | 'minimal';
}

export const GatewaySelector: React.FC<GatewaySelectorProps> = ({
  className = '',
  variant = 'default',
}) => {
  const { currentGateway, setGateway, getGatewayConfig } = useAIGateway();
  const [isOpen, setIsOpen] = useState(false);

  const currentConfig = getGatewayConfig(currentGateway);

  // Updated gateway configs with all options
  const allGateways = [
    { id: 'OPENAI', label: 'OpenAI GPT-4', description: '最強大的AI分析', icon: '🤖', enabled: true },
    { id: 'GEMINI', label: 'Google Gemini', description: 'Google AI 分析', icon: '✨', enabled: true },
    { id: 'DEEPSEEK', label: 'DeepSeek', description: '深度求索 AI', icon: '🧠', enabled: true },
    { id: 'LOCAL', label: '本地 LLM', description: '使用本地模型 (Ollama)', icon: '💻', enabled: true },
  ];

  if (variant === 'minimal') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn('gap-2', className)}
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">{currentConfig?.label || 'AI'}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Box className="h-4 w-4" />
            AI 引擎選擇
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {allGateways.map((config) => (
            <DropdownMenuItem
              key={config.id}
              onClick={() => setGateway(config.id as any)}
              className="flex items-center justify-between py-2.5 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{config.icon}</span>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{config.label}</span>
                  <span className="text-xs text-muted-foreground">{config.description}</span>
                </div>
              </div>
              {/* ✅ Tick Box */}
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                currentGateway === config.id 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "border-muted-foreground/30"
              )}>
                {currentGateway === config.id && (
                  <Check className="h-3 w-3" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant with grid layout
  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium flex items-center gap-2">
        <Box className="h-4 w-4" />
        AI 引擎
      </label>
      <div className="grid grid-cols-2 gap-2">
        {allGateways.map((config) => (
          <Button
            key={config.id}
            variant={currentGateway === config.id ? 'default' : 'outline'}
            className="justify-start h-auto py-3 px-4"
            onClick={() => setGateway(config.id as any)}
          >
            <div className="flex items-center gap-3 w-full">
              <span className="text-xl">{config.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm">{config.label}</div>
                <div className="text-xs opacity-70">{config.description}</div>
              </div>
              <div className={cn(
                "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                currentGateway === config.id 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "border-muted-foreground/30"
              )}>
                {currentGateway === config.id && (
                  <Check className="h-3 w-3" />
                )}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};