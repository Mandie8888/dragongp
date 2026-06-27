import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface AdminPromoButtonProps {
  userEmail: string | null;
}

const ADMIN_EMAILS = ["dragongpai@gmail.com"];

const AdminPromoPanel = ({ userEmail }: AdminPromoButtonProps) => {
  const { language } = useLanguage();
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) return null;

  const t = {
    en: { title: "Admin: Bulk Promo", btn: "Send Promo to All Users", sending: "Sending...", success: "sent", failed: "failed", of: "of" },
    "zh-TW": { title: "管理員：批量推廣", btn: "向所有用戶發送推廣郵件", sending: "發送中...", success: "已發送", failed: "失敗", of: "/" },
    "zh-CN": { title: "管理员：批量推广", btn: "向所有用户发送推广邮件", sending: "发送中...", success: "已发送", failed: "失败", of: "/" },
  }[language] || { title: "Admin: Bulk Promo", btn: "Send Promo to All Users", sending: "Sending...", success: "sent", failed: "failed", of: "of" };

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("send-bulk-promo", {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.error) throw new Error(res.error.message);
      setResult(res.data);
    } catch (e: any) {
      setError(e.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-xl border border-primary/30 bg-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
        <Mail className="w-4 h-4" /> {t.title}
      </h3>
      <Button onClick={handleSend} disabled={sending} className="w-full" variant="default">
        {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.sending}</> : t.btn}
      </Button>
      {result && (
        <p className="text-xs flex items-center gap-1 text-green-400">
          <CheckCircle className="w-3 h-3" /> {result.sent} {t.success} {t.of} {result.total}
          {result.failed > 0 && <span className="text-destructive ml-1">({result.failed} {t.failed})</span>}
        </p>
      )}
      {error && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}
    </div>
  );
};

export default AdminPromoPanel;
