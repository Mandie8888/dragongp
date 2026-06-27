import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import dragonLogo from '@/assets/dragon-logo.png';
import { useLanguage } from '@/contexts/LanguageContext';

const registerTranslations = {
  en: {
    title: 'Create Account',
    subtitle: 'Start your AI stock analysis journey',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    password: 'Password',
    passwordPlaceholder: 'Min 6 characters',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter password',
    termsAgree: 'I agree to the Terms',
    createAccount: 'Create Account',
    creatingAccount: 'Creating account...',
    or: 'or',
    googleSignUp: 'Google',
    hasAccount: 'Already have an account?',
    signIn: 'Sign In',
    registerError: 'Registration failed',
    registerSuccess: 'Account created!',
    checkEmail: 'Please check your email to verify',
    registrationComplete: 'Registration Complete',
  },
  'zh-TW': {
    title: '創建帳戶',
    subtitle: '開始您的 AI 股票分析之旅',
    email: '電郵',
    emailPlaceholder: 'your@email.com',
    password: '密碼',
    passwordPlaceholder: '至少6個字符',
    confirmPassword: '確認密碼',
    confirmPasswordPlaceholder: '再次輸入密碼',
    termsAgree: '我同意服務條款',
    createAccount: '創建帳戶',
    creatingAccount: '創建帳戶中...',
    or: '或',
    googleSignUp: 'Google',
    hasAccount: '已有帳戶？',
    signIn: '立即登入',
    registerError: '註冊失敗',
    registerSuccess: '帳戶創建成功！',
    checkEmail: '請檢查您的電郵以驗證帳戶',
    registrationComplete: '註冊完成',
  },
  'zh-CN': {
    title: '创建账户',
    subtitle: '开始您的 AI 股票分析之旅',
    email: '邮箱',
    emailPlaceholder: 'your@email.com',
    password: '密码',
    passwordPlaceholder: '至少6个字符',
    confirmPassword: '确认密码',
    confirmPasswordPlaceholder: '再次输入密码',
    termsAgree: '我同意服务条款',
    createAccount: '创建账户',
    creatingAccount: '创建账户中...',
    or: '或',
    googleSignUp: 'Google',
    hasAccount: '已有账户？',
    signIn: '立即登录',
    registerError: '注册失败',
    registerSuccess: '账户创建成功！',
    checkEmail: '请检查您的邮箱以验证账户',
    registrationComplete: '注册完成',
  },
};

export default function Register() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = registerTranslations[language] || registerTranslations.en;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      setRegistrationComplete(true);
      toast({ title: t.registerSuccess, description: t.checkEmail, duration: 3000 });
      setTimeout(() => navigate('/login'), 2500);

    } catch (error: any) {
      setError(t.registerError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) {
        toast({ title: 'Google Failed', description: error.message, variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ title: 'Google Failed', description: error.message, variant: 'destructive' });
    }
  };

  if (registrationComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gold-50/20 to-slate-100 p-4">
        <Card className="w-full max-w-sm shadow-lg text-center">
          <CardHeader>
            <div className="flex justify-center mb-2">
              <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <CardTitle className="text-xl">{t.registrationComplete}</CardTitle>
            <CardDescription className="text-sm">{t.checkEmail}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/login')}>
              {t.signIn}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gold-50/20 to-slate-100 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="flex justify-center mb-2">
            <img src={dragonLogo} alt="DragonGP" className="h-12 w-auto" />
          </div>
          <CardTitle className="text-xl font-bold text-gradient-gold">{t.title}</CardTitle>
          <CardDescription className="text-sm">{t.subtitle}</CardDescription>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-3 pb-3">
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">{t.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">{t.password}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="h-9 pr-8 text-sm"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-sm">{t.confirmPassword}</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder={t.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-9 text-sm"
              />
            </div>

            <div className="flex items-start space-x-2 pt-1">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                className="h-4 w-4 mt-0.5"
              />
              <Label htmlFor="terms" className="text-xs cursor-pointer">
                {t.termsAgree}
              </Label>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2 pt-0">
            <Button type="submit" className="w-full h-9 text-sm" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.creatingAccount}
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t.createAccount}
                </>
              )}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">{t.or}</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-9 text-sm"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {t.googleSignUp}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              {t.hasAccount}{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                {t.signIn}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}