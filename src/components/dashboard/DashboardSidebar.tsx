import { LayoutDashboard, History, CreditCard, Settings, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLanguage } from "@/contexts/LanguageContext";
import InlineLanguageSwitcher from "@/components/InlineLanguageSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import dragonLogo from "@/assets/dragon-logo.png";

const DashboardSidebar = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const t = {
    en: {
      overview: "Overview",
      history: "Analysis History",
      billing: "Billing & Credits",
      settings: "Account Settings",
      signOut: "Sign Out",
    },
    "zh-TW": {
      overview: "總覽",
      history: "分析紀錄",
      billing: "帳單與積分",
      settings: "帳戶設定",
      signOut: "登出",
    },
    "zh-CN": {
      overview: "总览",
      history: "分析记录",
      billing: "账单与积分",
      settings: "账户设置",
      signOut: "登出",
    },
  }[language] || {
    overview: "Overview",
    history: "Analysis History",
    billing: "Billing & Credits",
    settings: "Account Settings",
    signOut: "Sign Out",
  };

  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: t.overview },
    { to: "/dashboard#history", icon: History, label: t.history },
    { to: "/pricing", icon: CreditCard, label: t.billing },
    { to: "/settings", icon: Settings, label: t.settings },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card border-r border-border p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <img src={dragonLogo} alt="DragonMind" className="w-10 h-10" />
        <span className="font-display text-xl text-gradient-gold font-bold">DragonMind</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            activeClassName="bg-secondary text-primary font-medium"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="space-y-4 pt-6 border-t border-border">
        <InlineLanguageSwitcher />
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">{t.signOut}</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
