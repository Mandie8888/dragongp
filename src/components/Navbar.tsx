import React, { useState, useEffect, useRef } from "react";
import { Menu, X, LogOut, ChevronDown, LayoutDashboard, Star, Settings, LogIn, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import dragonLogo from "@/assets/dragon-logo.png";
import HorseLogoSVG from "./report/HorseLogoSVG";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { useThemeMode } from "@/contexts/ThemeModeContext";
import type { User, Session } from "@supabase/supabase-js";
import SignUpDialog from "./SignUpDialog";

const navTranslations = {
  en: {
    home: "Home",
    aboutUs: "About us",
    howItWorks: "How it Works",
    aiStocks: "AI Stocks",
    aiProbabilityLine1: "AI Mark 6",
    aiProbabilityLine2: "Probability",
    feedback: "Feedback",
    joinLogin: "Join/Login",
    welcomeBack: "Welcome back!",
    welcomeBackName: "Welcome back, {name}!",
    logout: "Logout",
    dashboard: "Dashboard",
    myWatchlist: "My Watchlist",
    aiInsights: "AI Insights",
    myPlan: "My Plan",
    settings: "Settings",
    login: "Login",
    register: "Register",
  },
  "zh-TW": {
    home: "首頁",
    aboutUs: "關於我們",
    howItWorks: "運作原理",
    aiStocks: "AI 股票",
    aiProbabilityLine1: "AI 六合神器 或然率",
    aiProbabilityLine2: "",
    feedback: "意見回饋",
    joinLogin: "註冊/登入",
    welcomeBack: "歡迎回來！",
    welcomeBackName: "歡迎回來，{name}！",
    logout: "登出",
    dashboard: "控制面板",
    myWatchlist: "我的自選股",
    aiInsights: "AI 投資洞察",
    myPlan: "我的方案",
    settings: "設定",
    login: "登入",
    register: "註冊",
  },
  "zh-CN": {
    home: "首页",
    aboutUs: "关于我们",
    howItWorks: "运作原理",
    aiStocks: "AI 股票",
    aiProbabilityLine1: "AI 六合神器 或然率",
    aiProbabilityLine2: "",
    feedback: "意见反馈",
    joinLogin: "注册/登录",
    welcomeBack: "欢迎回来！",
    welcomeBackName: "欢迎回来，{name}！",
    logout: "登出",
    dashboard: "控制面板",
    myWatchlist: "我的自选股",
    aiInsights: "AI 投资洞察",
    myPlan: "我的方案",
    settings: "设置",
    login: "登录",
    register: "注册",
  },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSignUpDialog, setShowSignUpDialog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { mode } = useThemeMode();
  const navigate = useNavigate();
  const t = navTranslations[language];

  const navBg = mode === "games"
    ? "bg-[#043927]/90 backdrop-blur-lg border-b border-[#0a5e3a]"
    : "glass border-b border-border/50";

  const activeHighlight = mode === "games"
    ? "text-[#FFD700] font-bold"
    : mode === "stocks"
      ? "text-gold-500 font-bold"
      : "text-foreground font-bold";

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
        } else {
          setUserName(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      if (existingSession?.user) {
        fetchUserProfile(existingSession.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data } = await supabase
  .from('profiles')
  .select('email')
  .eq('user_id', userId)
  .single();
    if (data?.email) {
      const name = data.email.split('@')[0];
      setUserName(name);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    toast.success(language === 'en' ? 'Logged out successfully' : '已成功登出');
    navigate('/');
  };

  const getGreeting = () => {
    if (userName) {
      return t.welcomeBackName.replace('{name}', userName);
    }
    return t.welcomeBack;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dropdownMenuItems = [
    { label: t.dashboard, icon: LayoutDashboard, href: "/dashboard" },
    { label: t.myWatchlist, icon: Star, href: "/watchlist" },
    { label: t.settings, icon: Settings, href: "/settings" },
  ];

  const navLinks = [
    { name: t.home, href: "/", isRoute: true },
    { name: t.aboutUs, href: "/about", isRoute: true },
    { name: t.howItWorks, href: "/how-it-works", isRoute: true },
    { name: t.aiStocks, href: "/ai-stocks", isRoute: true },
    { name: t.myWatchlist, href: "/watchlist", isRoute: true },
    { name: "aiProbability", href: "/generate-report", isRoute: true, isMultiLine: true },
    { name: t.feedback, href: "/feedback", isRoute: true },
  ];

  const renderAiProbabilityLink = (isMobile: boolean = false) => {
    const isEnglish = language === 'en';
    const baseClasses = "text-muted-foreground hover:text-foreground transition-colors duration-300 font-semibold text-sm";
    
    if (isEnglish) {
      return (
        <Link
          to="/generate-report"
          className={`${baseClasses} flex flex-col items-center leading-tight ${isMobile ? 'py-1' : ''}`}
          onClick={isMobile ? () => setIsOpen(false) : undefined}
        >
          <span>{t.aiProbabilityLine1}</span>
          <span>{t.aiProbabilityLine2}</span>
        </Link>
      );
    } else {
      return (
        <Link
          to="/generate-report"
          className={`${baseClasses} whitespace-nowrap ${isMobile ? 'py-1' : ''}`}
          onClick={isMobile ? () => setIsOpen(false) : undefined}
        >
          {t.aiProbabilityLine1}
        </Link>
      );
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-500 ${navBg}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={dragonLogo} 
              alt="DragonGp.Ai" 
              className="h-10 md:h-16 w-auto object-contain"
              style={{ background: 'transparent', mixBlendMode: 'normal' }}
            />
            <HorseLogoSVG size={32} className="hidden md:block" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              if (link.isMultiLine) {
                return <React.Fragment key="aiProbability">{renderAiProbabilityLink(false)}</React.Fragment>;
              }
              return link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-semibold"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-semibold"
                >
                  {link.name}
                </a>
              );
            })}
            <LanguageToggle />
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center gap-2 text-lg font-bold drop-shadow-sm transition-colors ${activeHighlight}`}
                >
                  {getGreeting()}
                  <ChevronDown size={18} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                    {dropdownMenuItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <item.icon size={18} className="text-primary" />
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-border" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut size={18} />
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => {
                  console.log('🔵 Login button clicked!');
                  window.location.href = '/login';
                }}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-semibold flex items-center gap-1"
              >
                <LogIn size={16} />
                {t.login}
              </button>
            )}
          </div>

          <button
            className="md:hidden text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-3 border-t border-border bg-card z-[100]">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                if (link.isMultiLine) {
                  return (
                    <Link
                      key="aiProbability-mobile"
                      to="/generate-report"
                      className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-semibold py-2 text-left"
                      onClick={() => setIsOpen(false)}
                    >
                      {language === 'en' ? `${t.aiProbabilityLine1} ${t.aiProbabilityLine2}` : t.aiProbabilityLine1}
                    </Link>
                  );
                }
                return link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-semibold py-2 text-left"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-semibold py-2 text-left"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                );
              })}
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
                <LanguageToggle />
                {user ? (
                  <div className="flex flex-col gap-1">
                    <span className={`text-sm font-bold drop-shadow-sm py-2 text-left ${activeHighlight}`}>
                      {getGreeting()}
                    </span>
                    {dropdownMenuItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors text-left"
                      >
                        <item.icon size={16} className="text-primary" />
                        {item.label}
                      </Link>
                    ))}
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 py-2 text-sm font-semibold text-destructive hover:text-destructive/80 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      {t.logout}
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      console.log('🔵 Mobile Login button clicked!');
                      setIsOpen(false);
                      window.location.href = '/login';
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-semibold flex items-center gap-2"
                  >
                    <LogIn size={16} />
                    {t.login}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <SignUpDialog open={showSignUpDialog} onOpenChange={setShowSignUpDialog} />
    </nav>
  );
};

export default Navbar;