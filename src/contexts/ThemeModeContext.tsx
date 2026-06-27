import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "react-router-dom";

export type ThemeMode = "stocks" | "games" | "neutral";

interface ThemeModeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeModeContext = createContext<ThemeModeContextType | undefined>(undefined);

const STOCK_ROUTES = ["/ai-stocks", "/report", "/watchlist", "/generate-report-stock"];
const GAME_ROUTES = ["/generate-report", "/mark6-game", "/mark6-results"];

function detectMode(pathname: string): ThemeMode {
  if (STOCK_ROUTES.some((r) => pathname.startsWith(r))) return "stocks";
  if (GAME_ROUTES.some((r) => pathname.startsWith(r))) return "games";
  return "neutral";
}

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [mode, setMode] = useState<ThemeMode>(() => detectMode(location.pathname));

  useEffect(() => {
    const detected = detectMode(location.pathname);
    setMode(detected);
  }, [location.pathname]);

  // Apply mode class to html element for CSS cascading
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("mode-stocks", "mode-games", "mode-neutral");
    html.classList.add(`mode-${mode}`);
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return context;
};
