import { useCallback, useMemo, useSyncExternalStore } from "react";

export interface WatchlistItem {
  ticker: string;
  name: string;
  price: number;
  change: number;
  currency: string;
  market: string;
  aiSignal: "buy" | "sell" | "hold";
  addedAt: string;
}

const WATCHLIST_KEY = "dragonGP_watchlist";

// Get watchlist from localStorage
const getWatchlistFromStorage = (): WatchlistItem[] => {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    const result = stored ? JSON.parse(stored) : [];
    console.log("[Watchlist] Read from storage:", result);
    return result;
  } catch (e) {
    console.error("[Watchlist] Failed to parse:", e);
    return [];
  }
};

// Save watchlist to localStorage
const saveWatchlistToStorage = (items: WatchlistItem[]): void => {
  console.log("[Watchlist] Saving to storage:", items);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(items));
  // Dispatch custom event for cross-component sync
  window.dispatchEvent(new CustomEvent("watchlist-updated"));
};

// Subscribe to watchlist changes (for useSyncExternalStore)
const subscribe = (callback: () => void): (() => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === WATCHLIST_KEY) {
      console.log("[Watchlist] Storage event triggered");
      callback();
    }
  };
  
  const handleCustomEvent = () => {
    console.log("[Watchlist] Custom event triggered");
    callback();
  };
  
  window.addEventListener("storage", handleStorageChange);
  window.addEventListener("watchlist-updated", handleCustomEvent);
  
  return () => {
    window.removeEventListener("storage", handleStorageChange);
    window.removeEventListener("watchlist-updated", handleCustomEvent);
  };
};

// Get snapshot for useSyncExternalStore
const getSnapshot = (): string => {
  return localStorage.getItem(WATCHLIST_KEY) || "[]";
};

// Server snapshot (same as client for SSR compatibility)
const getServerSnapshot = (): string => {
  return "[]";
};

const MAX_WATCHLIST_SIZE = 10;

export function useWatchlist() {
  // Use useSyncExternalStore for proper synchronization
  const watchlistString = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  
  // Parse watchlist with memoization
  const watchlist: WatchlistItem[] = useMemo(() => {
    try {
      return JSON.parse(watchlistString);
    } catch {
      return [];
    }
  }, [watchlistString]);

  const addToWatchlist = useCallback((item: Omit<WatchlistItem, "addedAt">): { success: boolean; reason?: "duplicate" | "full" } => {
    console.log("[Watchlist] Adding item:", item.ticker);
    const current = getWatchlistFromStorage();
    
    // Check for duplicates
    const exists = current.some((i) => i.ticker === item.ticker);
    if (exists) {
      console.log("[Watchlist] Item already exists:", item.ticker);
      return { success: false, reason: "duplicate" };
    }
    
    // Check for max limit
    if (current.length >= MAX_WATCHLIST_SIZE) {
      console.log("[Watchlist] List is full, max:", MAX_WATCHLIST_SIZE);
      return { success: false, reason: "full" };
    }
    
    const newItem: WatchlistItem = {
      ...item,
      addedAt: new Date().toISOString(),
    };
    const updated = [...current, newItem];
    saveWatchlistToStorage(updated);
    console.log("[Watchlist] Successfully added:", item.ticker);
    return { success: true };
  }, []);

  const removeFromWatchlist = useCallback((ticker: string): void => {
    console.log("[Watchlist] Removing item:", ticker);
    const current = getWatchlistFromStorage();
    const updated = current.filter((i) => i.ticker !== ticker);
    saveWatchlistToStorage(updated);
    console.log("[Watchlist] Successfully removed:", ticker);
  }, []);

  const isInWatchlist = useCallback((ticker: string): boolean => {
    const current = getWatchlistFromStorage();
    const exists = current.some((i) => i.ticker === ticker);
    console.log("[Watchlist] Check if exists:", ticker, exists);
    return exists;
  }, []);

  const toggleWatchlist = useCallback((item: Omit<WatchlistItem, "addedAt">): { added: boolean; reason?: "duplicate" | "full" } => {
    console.log("[Watchlist] Toggle:", item.ticker);
    if (isInWatchlist(item.ticker)) {
      removeFromWatchlist(item.ticker);
      return { added: false }; // Removed, so now NOT in watchlist
    } else {
      const result = addToWatchlist(item);
      if (!result.success) {
        return { added: false, reason: result.reason };
      }
      return { added: true }; // Added, so now IN watchlist
    }
  }, [isInWatchlist, removeFromWatchlist, addToWatchlist]);

  const getWatchlistCount = useCallback((): number => {
    return getWatchlistFromStorage().length;
  }, []);

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    getWatchlistCount,
    maxSize: MAX_WATCHLIST_SIZE,
  };
}
