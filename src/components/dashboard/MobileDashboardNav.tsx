import { LayoutDashboard, History, CreditCard, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLanguage } from "@/contexts/LanguageContext";

const MobileDashboardNav = () => {
  const { language } = useLanguage();

  const t = {
    en: { overview: "Home", history: "History", billing: "Credits", settings: "Settings" },
    "zh-TW": { overview: "首頁", history: "紀錄", billing: "積分", settings: "設定" },
    "zh-CN": { overview: "首页", history: "记录", billing: "积分", settings: "设置" },
  }[language] || { overview: "Home", history: "History", billing: "Credits", settings: "Settings" };

  const items = [
    { to: "/dashboard", icon: LayoutDashboard, label: t.overview },
    { to: "/dashboard#history", icon: History, label: t.history },
    { to: "/pricing", icon: CreditCard, label: t.billing },
    { to: "/settings", icon: Settings, label: t.settings },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around py-2">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className="flex flex-col items-center gap-1 px-3 py-1 text-muted-foreground"
          activeClassName="text-primary"
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px]">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileDashboardNav;
