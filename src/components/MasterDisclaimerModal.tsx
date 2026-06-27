import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";

interface MasterDisclaimerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onDecline: () => void;
}

const MasterDisclaimerModal = ({ open, onOpenChange, onAccept, onDecline }: MasterDisclaimerModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="bg-[#1E293B] border-[#FFD700]/30 text-white w-[95vw] max-w-2xl p-0 flex flex-col"
        style={{ 
          height: '85vh',
          maxHeight: '85vh'
        }}
      >
        {/* Fixed Header */}
        <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6 pb-3 border-b border-[#334155] flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-[#FFD700] text-base md:text-xl">
            <Shield className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
            <span className="leading-tight">Master Terms & Disclaimers / 法律聲明 / 法律声明</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Scrollable Content Area - Buttons are INSIDE scroll area at the end */}
        <div 
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y'
          }}
        >
          <div className="px-4 md:px-6 py-4 space-y-6 text-sm md:text-base leading-relaxed">
            {/* English Section */}
            <section className="space-y-4">
              <h3 className="text-[#60A5FA] font-bold text-base md:text-lg border-b border-[#60A5FA]/30 pb-2">
                DragonGp.Ai: Master Terms & Disclaimers
              </h3>
              
              <div className="space-y-3 text-[#CBD5E1]">
                <div>
                  <p className="font-semibold text-white">1. Nature of Service: Mathematical Modeling</p>
                  <p>DragonGp.Ai is a technology demonstration platform. All outputs are generated through mathematical modeling and algorithmic pattern recognition. These models aggregate public data to show statistical probabilities and are not a substitute for human judgment or professional analysis.</p>
                </div>
                
                <div>
                  <p className="font-semibold text-white">2. Principle of Self-Decision</p>
                  <p>By using this platform, you acknowledge and agree to the principle of Self-Decision. DragonGp.Ai provides data-driven simulations, but the responsibility for any action taken—financial, strategic, or otherwise—rests solely with the user. You are the final decision-maker.</p>
                </div>
                
                <div>
                  <p className="font-semibold text-white">3. No Professional or Gambling Licenses</p>
                  <p>DragonGp.Ai is not a licensed corporation under the HK Securities and Futures Ordinance or the Taiwan Securities Investment Trust and Consulting Act. Furthermore, we do not hold any gambling or gaming licenses. We have no links to any security firms, brokers, or organizations related to gambling. We do not bear any professional experience in the investment, security, or gambling fields.</p>
                </div>
                
                <div>
                  <p className="font-semibold text-white">4. Purpose: Cognitive Engagement & Entertainment</p>
                  <p>All proposals or indications are not encouraging for any investment or gambling purpose. The purpose is for your health and brain activities to prevent cognitive deterioration. This is a way to pass time productively. We discourage taking our AI-generated outputs as a base for real-world investment or gambling activities.</p>
                </div>
                
                <div>
                  <p className="font-semibold text-white">5. Limitation of Liability</p>
                  <p>All actual investments or gaming decisions should be made in consultation with certified professionals or licensed brokers. The operators of DragonGp.Ai shall not be held liable for any direct or indirect losses.</p>
                </div>
              </div>
            </section>

            {/* Traditional Chinese Section */}
            <section className="space-y-4">
              <h3 className="text-[#10B981] font-bold text-base md:text-lg border-b border-[#10B981]/30 pb-2">
                DragonGp.Ai ：法律聲明與服務條款
              </h3>
              
              <div className="space-y-3 text-[#CBD5E1]">
                <div>
                  <p className="font-semibold text-white">1. 服務性質：數學模型演算法</p>
                  <p>DragonGp.Ai 是一個技術演示平台。本平台所有輸出內容均透過「數學模型」與演算法模式識別生成。這些模型僅是針對公開數據進行統計學上的概率呈現，並不代表專業分析，亦不能取代人類的判斷。</p>
                </div>
                
                <div>
                  <p className="font-semibold text-white">2. 自主決策原則 (Self-Decision)</p>
                  <p>當您使用本平台時，即代表您承認並同意「自主決策」原則。DragonGp.Ai 提供的是數據驅動的模擬結果，但任何進一步行動（無論是財務、策略或其他性質）的責任完全由用戶本人承擔。您是最終的決策者。</p>
                </div>
                
                <div>
                  <p className="font-semibold text-white">3. 無專業執照與博弈牌照聲明</p>
                  <p>DragonGp.Ai 並非持牌證券投資顧問機構，亦不持有任何博弈（賭博）牌照。我們與任何證券公司、經紀行或博弈組織均無關聯。我們在投資、證券或博弈領域不具備任何專業執照或職業經驗。</p>
                </div>
                
                <div>
                  <p className="font-semibold text-white">4. 宗旨：認知參與、大腦活化與娛樂</p>
                  <p>所有方案或指標並非鼓勵任何投資或博弈行為。本平台之初衷係透過數據分析活動協助用戶「鍛鍊大腦、預防退化」及「消磨時間」。我們明確勸喻並反對用戶將 AI 生成內容作為實際投資或博弈之依據。</p>
                </div>
                
                <div>
                  <p className="font-semibold text-white">5. 責任限制</p>
                  <p>所有實際投資或博弈決定應諮詢持牌專業經紀商、金融機構或專業顧問。用戶需「風險自擔」，本平台營運者對用戶做出之決定概不負責。</p>
                </div>
              </div>
            </section>

            {/* Simplified Chinese Section */}
            <section className="space-y-4">
              <h3 className="text-[#F59E0B] font-bold text-base md:text-lg border-b border-[#F59E0B]/30 pb-2">
                DragonGp.Ai ：法律声明与服务条款
              </h3>
              
              <div className="space-y-3 text-[#CBD5E1]">
                <div>
                  <p className="font-semibold text-white">1. 服务性质：数学模型算法</p>
                  <p>DragonGp.Ai 是一个技术演示平台。本平台所有输出内容均通过"数学模型"与算法模式识别生成。这些模型仅是针对公开数据进行统计学上的概率呈现，并不代表专业分析，亦不能取代人类的判断。</p>
                </div>
                
                <div>
                  <p className="font-semibold text-white">2. 自主决策原则 (Self-Decision)</p>
                  <p>当您使用本平台时，即代表您承认并同意"自主决策"原则。DragonGp.Ai 提供的是数据驱动的模拟结果，但任何进一步行动（无论是财务、策略或其他性质）的责任完全由用户本人承担。您是最终的决策者。</p>
                </div>
                
                <div>
                  <p className="font-semibold text-white">3. 无专业执照与博弈牌照声明</p>
                  <p>DragonGp.Ai 并非持牌证券投资顾问机构，亦不持有任何博弈（赌博）牌照。我们与任何证券公司、经纪行或博弈组织均无关联。我们在投资、证券或博弈领域不具备任何专业执照或职业经验。</p>
                </div>
                
                <div>
                  <p className="font-semibold text-white">4. 宗旨：认知参与、大脑活化与娱乐</p>
                  <p>所有方案或指标并非鼓励任何投资或博弈行为。本平台之初衷系通过数据分析活动协助用户"锻炼大脑、预防退化"及"消磨时间"。我们明确劝喻并反对用户将 AI 生成内容作为实际投资或博弈的依据。</p>
                </div>
                
                <div>
                  <p className="font-semibold text-white">5. 责任限制</p>
                  <p>所有实际投资或博弈决定应咨询持牌专业经纪商、金融机构或专业顾问。用户需"风险自担"，本平台运营者对用户做出之决定概不负责。</p>
                </div>
              </div>
            </section>

            {/* Buttons at the END of disclaimer content - user must scroll to see them */}
            <div className="pt-6 pb-2 border-t border-[#334155]">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={onDecline}
                  className="w-full sm:flex-1 py-3 border-[#EF4444]/50 text-[#EF4444] hover:bg-[#EF4444]/10 hover:text-[#EF4444] font-semibold"
                >
                  Decline / 拒絕 / 拒绝
                </Button>
                <Button
                  onClick={onAccept}
                  className="w-full sm:flex-1 py-3 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold"
                >
                  Accept & Continue / 接受並繼續 / 接受并继续
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MasterDisclaimerModal;
