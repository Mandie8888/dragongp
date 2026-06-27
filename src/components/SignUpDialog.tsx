import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface SignUpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
}

const SignUpDialog = ({ open, onOpenChange, redirectTo }: SignUpDialogProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAlreadyClaimed, setShowAlreadyClaimed] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Unlock Your 48-Hour Pass",
      loginTitle: "Welcome Back",
      description: "Enter your email to claim your free explorer gift",
      loginDescription: "Sign in to continue your journey",
      emailPlaceholder: "Enter your email",
      passwordPlaceholder: "Create a password",
      loginPasswordPlaceholder: "Enter your password",
      submitButton: "Sign Up & Claim Gift",
      loginButton: "Sign In",
      submitting: "Processing...",
      disclaimer: "By signing up, you agree to our",
      masterDisclaimer: "Master Disclaimer",
      and: "and the",
      selfDecision: "Principle of Self-Decision",
      notice: "This is a technology demonstration for entertainment and cognitive engagement only.",
      welcomeTitle: "Thank you for joining us! 🎉",
      welcomeBody: "Your gift has been given to you, please enjoy your journey.",
      startExploring: "Continue to Mark6 Game",
      switchToLogin: "Already have an account? Sign in",
      switchToSignup: "Don't have an account? Sign up",
      alreadyClaimedTitle: "Gift Already Claimed",
      alreadyClaimedBody: "Your gift has been claimed. Please continue.",
      continueBtn: "Continue to Mark6 Game",
    },
    tc: {
      title: "解鎖您的48小時通行證",
      loginTitle: "歡迎回來",
      description: "輸入您的郵箱領取免費探索者禮物",
      loginDescription: "登入以繼續您的旅程",
      emailPlaceholder: "輸入您的郵箱",
      passwordPlaceholder: "創建密碼",
      loginPasswordPlaceholder: "輸入密碼",
      submitButton: "註冊並領取禮物",
      loginButton: "登入",
      submitting: "處理中...",
      disclaimer: "註冊即表示您同意我們的",
      masterDisclaimer: "總免責聲明",
      and: "和",
      selfDecision: "自主決策原則",
      notice: "這是僅供娛樂和認知參與的技術演示。",
      welcomeTitle: "感謝您的加入！🎉",
      welcomeBody: "禮物已送達，請開啟您的 AI 投資之旅。",
      startExploring: "前往 Mark6 遊戲",
      switchToLogin: "已有賬戶？登入",
      switchToSignup: "沒有賬戶？註冊",
      alreadyClaimedTitle: "禮物已領取",
      alreadyClaimedBody: "您已領取過禮物。請繼續使用。",
      continueBtn: "前往 Mark6 遊戲",
    },
    sc: {
      title: "解锁您的48小时通行证",
      loginTitle: "欢迎回来",
      description: "输入您的邮箱领取免费探索者礼物",
      loginDescription: "登录以继续您的旅程",
      emailPlaceholder: "输入您的邮箱",
      passwordPlaceholder: "创建密码",
      loginPasswordPlaceholder: "输入密码",
      submitButton: "注册并领取礼物",
      loginButton: "登录",
      submitting: "处理中...",
      disclaimer: "注册即表示您同意我们的",
      masterDisclaimer: "总免责声明",
      and: "和",
      selfDecision: "自主决策原则",
      notice: "这是仅供娱乐和认知参与的技术演示。",
      welcomeTitle: "感谢您的加入！🎉",
      welcomeBody: "礼物已送达，请开启您的 AI 投资之旅。",
      startExploring: "前往 Mark6 游戏",
      switchToLogin: "已有账户？登录",
      switchToSignup: "没有账户？注册",
      alreadyClaimedTitle: "礼物已领取",
      alreadyClaimedBody: "您已领取过礼物。请继续使用。",
      continueBtn: "前往 Mark6 游戏",
    },
  };

  const t = content[language === "zh-TW" ? "tc" : language === "zh-CN" ? "sc" : "en"] || content.en;

  // Double-shield: Check if already claimed when dialog opens
  // IMPORTANT: Only show "Already Claimed" if user is ALSO authenticated
  // If not authenticated, switch to login mode so they can sign in
  useEffect(() => {
    if (open) {
      const checkClaimedStatus = async () => {
        // Check if user is authenticated first
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // User is authenticated - check if they claimed the gift
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_explorer_used")
            .eq("user_id", user.id)
            .maybeSingle();
          
          if (profile?.is_explorer_used) {
            localStorage.setItem("explorer_gift_claimed", "true");
            // Also fetch the claimed_at timestamp
            const { data: fullProfile } = await supabase
              .from("profiles")
              .select("explorer_claimed_at")
              .eq("user_id", user.id)
              .maybeSingle();
            if (fullProfile?.explorer_claimed_at) {
              localStorage.setItem("explorer_gift_claimed_at", fullProfile.explorer_claimed_at);
            }
            setShowAlreadyClaimed(true);
          }
        } else {
          // User is NOT authenticated
          // If localStorage says gift claimed, they need to LOG IN first
          const localClaimed = localStorage.getItem("explorer_gift_claimed");
          if (localClaimed === "true") {
            // Switch to login mode instead of showing "Already Claimed"
            // They need to authenticate to access their account
            setIsLoginMode(true);
          }
        }
      };
      checkClaimedStatus();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast({
        title: language === "zh-CN" ? "无效邮箱" : language === "zh-TW" ? "無效郵箱" : "Invalid Email",
        description: language === "zh-CN" ? "请输入有效的邮箱地址" : language === "zh-TW" ? "請輸入有效的郵箱地址" : "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    if (!password || password.length < 6) {
      toast({
        title: language === "zh-CN" ? "密码太短" : language === "zh-TW" ? "密碼太短" : "Password Too Short",
        description: language === "zh-CN" ? "密码至少需要6个字符" : language === "zh-TW" ? "密碼至少需要6個字符" : "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLoginMode) {
        // Login flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          let errorTitle = "Sign In Failed";
          let errorDesc = error.message;
          
          // Provide user-friendly error messages
          if (error.message.includes("Invalid login credentials")) {
            // Check if the email exists by attempting a password reset (lightweight check)
            errorTitle = language === "zh-CN" ? "账户未找到" : language === "zh-TW" ? "帳戶未找到" : "Account Not Found";
            errorDesc = language === "zh-CN" 
              ? "找不到此邮箱的账户。请先注册，或检查邮箱是否正确。" 
              : language === "zh-TW" 
                ? "找不到此郵箱的帳戶。請先註冊，或檢查郵箱是否正確。" 
                : "Account not found. Please sign up first, or check if your email is correct.";
          } else if (error.message.includes("Email not confirmed")) {
            errorTitle = language === "zh-CN" ? "邮箱未验证" : language === "zh-TW" ? "郵箱未驗證" : "Email Not Verified";
            errorDesc = language === "zh-CN" ? "请检查您的邮箱并点击验证链接" : language === "zh-TW" ? "請檢查您的郵箱並點擊驗證鏈接" : "Please check your email and click the verification link";
          } else if (error.message.includes("network") || error.message.includes("fetch")) {
            errorTitle = language === "zh-CN" ? "连接错误" : language === "zh-TW" ? "連接錯誤" : "Connection Error";
            errorDesc = language === "zh-CN" ? "请检查网络连接后重试" : language === "zh-TW" ? "請檢查網絡連接後重試" : "Please check your internet connection and try again";
          }
          
          toast({
            title: errorTitle,
            description: errorDesc,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        if (data.user) {
          // Check if user already claimed gift
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_explorer_used")
            .eq("user_id", data.user.id)
            .maybeSingle();
          
          if (profile?.is_explorer_used) {
            localStorage.setItem("explorer_gift_claimed", "true");
            // Also fetch and store the claimed_at timestamp if available
            const { data: fullProfile } = await supabase
              .from("profiles")
              .select("explorer_claimed_at")
              .eq("user_id", data.user.id)
              .maybeSingle();
            if (fullProfile?.explorer_claimed_at) {
              localStorage.setItem("explorer_gift_claimed_at", fullProfile.explorer_claimed_at);
            }
          }

          toast({
            title: language === "zh-CN" ? "登录成功" : language === "zh-TW" ? "登入成功" : "Welcome back!",
            description: language === "zh-CN" ? "正在加载您的账户..." : language === "zh-TW" ? "正在加載您的帳戶..." : "Loading your account...",
          });
          onOpenChange(false);
          // Check if there's a pending plan from pricing page
          const pendingPlan = localStorage.getItem("pending_plan_type");
          if (pendingPlan) {
            localStorage.removeItem("pending_plan_type");
            navigate("/pricing");
          } else {
            // Redirect to the specified page or Mark6 Game as default
            navigate(redirectTo || "/mark6-game");
          }
        }
      } else {
        // Signup flow - Double-shield check before signup
        const localClaimed = localStorage.getItem("explorer_gift_claimed");
        if (localClaimed === "true") {
          setShowAlreadyClaimed(true);
          setIsSubmitting(false);
          return;
        }

        // Capture UTM source for analytics tracking
        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get("utm_source") || urlParams.get("ref") || "direct";

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              referral_source: utmSource,
            },
          },
        });

        if (error) {
          // If user already exists, show already claimed or suggest login
          if (error.message.includes("already registered")) {
            toast({
              title: language === "zh-CN" ? "账户已存在" : "Account exists",
              description: language === "zh-CN" ? "请登录您的账户" : "Please sign in to your account",
            });
            setIsLoginMode(true);
            setIsSubmitting(false);
            return;
          }
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        if (data.user) {
          // Mark as claimed in localStorage with timestamp
          // NOTE: Profile is initialized by the handle_new_user trigger with:
          // - is_explorer_used = true
          // - explorer_claimed_at = now()
          // - credit_balance = 5
          // No client-side update needed - this prevents manipulation
          const claimedAt = new Date().toISOString();
          localStorage.setItem("explorer_gift_claimed", "true");
          localStorage.setItem("explorer_gift_claimed_at", claimedAt);
          
          setShowWelcome(true);
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueToHome = () => {
    onOpenChange(false);
    navigate(redirectTo || "/mark6-game");
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after dialog closes
    setTimeout(() => {
      setShowWelcome(false);
      setShowAlreadyClaimed(false);
      setIsLoginMode(false);
      setEmail("");
      setPassword("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border-border max-h-[90vh] overflow-y-auto pb-20">
        {showAlreadyClaimed ? (
          // Already Claimed State
          <div className="text-center py-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-[#F59E0B]/20 flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-[#F59E0B]" />
            </div>
            <DialogTitle className="font-display text-2xl mb-4 text-[#F59E0B]">
              {t.alreadyClaimedTitle}
            </DialogTitle>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t.alreadyClaimedBody}
            </p>
            <Button
              onClick={handleContinueToHome}
              className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:opacity-90 text-black font-semibold px-8"
            >
              {t.continueBtn}
            </Button>
          </div>
        ) : !showWelcome ? (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-dragon flex items-center justify-center mb-4">
                <Gift className="w-8 h-8 text-foreground" />
              </div>
              <DialogTitle className="font-display text-2xl text-center">
                {isLoginMode ? t.loginTitle : t.title}
              </DialogTitle>
              <DialogDescription className="text-center text-muted-foreground">
                {isLoginMode ? t.loginDescription : t.description}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-secondary border-border focus:border-gold"
                  required
                />
              </div>

              <div className="relative">
                <Input
                  type="password"
                  placeholder={isLoginMode ? t.loginPasswordPlaceholder : t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-secondary border-border focus:border-gold"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-dragon hover:opacity-90 text-foreground font-semibold"
              >
                {isSubmitting ? t.submitting : (isLoginMode ? t.loginButton : t.submitButton)}
              </Button>

              <button
                type="button"
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="w-full text-sm text-gold hover:underline"
              >
                {isLoginMode ? t.switchToSignup : t.switchToLogin}
              </button>

              {!isLoginMode && (
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
                  {t.disclaimer}{" "}
                  <a href="#" className="text-gold hover:underline">
                    {t.masterDisclaimer}
                  </a>{" "}
                  {t.and}{" "}
                  <a href="#" className="text-gold hover:underline">
                    {t.selfDecision}
                  </a>
                  . {t.notice}
                </p>
              )}
            </form>
          </>
        ) : (
          // Welcome/Success State - New Joiner
          <div className="text-center py-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-[#10B981] to-[#059669] flex items-center justify-center mb-6 animate-pulse">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <DialogTitle className="font-display text-2xl mb-4 text-[#10B981]">
              {t.welcomeTitle}
            </DialogTitle>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {t.welcomeBody}
            </p>
            <Button
              onClick={handleContinueToHome}
              className="bg-gradient-to-r from-[#10B981] to-[#059669] hover:opacity-90 text-white font-semibold px-8"
            >
              {t.startExploring}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SignUpDialog;
