-- Create profiles table with credit system
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  credit_balance INTEGER NOT NULL DEFAULT 0,
  total_reports_generated INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'explorer',
  explorer_expires_at TIMESTAMP WITH TIME ZONE,
  is_explorer_used BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create payments table to track purchases
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  plan_type TEXT NOT NULL,
  amount INTEGER NOT NULL,
  credits_added INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Users can view their own payments" 
ON public.payments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation with explorer credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, credit_balance, tier, explorer_expires_at, is_explorer_used)
  VALUES (
    NEW.id, 
    NEW.email, 
    5, -- Explorer gift: 5 free credits
    'explorer',
    now() + INTERVAL '48 hours',
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Create function to check if user can generate report (5-report hard cap for explorer)
CREATE OR REPLACE FUNCTION public.can_generate_report(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_profile RECORD;
  v_result JSONB;
BEGIN
  SELECT * INTO v_profile FROM public.profiles WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('can_generate', false, 'reason', 'no_profile');
  END IF;
  
  -- Check if explorer tier and hit 5-report limit
  IF v_profile.tier = 'explorer' AND v_profile.total_reports_generated >= 5 THEN
    RETURN jsonb_build_object('can_generate', false, 'reason', 'explorer_limit_reached');
  END IF;
  
  -- Check if explorer tier and expired
  IF v_profile.tier = 'explorer' AND v_profile.explorer_expires_at IS NOT NULL AND v_profile.explorer_expires_at < now() THEN
    RETURN jsonb_build_object('can_generate', false, 'reason', 'explorer_expired');
  END IF;
  
  -- Check credit balance
  IF v_profile.credit_balance <= 0 THEN
    RETURN jsonb_build_object('can_generate', false, 'reason', 'no_credits');
  END IF;
  
  RETURN jsonb_build_object('can_generate', true, 'credits_remaining', v_profile.credit_balance);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to consume a credit and increment report count
CREATE OR REPLACE FUNCTION public.consume_credit(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_can_generate JSONB;
  v_new_balance INTEGER;
BEGIN
  -- First check if user can generate
  v_can_generate := public.can_generate_report(p_user_id);
  
  IF NOT (v_can_generate->>'can_generate')::boolean THEN
    RETURN v_can_generate;
  END IF;
  
  -- Consume credit and increment report count
  UPDATE public.profiles 
  SET 
    credit_balance = credit_balance - 1,
    total_reports_generated = total_reports_generated + 1,
    updated_at = now()
  WHERE user_id = p_user_id
  RETURNING credit_balance INTO v_new_balance;
  
  RETURN jsonb_build_object('success', true, 'credits_remaining', v_new_balance);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to add credits after payment
CREATE OR REPLACE FUNCTION public.add_credits(p_user_id UUID, p_credits INTEGER, p_plan_type TEXT)
RETURNS JSONB AS $$
DECLARE
  v_new_balance INTEGER;
  v_new_tier TEXT;
BEGIN
  -- Determine new tier based on plan
  v_new_tier := CASE 
    WHEN p_plan_type = 'vip' THEN 'vip'
    WHEN p_plan_type = 'pro' THEN 'pro'
    ELSE 'coffee'
  END;
  
  UPDATE public.profiles 
  SET 
    credit_balance = credit_balance + p_credits,
    tier = CASE 
      WHEN v_new_tier IN ('vip', 'pro') THEN v_new_tier 
      ELSE tier 
    END,
    updated_at = now()
  WHERE user_id = p_user_id
  RETURNING credit_balance INTO v_new_balance;
  
  RETURN jsonb_build_object('success', true, 'new_balance', v_new_balance);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;