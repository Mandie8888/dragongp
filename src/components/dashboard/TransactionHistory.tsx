import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, Loader2, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

interface Payment {
  id: string;
  created_at: string;
  amount: number;
  credits_added: number;
  plan_type: string;
  status: string;
}

const TransactionHistory = () => {
  const { language } = useLanguage();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const t = {
    en: {
      title: "Transaction History",
      plan: "Plan",
      credits: "Credits",
      amount: "Amount",
      empty: "No transactions yet.",
      completed: "Paid",
      pending: "Pending",
    },
    "zh-TW": {
      title: "交易記錄",
      plan: "方案",
      credits: "積分",
      amount: "金額",
      empty: "尚無交易記錄。",
      completed: "已付款",
      pending: "待處理",
    },
    "zh-CN": {
      title: "交易记录",
      plan: "方案",
      credits: "积分",
      amount: "金额",
      empty: "尚无交易记录。",
      completed: "已付款",
      pending: "待处理",
    },
  }[language] || {
    title: "Transaction History",
    plan: "Plan",
    credits: "Credits",
    amount: "Amount",
    empty: "No transactions yet.",
    completed: "Paid",
    pending: "Pending",
  };

  const planLabels: Record<string, Record<string, string>> = {
    coffee: { en: "Buy a Coffee", "zh-TW": "請杯咖啡", "zh-CN": "请杯咖啡" },
    pro: { en: "Pro Plan", "zh-TW": "專業方案", "zh-CN": "专业方案" },
    vip: { en: "VIP Plan", "zh-TW": "VIP 方案", "zh-CN": "VIP 方案" },
  };

  useEffect(() => {
    const fetchPayments = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (!error && data) setPayments(data as Payment[]);
      setLoading(false);
    };
    fetchPayments();
  }, []);

  const getPlanLabel = (planType: string) => {
    return planLabels[planType]?.[language] || planLabels[planType]?.en || planType;
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <Receipt className="w-5 h-5 text-primary" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : payments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">{t.empty}</p>
        ) : (
          <div className="space-y-2">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {p.status === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {getPlanLabel(p.plan_type)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(p.created_at), "MMM d, yyyy")} · +{p.credits_added} {t.credits}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gradient-gold shrink-0">
                  ${(p.amount / 100).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
