import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Trash2, Eye, TrendingUp, TrendingDown, Minus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWatchlist, WatchlistItem } from "@/hooks/useWatchlist";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

const Watchlist = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { watchlist, removeFromWatchlist } = useWatchlist();

  const translations = {
    en: {
      title: "My Watchlist",
      backHome: "Back to Home",
      stockSymbol: "Stock Symbol",
      companyName: "Company Name",
      livePrice: "Live Price",
      aiSignal: "AI Signal",
      actions: "Actions",
      viewReport: "View Report",
      delete: "Delete",
      emptyTitle: "Your watchlist is empty",
      emptyMessage: "Go to AI Stocks to add your first stock!",
      goToAIStocks: "Go to AI Stocks",
      buy: "BUY",
      sell: "SELL",
      hold: "HOLD",
      removed: "Removed from Watchlist",
    },
    "zh-TW": {
      title: "我的自選股",
      backHome: "返回首頁",
      stockSymbol: "代碼",
      companyName: "公司名稱",
      livePrice: "現價",
      aiSignal: "AI 信號",
      actions: "操作",
      viewReport: "查看報告",
      delete: "刪除",
      emptyTitle: "您的自選股名單是空的",
      emptyMessage: "請前往 AI 股票頁面添加！",
      goToAIStocks: "前往 AI 股票",
      buy: "買入",
      sell: "賣出",
      hold: "持有",
      removed: "已從自選股移除",
    },
    "zh-CN": {
      title: "我的自选股",
      backHome: "返回首页",
      stockSymbol: "代码",
      companyName: "公司名称",
      livePrice: "现价",
      aiSignal: "AI 信号",
      actions: "操作",
      viewReport: "查看报告",
      delete: "删除",
      emptyTitle: "您的自选股名单是空的",
      emptyMessage: "请前往 AI 股票页面添加！",
      goToAIStocks: "前往 AI 股票",
      buy: "买入",
      sell: "卖出",
      hold: "持有",
      removed: "已从自选股移除",
    }
  };

  const t = translations[language] || translations.en;

  const getCurrencySymbol = (currency: string) => {
    if (currency === "HKD") return "HK$";
    if (currency === "TWD") return "NT$";
    if (currency === "USD") return "$";
    return currency;
  };

  const getSignalDisplay = (signal: WatchlistItem["aiSignal"]) => {
    switch (signal) {
      case "buy":
        return {
          text: t.buy,
          color: "text-green-400",
          bgColor: "bg-green-500/20",
          icon: TrendingUp,
        };
      case "sell":
        return {
          text: t.sell,
          color: "text-red-400",
          bgColor: "bg-red-500/20",
          icon: TrendingDown,
        };
      default:
        return {
          text: t.hold,
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
          icon: Minus,
        };
    }
  };

  const handleViewReport = (item: WatchlistItem) => {
    // Navigate to report with stock data
    navigate("/report", {
      state: {
        reportData: {
          ticker: item.ticker,
          name: item.name,
          price: item.price,
          change: item.change,
          currency: item.currency,
          market: item.market,
          // These would need to be fetched fresh, using placeholder values
          rsi: 50,
          macd: 0,
          macdSignal: 0,
          macdHistogram: 0,
          probability: 50,
          highTarget: item.price * 1.1,
          lowTarget: item.price * 0.9,
          high52Week: item.price * 1.2,
          low52Week: item.price * 0.8,
          volume: "N/A",
          buyPercent: 33,
          holdPercent: 34,
          sellPercent: 33,
          aiSummary: "",
        },
      },
    });
  };

  const handleDelete = (ticker: string) => {
    removeFromWatchlist(ticker);
    toast.success(t.removed);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-[100vw] overflow-x-hidden" style={{ backgroundColor: "#0F172A" }}>
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 px-2 md:px-4 max-w-[100vw] overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8 gap-2">
            <div className="flex items-center gap-2 md:gap-4">
              <Star className="w-6 h-6 md:w-10 md:h-10 text-yellow-500 flex-shrink-0" />
              <h1 className="text-xl md:text-4xl font-bold text-white">{t.title}</h1>
            </div>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs md:text-sm px-2 md:px-4 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">{t.backHome}</span>
              <span className="md:hidden">←</span>
            </Button>
          </div>

          {watchlist.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20">
              <Star className="w-24 h-24 text-gray-600 mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 text-center">
                {t.emptyTitle}
              </h2>
              <p className="text-xl text-gray-400 mb-8 text-center max-w-md">
                {t.emptyMessage}
              </p>
              <Button
                onClick={() => navigate("/ai-stocks")}
                size="lg"
                className="text-lg px-8 py-6 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black font-bold"
              >
                {t.goToAIStocks}
              </Button>
            </div>
          ) : (
            /* Watchlist Table - Mobile Optimized */
            <div className="rounded-xl overflow-hidden border border-gray-700 max-w-[100vw]" style={{ backgroundColor: "#1E293B" }}>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-700 hover:bg-transparent">
                      <TableHead className="text-[1.2rem] font-bold text-[#FFD700] py-4">{t.stockSymbol}</TableHead>
                      <TableHead className="text-[1.2rem] font-bold text-[#FFD700] py-4">{t.companyName}</TableHead>
                      <TableHead className="text-[1.2rem] font-bold text-[#FFD700] py-4">{t.livePrice}</TableHead>
                      <TableHead className="text-[1.2rem] font-bold text-[#FFD700] py-4">{t.aiSignal}</TableHead>
                      <TableHead className="text-[1.2rem] font-bold text-[#FFD700] py-4 text-right">{t.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {watchlist.map((item) => {
                      const signalDisplay = getSignalDisplay(item.aiSignal);
                      const SignalIcon = signalDisplay.icon;
                      const isPositive = item.change >= 0;

                      return (
                        <TableRow 
                          key={item.ticker} 
                          className="border-b border-gray-700/50 hover:bg-[#283548] transition-colors"
                        >
                          <TableCell className="text-[1.2rem] font-bold text-white py-5">
                            {item.ticker}
                          </TableCell>
                          <TableCell className="text-[1.2rem] text-gray-300 py-5">
                            {item.name}
                          </TableCell>
                          <TableCell className="py-5">
                            <div className="flex flex-col">
                              <span className={`text-[1.2rem] font-bold ${isPositive ? "text-green-400" : "text-red-400"}`}>
                                {getCurrencySymbol(item.currency)}{item.price.toFixed(2)}
                              </span>
                              <span className={`text-sm ${isPositive ? "text-green-400" : "text-red-400"}`}>
                                {isPositive ? "+" : ""}{item.change.toFixed(2)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-5">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${signalDisplay.bgColor}`}>
                              <SignalIcon className={`w-5 h-5 ${signalDisplay.color}`} />
                              <span className={`text-[1.1rem] font-bold ${signalDisplay.color}`}>
                                {signalDisplay.text}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-5 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <Button
                                onClick={() => handleViewReport(item)}
                                size="sm"
                                className="bg-[#3B82F6] hover:bg-[#3B82F6]/80 text-white text-[1rem] px-4 py-2"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                {t.viewReport}
                              </Button>
                              <Button
                                onClick={() => handleDelete(item.ticker)}
                                size="sm"
                                variant="outline"
                                className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 text-[1rem] px-4 py-2"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t.delete}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden w-full max-w-full" style={{ tableLayout: 'auto' }}>
                <div className="flex justify-between items-center px-3 py-2 border-b border-gray-700">
                  <span className="text-xs font-bold text-[#FFD700]">{t.stockSymbol}</span>
                  <span className="text-xs font-bold text-[#FFD700]">{t.aiSignal}</span>
                  <span className="text-xs font-bold text-[#FFD700]">{t.actions}</span>
                </div>
                {watchlist.map((item) => {
                  const signalDisplay = getSignalDisplay(item.aiSignal);
                  const SignalIcon = signalDisplay.icon;
                  const isPositive = item.change >= 0;

                  return (
                    <div 
                      key={item.ticker} 
                      className="border-b border-gray-700/50 px-2 py-2 flex items-center justify-between gap-1 w-full max-w-full"
                    >
                      {/* Ticker & Price - Compact */}
                      <div className="flex flex-col min-w-0 flex-1 max-w-[100px]">
                        <span className="text-sm font-bold text-white truncate">{item.ticker}</span>
                        <span className={`text-xs font-medium ${isPositive ? "text-green-400" : "text-red-400"}`}>
                          {getCurrencySymbol(item.currency)}{item.price.toFixed(2)}
                        </span>
                      </div>

                      {/* AI Signal Badge - Compact */}
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${signalDisplay.bgColor} flex-shrink-0`}>
                        <SignalIcon className={`w-3 h-3 ${signalDisplay.color}`} />
                        <span className={`text-xs font-bold ${signalDisplay.color}`}>
                          {signalDisplay.text}
                        </span>
                      </div>

                      {/* Action Buttons - Icon only on mobile */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Button
                          onClick={() => handleViewReport(item)}
                          size="sm"
                          className="bg-[#3B82F6] hover:bg-[#3B82F6]/80 text-white p-1.5 h-7 w-7"
                          title={t.viewReport}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(item.ticker)}
                          size="sm"
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20 p-1.5 h-7 w-7"
                          title={t.delete}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Watchlist;
