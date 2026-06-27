import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsOfServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TermsOfServiceDialog = ({ open, onOpenChange }: TermsOfServiceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        {/* Custom Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-50 rounded-full bg-dragon/10 p-2 hover:bg-dragon/20 transition-colors"
        >
          <X className="h-5 w-5 text-dragon" />
        </button>

        <ScrollArea className="h-[85vh] p-6">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-2xl md:text-3xl font-bold text-center text-dragon">
              DragonGp.Ai: Terms of Service (ToS)
            </DialogTitle>
          </DialogHeader>

          {/* English Section */}
          <div className="space-y-6 text-base leading-relaxed mb-12">
            <div>
              <h2 className="text-lg font-bold italic text-dragon mb-2">
                1. Agreement to Terms
              </h2>
              <p className="text-muted-foreground">
                By accessing DragonGp.Ai, you agree to be bound by these Terms and our Master Disclaimer. If you do not agree, please do not use this service.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold italic text-dragon mb-2">
                2. Eligibility
              </h2>
              <p className="text-muted-foreground">
                This website is intended for adults seeking cognitive engagement and entertainment. By using this site, you confirm you are of legal age in your jurisdiction.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold italic text-dragon mb-2">
                3. Nature of Service: The "Open Eye" Principle
              </h2>
              <p className="text-muted-foreground">
                DragonGp.Ai provides "Market Data Summaries" and "AI Probability Analysis." We offer tools for "Mental Gym" exercises. We do not provide financial, investment, or gambling advice.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold italic mb-2">
                <span className="text-gold">4. User Responsibility: Principle of Self-Decision</span>
              </h2>
              <p className="text-muted-foreground">
                By using DragonGp.Ai, you agree that all AI Probability Analysis reports are for educational and strategy-testing purposes only. You acknowledge that trading stocks involves significant risk and that you are <span className="text-gold font-bold">solely responsible for your own financial decisions</span>. DragonGp.Ai does not guarantee the accuracy of any market predictions and shall not be held liable for any financial losses. All actions taken based on the information provided are your <span className="text-gold font-bold">"Self-Decisions"</span>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold italic text-dragon mb-2">
                5. Subscription & Automatic Billing
              </h2>
              <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                <li><strong>Payments:</strong> All payments are handled automatically via Stripe.</li>
                <li><span className="text-dragon font-bold">No Manual Processing:</span> To maintain the founder's retirement lifestyle, we do not accept manual bank transfers.</li>
                <li><strong>Cancellations:</strong> You may cancel your subscription at any time through the automated Customer Portal. No refunds are provided for partial months.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold italic text-dragon mb-2">
                6. Intellectual Property
              </h2>
              <p className="text-muted-foreground">
                The AI-generated insights and website content are the property of DragonGp.Ai. You may use them for personal, non-commercial "Mental Exercises" only.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold italic text-dragon mb-2">
                7. Limitation of Liability
              </h2>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, DragonGp.Ai and its founder shall not be liable for any financial losses, damages, or emotional distress resulting from the use of this service.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-8" />

          {/* Traditional Chinese Section */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-dragon mb-8">
              DragonGp.Ai：服務條款 (ToS)
            </h2>
            
            <div className="space-y-6 text-base leading-relaxed">
              <div>
                <h3 className="text-lg font-bold italic text-dragon mb-2">
                  1. 同意條款
                </h3>
                <p className="text-muted-foreground">
                  透過訪問 DragonGp.Ai，即表示您同意受本條款及我們的「法律聲明」之約束。如果您不同意，請勿使用本服務。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold italic text-dragon mb-2">
                  2. 使用者資格
                </h3>
                <p className="text-muted-foreground">
                  本網站旨在為尋求「認知參與」與「娛樂」的成年人提供服務。使用本網站即表示您確認已達到所屬司法管轄區的法定年齡。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold italic text-dragon mb-2">
                  3. 服務性質：「睜開眼」原則
                </h3>
                <p className="text-muted-foreground">
                  DragonGp.Ai 提供「市場數據摘要」和「AI 概率分析」。我們提供的是「大腦健身房」練習工具。我們不提供財務、投資或博弈建議。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold italic mb-2">
                  <span className="text-gold">4. 用戶責任：自主決策原則</span>
                </h3>
                <p className="text-muted-foreground">
                  使用智能龍 (DragonGp.Ai) 即表示您同意所有 AI 概率分析報告僅用於教育和策略測試目的。您承認股票交易涉及重大風險，並<span className="text-gold font-bold">對自己的財務決策負全部責任</span>。智能龍不保證任何市場預測的準確性，且不對任何財務損失負責。基於所提供資訊而採取的任何行動均屬您的<span className="text-gold font-bold">「自主決策」</span>。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold italic text-dragon mb-2">
                  5. 訂閱與自動計費
                </h3>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>付款方式：</strong>所有款項均通過 Stripe 自動處理。</li>
                  <li><span className="text-dragon font-bold">無人工處理：</span>為維持創辦人的退休生活品質，我們不接受人工銀行轉帳。</li>
                  <li><strong>取消訂閱：</strong>您可隨時通過自動化客戶門戶取消訂閱。不滿整月的費用恕不退還。</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold italic text-dragon mb-2">
                  6. 知識產權
                </h3>
                <p className="text-muted-foreground">
                  AI 生成的見解及網站內容均屬 DragonGp.Ai 所有。您僅能將其用於個人的、非商業性的「大腦練習」。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold italic text-dragon mb-2">
                  7. 責任限制
                </h3>
                <p className="text-muted-foreground">
                  在法律允許的最大範圍內，DragonGp.Ai 及其創辦人對於因使用本服務而導致的任何財務損失、損害或情感困擾，概不承擔任何責任。
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-8" />

          {/* Simplified Chinese Section */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-dragon mb-8">
              DragonGp.Ai：服务条款 (ToS) - 简体中文版
            </h2>
            
            <div className="space-y-6 text-base leading-relaxed">
              <div>
                <h3 className="text-lg font-bold italic text-dragon mb-2">
                  1. 同意条款
                </h3>
                <p className="text-muted-foreground">
                  访问 DragonGp.Ai 即表示您同意受本条款及我们的"法律声明"约束。如果您不同意，请勿使用本服务。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold italic text-dragon mb-2">
                  2. 用户资格
                </h3>
                <p className="text-muted-foreground">
                  本网站旨在为寻求"认知参与"与"娱乐"的成年人提供服务。使用本网站即确认您已达到所属司法管辖区的法定年龄。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold italic text-dragon mb-2">
                  3. 服务性质："睁开眼"原则
                </h3>
                <p className="text-muted-foreground">
                  DragonGp.Ai 提供"市场数据摘要"和"AI 概率分析"。我们提供的是"大脑健身房"练习工具。我们不提供财务、投资或博弈建议。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold italic mb-2">
                  <span className="text-gold">4. 用户责任：自主决策原则</span>
                </h3>
                <p className="text-muted-foreground">
                  使用智能龍 (DragonGp.Ai) 即表示您同意所有 AI 概率分析报告仅用于教育和策略测试目的。您承认股票交易涉及重大风险，并<span className="text-gold font-bold">对自己的财务决策负全部责任</span>。智能龍不保证任何市场预测的准确性，且不对任何财务损失负责。基于所提供信息而采取的任何行动均属您的<span className="text-gold font-bold">"自主决策"</span>。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold italic text-dragon mb-2">
                  5. 订阅与自动结算
                </h3>
                <ul className="text-muted-foreground space-y-2 list-disc list-inside">
                  <li><strong>付款方式：</strong>所有款项均通过 Stripe 自动处理。</li>
                  <li><span className="text-dragon font-bold">无人工处理：</span>为维持创办人的退休生活品质，我们不接受人工银行转账。</li>
                  <li><strong>取消订阅：</strong>本平台采"自助式"管理，您可随时通过自动化客户门户（Customer Portal）取消订阅。不满整月的费用恕不退还。</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold italic text-dragon mb-2">
                  6. 知识产权
                </h3>
                <p className="text-muted-foreground">
                  AI 生成的见解及网站内容均属 DragonGp.Ai 所有。您仅能将其用于个人的、非商业性的"大脑练习"。
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold italic text-dragon mb-2">
                  7. 责任限制
                </h3>
                <p className="text-muted-foreground">
                  在法律允许的最大范围内，DragonGp.Ai 及其创办人对于因使用本服务而导致的任何财务损失、损害或情感困扰，概不承担任何责任。
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="flex justify-center pt-6 pb-4">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-dragon hover:bg-dragon/90 text-white px-8 py-3 text-lg font-semibold"
            >
              Back to Home
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsOfServiceDialog;
