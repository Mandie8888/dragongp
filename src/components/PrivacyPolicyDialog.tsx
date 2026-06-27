import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface PrivacyPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivacyPolicyDialog = ({ open, onOpenChange }: PrivacyPolicyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        {/* Custom Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 rounded-full bg-dragon/20 p-2 text-foreground hover:bg-dragon/40 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <ScrollArea className="h-[85vh] p-6 pt-12">
          <div className="space-y-8">
            {/* English Version */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-dragon border-b border-dragon/30 pb-2">
                Privacy Policy (English)
              </h2>
              
              <div className="space-y-4 text-foreground/90">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Data Usage</h3>
                  <p>
                    We collect minimal data (such as email) solely for automated subscription management via{" "}
                    <span className="font-bold text-dragon-gold">Stripe</span>. To protect our founder's retirement lifestyle, we do not perform manual data processing or manual account lookups.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Feedback & Testimonials</h3>
                  <p>
                    If you provide feedback, we may use it for promotion using a{" "}
                    <span className="font-bold text-dragon-gold">"Hidden Name" format</span>{" "}
                    (e.g., Mr. L, Taipei) to protect your identity.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Third-Party Services</h3>
                  <p>
                    Payments are secured and automated by{" "}
                    <span className="font-bold text-dragon-gold">Stripe</span>; we do not store your credit card details.
                  </p>
                </div>
              </div>
            </section>

            {/* Traditional Chinese Version */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-dragon border-b border-dragon/30 pb-2">
                隱私政策（繁體中文）
              </h2>
              
              <div className="space-y-4 text-foreground/90">
                <div>
                  <h3 className="font-semibold text-lg mb-2">數據用途</h3>
                  <p>
                    我們僅收集最少量的數據（如電子郵件），僅用於透過{" "}
                    <span className="font-bold text-dragon-gold">Stripe</span>{" "}
                    進行訂閱管理。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">回饋與見證</h3>
                  <p>
                    若您提供回饋，我們可能會以{" "}
                    <span className="font-bold text-dragon-gold">「隱藏名稱」格式</span>（如：香港 W 先生）進行網站宣傳，以保護您的隱私。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">第三方服務</h3>
                  <p>
                    付款由{" "}
                    <span className="font-bold text-dragon-gold">Stripe</span>{" "}
                    自動化處理並受其安全保護；本站不會儲存您的信用卡詳細資訊。
                  </p>
                </div>
              </div>
            </section>

            {/* Simplified Chinese Version */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-dragon border-b border-dragon/30 pb-2">
                隐私政策（简体中文）
              </h2>
              
              <div className="space-y-4 text-foreground/90">
                <div>
                  <h3 className="font-semibold text-lg mb-2">数据用途</h3>
                  <p>
                    我们仅收集最少量的数据（如电子邮件），仅用于通过{" "}
                    <span className="font-bold text-dragon-gold">Stripe</span>{" "}
                    进行订阅管理。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">反馈与见证</h3>
                  <p>
                    若您提供反馈，我们可能会以{" "}
                    <span className="font-bold text-dragon-gold">"隐藏名称"格式</span>（如：上海 L 先生）进行网站宣传，以保护您的隐私。
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">第三方服务</h3>
                  <p>
                    付款由{" "}
                    <span className="font-bold text-dragon-gold">Stripe</span>{" "}
                    自动化处理并受其安全保护；本站不会存储您的信用卡详细信息。
                  </p>
                </div>
              </div>
            </section>

            {/* Back to Home Button */}
            <div className="flex justify-center pt-4 pb-8">
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-dragon hover:bg-dragon/80 text-white px-8 py-2"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyDialog;
