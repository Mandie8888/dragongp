import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface RefundPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RefundPolicyDialog = ({ open, onOpenChange }: RefundPolicyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-background border-dragon/30">
        {/* Custom Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-50 rounded-full bg-dragon/20 hover:bg-dragon/40 text-foreground"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-5 w-5" />
        </Button>

        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-dragon text-center">
            Refund Policy / 退款政策
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh] px-6 pb-6">
          <div className="space-y-8 text-foreground">
            {/* English Version */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-dragon border-b border-dragon/30 pb-2">
                Refund Policy (English)
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold italic text-dragon">
                    1. <span className="text-gold font-bold">No Refund Policy</span>
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    Due to the digital nature of our AI reports and the <span className="text-gold font-bold">real-time computing costs</span> involved, all sales of "Coffee Plan" credits and monthly subscriptions are <span className="text-gold font-bold">final and non-refundable</span>. If you experience a technical error where credits were deducted but no report was generated, please contact us at contact@dragongp.ai for a manual credit adjustment.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold italic text-dragon">
                    2. How to Cancel (<span className="text-gold font-bold">Unsubscribe / Self-Service</span>)
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    You are in full control of your subscription. To stop future billing, please visit the <span className="text-gold font-bold">Unsubscribe Page</span> in the website footer. As this is a <span className="text-gold font-bold">Self-Service platform</span>, you are responsible for managing your own cancellations through the portal.
                  </p>
                  <ul className="mt-2 text-muted-foreground list-disc list-inside space-y-1">
                    <li>Click the Unsubscribe button.</li>
                    <li>A window will appear asking for your feedback (e.g., price, interest, or helpfulness).</li>
                  </ul>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    Your input helps us improve this hobby project for other explorers.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold italic text-dragon">
                    3. Finality of Charges
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    Once you confirm and submit your unsubscription, no further charges will be made. However, <span className="text-dragon font-bold">previously processed payments are non-refundable</span>. If you have questions before you confirm, please message contact@dragongp.ai.
                  </p>
                </div>
              </div>
            </section>

            {/* Traditional Chinese Version */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-dragon border-b border-dragon/30 pb-2">
                退款政策（繁體中文）
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold italic text-dragon">
                    1. <span className="text-gold font-bold">無退款政策</span>
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    鑒於 AI 報告的數位性質以及涉及的<span className="text-gold font-bold">即時計算成本</span>，所有「咖啡方案」點數及月費訂閱的銷售均為<span className="text-gold font-bold">最終決定，恕不退款</span>。如果您遇到點數已扣除但未生成報告的技術錯誤，請聯繫 contact@dragongp.ai 進行手動點數調整。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold italic text-dragon">
                    2. 如何取消訂閱（<span className="text-gold font-bold">Unsubscribe / 自助服務</span>）
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    您擁有訂閱的完全控制權。如需停止後續扣款，請前往頁尾的「<span className="text-gold font-bold">取消訂閱</span>」(Unsubscribe) 頁面。
                  </p>
                  <ul className="mt-2 text-muted-foreground list-disc list-inside space-y-1">
                    <li>點擊「取消訂閱」按鈕。</li>
                    <li>系統將彈出視窗詢問原因（例如：價格太高、內容不感興趣、沒有幫助等）。</li>
                  </ul>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    您的回饋將幫助我們優化這項興趣計劃。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold italic text-dragon">
                    3. 費用確認
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    一旦您按下「確認」並「提交」，後續將不再扣費，但<span className="text-dragon font-bold">此前已產生的費用恕不退還</span>。若在確認前有任何疑問，請致信 contact@dragongp.ai。
                  </p>
                </div>
              </div>
            </section>

            {/* Simplified Chinese Version */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-dragon border-b border-dragon/30 pb-2">
                退款政策（简体中文）
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold italic text-dragon">
                    1. <span className="text-gold font-bold">无退款政策</span>
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    鉴于 AI 报告的数字性质以及涉及的<span className="text-gold font-bold">实时计算成本</span>，所有"咖啡方案"点数及月费订阅的销售均为<span className="text-gold font-bold">最终决定，恕不退款</span>。如果您遇到点数已扣除但未生成报告的技术错误，请联系 contact@dragongp.ai 进行手动点数调整。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold italic text-dragon">
                    2. 如何取消订阅（<span className="text-gold font-bold">Unsubscribe / 自助服务</span>）
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    您拥有订阅的完全控制权。如需停止后续扣款，请前往页脚的"<span className="text-gold font-bold">取消订阅</span>"(Unsubscribe) 页面。
                  </p>
                  <ol className="mt-2 text-muted-foreground list-decimal list-inside space-y-1">
                    <li>点击"取消订阅"按钮。</li>
                    <li>系统将弹出窗口询问原因（例如：价格太高、内容不感兴趣、没有帮助等）。</li>
                    <li>您的反馈将帮助我们优化这项兴趣计划。</li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-bold italic text-dragon">
                    3. 费用确认
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    一旦您按下"确认"并"提交"，后续将不再扣费，但<span className="text-dragon font-bold">此前已产生的费用恕不退款</span>。若在确认前有任何疑问，请致信 contact@dragongp.ai。
                  </p>
                </div>
              </div>
            </section>

            {/* Back to Home Button */}
            <div className="flex justify-center pt-4">
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

export default RefundPolicyDialog;
