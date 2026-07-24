// src/pages/Register.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Chrome } from "lucide-react";

const content = {
  en: {
    title: "Create Account",
    subtitle: "Start your journey with DragonGP AI",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    signUp: "Sign Up",
    signIn: "Sign In",
    hasAccount: "Already have an account?",
    or: "or",
    continueWithGoogle: "Continue with Google",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Create a password",
    confirmPlaceholder: "Confirm your password",
    error: "Passwords do not match or invalid email.",
  },
  "zh-TW": {
    title: "創建帳號",
    subtitle: "開始您的 DragonGP AI 之旅",
    email: "電子郵件",
    password: "密碼",
    confirmPassword: "確認密碼",
    signUp: "註冊",
    signIn: "登入",
    hasAccount: "已經有帳號？",
    or: "或",
    continueWithGoogle: "使用 Google 繼續",
    emailPlaceholder: "輸入您的電子郵件",
    passwordPlaceholder: "創建密碼",
    confirmPlaceholder: "確認您的密碼",
    error: "密碼不匹配或電子郵件無效。",
  },
  "zh-CN": {
    title: "创建账号",
    subtitle: "开始您的 DragonGP AI 之旅",
    email: "电子邮件",
    password: "密码",
    confirmPassword: "确认密码",
    signUp: "注册",
    signIn: "登录",
    hasAccount: "已经有账号？",
    or: "或",
    continueWithGoogle: "使用 Google 继续",
    emailPlaceholder: "输入您的电子邮件",
    passwordPlaceholder: "创建密码",
    confirmPlaceholder: "确认您的密码",
    error: "密码不匹配或电子邮件无效。",
  },
};

export default function Register() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content] || content.en;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        // Show success message or redirect
        navigate("/login", { state: { message: "Please check your email to confirm your account." } });
      }
    } catch (err: any) {
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const siteUrl = import.meta.env.DEV 
        ? 'http://localhost:8080' 
        : window.location.origin;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gold-50/20 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">{t.title}</CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.confirmPassword}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t.confirmPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-white"
                />
              </div>
              {error && (
                <div className="text-sm text-red-500 text-center">{error}</div>
              )}
              <Button
                type="submit"
                className="w-full bg-gold-500 hover:bg-gold-600 text-navy font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  t.signUp
                )}
              </Button>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">{t.or}</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleLogin}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-gray-300"
          >
            <Chrome className="h-5 w-5 text-[#4285F4]" />
            <span className="font-medium text-gray-700">{t.continueWithGoogle}</span>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">
          <span>{t.hasAccount}</span>
          <Link to="/login" className="ml-1 text-gold-600 hover:text-gold-700 font-medium">
            {t.signIn}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}