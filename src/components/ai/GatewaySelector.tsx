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
import { Check, ChevronDown, Sparkles } from 'lucide-react';
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
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>AI 引擎選擇</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {GATEWAY_CONFIGS.map((config) => (
            <DropdownMenuItem
              key={config.id}
              onClick={() => setGateway(config.id)}
              className="flex items-center justify-between"
            >
              <span>
                <span className="mr-2">{config.icon}</span>
                {config.label}
              </span>
              {currentGateway === config.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium">AI 引擎</label>
      <div className="grid grid-cols-2 gap-2">
        {GATEWAY_CONFIGS.map((config) => (
          <Button
            key={config.id}
            variant={currentGateway === config.id ? 'default' : 'outline'}
            className="justify-start h-auto py-3 px-4"
            onClick={() => setGateway(config.id)}
          >
            <span className="text-xl mr-2">{config.icon}</span>
            <div className="text-left">
              <div className="font-medium text-sm">{config.label}</div>
              <div className="text-xs opacity-70">{config.description}</div>
            </div>
            {currentGateway === config.id && (
              <Check className="ml-auto h-4 w-4" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};