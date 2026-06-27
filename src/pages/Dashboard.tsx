import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "@/hooks/useCredits";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  LogOut, 
  Star, 
  Zap, 
  Brain, 
  History, 
  Home,
  CreditCard,
  ArrowRight,
  Sparkles,
  X
} from "lucide-react";
import dragonLogo from "@/assets/dragon-logo.png";
import InlineLanguageSwitcher from "@/components/InlineLanguageSwitcher";
import { Link } from "react-router-dom";

interface DashboardProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// The actual dashboard content
const DashboardContent = ({ onClose }: { onClose?: () => void }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { profile, loading, creditBalance, tier } = useCredits();
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }
      setUser(user);
      setAuthChecked(true);
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (onClose) onClose();
    navigate("/");
  };

  const getUserName = () => {
    if (user?.email) {
      const fullName = user.email.split('@')[0];
      return fullName.slice(0, 8);
    }
    return "Explorer";
  };

  if (!authChecked || loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gold-500 border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Welcome Section */}
      <div className="mb-4 cursor-pointer group" onClick={() => { if (onClose) onClose(); navigate('/'); }}>
        <h2 className="text-lg font-bold text-gray-900 group-hover:text-gold-600 transition-colors">
          Welcome back, <span className="text-gold-600">{getUserName()}</span>!
          <span className="ml-2 text-xs text-muted-foreground group-hover:text-gold-400 transition-colors">
            (click to go home)
          </span>
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Current Plan: <span className="font-medium text-gold-600 capitalize">{tier || 'Explorer'}</span>
        </p>
      </div>

      {/* Credits Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20">
          <Zap className="h-4 w-4 text-gold-500" />
          <span className="text-sm font-bold text-gold-600">{creditBalance || 0}</span>
          <span className="text-xs text-muted-foreground">credits</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        <div className="bg-white rounded-xl shadow-sm p-3 border border-gold-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Credits</p>
              <p className="text-xl font-bold text-gold-600">{creditBalance || 0}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gold-500/10 flex items-center justify-center">
              <Zap className="h-4 w-4 text-gold-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 border border-gold-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Watchlist</p>
              <p className="text-xl font-bold text-gold-600">0</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gold-500/10 flex items-center justify-center">
              <Star className="h-4 w-4 text-gold-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 border border-gold-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Analyses</p>
              <p className="text-xl font-bold text-gold-600">0</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gold-500/10 flex items-center justify-center">
              <Brain className="h-4 w-4 text-gold-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-3 border border-gold-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Plan</p>
              <p className="text-xl font-bold text-gold-600 capitalize">{tier || 'Explorer'}</p>
            </div>
            <div className="h-8 w-8 rounded-full bg-gold-500/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-gold-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gold-500/10">
          <h3 className="font-semibold text-sm mb-1">AI Stock Analysis</h3>
          <p className="text-gray-500 text-xs mb-2">Get AI-powered predictions for any stock</p>
          <Button
            onClick={() => {
              if (onClose) onClose();
              navigate('/ai-stocks');
            }}
            className="w-full bg-gradient-gold text-navy font-bold hover:opacity-90 transition-opacity text-xs h-8"
          >
            Analyze a Stock
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gold-500/10">
          <h3 className="font-semibold text-sm mb-1">AI Mark 6</h3>
          <p className="text-gray-500 text-xs mb-2">AI-powered lottery predictions</p>
          <Button
            onClick={() => {
              if (onClose) onClose();
              navigate('/mark6-game');
            }}
            className="w-full bg-gradient-gold text-navy font-bold hover:opacity-90 transition-opacity text-xs h-8"
          >
            Play AI Mark 6
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gold-500/10">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-4 w-4 text-gold-500" />
            <h3 className="font-semibold text-sm">Pricing Plan</h3>
          </div>
          <p className="text-gray-500 text-xs mb-2">
            {creditBalance > 0 
              ? `You have ${creditBalance} credits available` 
              : 'No active plan. Choose a plan to get started.'}
          </p>
          <Button
            onClick={() => {
              if (onClose) onClose();
              navigate('/pricing');
            }}
            variant="outline"
            className="w-full border-gold-500/30 text-gold-600 hover:bg-gold-50 text-xs h-8"
          >
            View Plans
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gold-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-gold-500" />
            <h3 className="font-semibold text-sm">My Watchlist</h3>
          </div>
          <p className="text-gray-400 text-xs text-center py-2">Your watchlist is empty</p>
          <Button
            onClick={() => {
              if (onClose) onClose();
              navigate('/watchlist');
            }}
            variant="outline"
            className="w-full border-gold-500/30 text-gold-600 hover:bg-gold-50 text-xs h-8"
          >
            Manage Watchlist
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gold-500/10">
          <div className="flex items-center gap-2 mb-2">
            <History className="h-4 w-4 text-gold-500" />
            <h3 className="font-semibold text-sm">Recent Activity</h3>
          </div>
          <p className="text-gray-400 text-xs text-center py-2">No analyses yet</p>
          <Button
            onClick={() => {
              if (onClose) onClose();
              navigate('/ai-stocks');
            }}
            variant="outline"
            className="w-full border-gold-500/30 text-gold-600 hover:bg-gold-50 text-xs h-8"
          >
            Start Analysis
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Back to Home */}
      <div className="mt-4 text-center">
        <Button
          variant="ghost"
          onClick={() => {
            if (onClose) onClose();
            navigate('/');
          }}
          className="text-muted-foreground hover:text-gold-600 text-xs"
        >
          <Home className="h-3 w-3 mr-1" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

// Modal version (used as popup)
const Dashboard = ({ open, onOpenChange }: DashboardProps) => {
  if (open === undefined) {
    // Page version (used as full page)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gold-50/20 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <DashboardContent />
        </div>
      </div>
    );
  }

  // Modal version
  return (
    <Dialog open={open} onOpenChange={onOpenChange || (() => {})}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={dragonLogo} alt="DragonGP" className="h-8 w-auto" />
              <span className="text-lg font-bold text-gradient-gold font-display">DragonGP</span>
            </div>
            <div className="flex items-center gap-2">
              <InlineLanguageSwitcher />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (onOpenChange) onOpenChange(false);
                }}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogDescription className="sr-only">Dashboard</DialogDescription>
        </DialogHeader>
        <DashboardContent onClose={() => { if (onOpenChange) onOpenChange(false); }} />
      </DialogContent>
    </Dialog>
  );
};

export default Dashboard;