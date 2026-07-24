// src/pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Mail, Lock, Chrome } from "lucide-react";

const content = {
  en: {
    title: "Welcome Back",
    subtitle: "Sign in to continue your journey",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signUp: "Sign Up",
    noAccount: "Don't have an account?",
    or: "or",
    continueWithGoogle: "Continue with Google",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    error: "Invalid email or password. Please try again.",
  },
  "zh-TW": {
    title: "歡迎回來",
    subtitle: "登入以繼續您的旅程",
    email: "電子郵件",
    password: "密碼",
    signIn: "登入",
    signUp: "註冊",
    noAccount: "還沒有帳號？",
    or: "或",
    continueWithGoogle: "使用 Google 繼續",
    emailPlaceholder: "輸入您的電子郵件",
    passwordPlaceholder: "輸入您的密碼",
    error: "電子郵件或密碼無效。請重試。",
  },
  "zh-CN": {
    title: "欢迎回来",
    subtitle: "登录以继续您的旅程",
    email: "电子邮件",
    password: "密码",
    signIn: "登录",
    signUp: "注册",
    noAccount: "还没有账号？",
    or: "或",
    continueWithGoogle: "使用 Google 继续",
    emailPlaceholder: "输入您的电子邮件",
    passwordPlaceholder: "输入您的密码",
    error: "电子邮件或密码无效。请重试。",
  },
};

export default function Login() {
  const { language } = useLanguage();
  const t = content[language as keyof typeof content] || content.en;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Get the current site URL for redirect
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
          <form onSubmit={handleEmailLogin}>
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
                    Signing in...
                  </>
                ) : (
                  t.signIn
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
          <span>{t.noAccount}</span>
          <Link to="/register" className="ml-1 text-gold-600 hover:text-gold-700 font-medium">
            {t.signUp}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}