import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  credit_balance: number;
  total_reports_generated: number;
  tier: string;
  explorer_expires_at: string | null;
  is_explorer_used: boolean;
}

interface CanGenerateResult {
  can_generate: boolean;
  reason?: string;
  credits_remaining?: number;
}

export function useCredits() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOutOfCredits, setShowOutOfCredits] = useState(false);
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // ✅ Use 'id' to match the primary key
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Error in fetchProfile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  // ✅ Fixed: Use 'id' instead of 'user_id' in the filter
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel(`profile-changes-${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${profile.id}`,  // ✅ Changed from user_id to id
        },
        (payload) => {
          console.log("Profile updated:", payload.new);
          setProfile(payload.new as Profile);
          toast({
            title: "Credits Updated",
            description: `Your credit balance has been updated to ${(payload.new as Profile).credit_balance}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, toast]);

  const checkCanGenerate = useCallback(async (): Promise<CanGenerateResult> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { can_generate: false, reason: "not_authenticated" };
      }

      // ✅ Use the RPC function - make sure it exists in Supabase
      const { data, error } = await supabase.rpc("can_generate_report", {
        p_user_id: user.id,
      });

      if (error) {
        console.error("Error checking can generate:", error);
        return { can_generate: false, reason: "error" };
      }

      const result = data as unknown as CanGenerateResult;
      
      if (!result.can_generate) {
        setShowOutOfCredits(true);
      }

      return result;
    } catch (error) {
      console.error("Error in checkCanGenerate:", error);
      return { can_generate: false, reason: "error" };
    }
  }, []);

  const consumeCredit = useCallback(async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // ✅ Try a simpler approach - directly update the profile
      // First, get current balance
      const { data: profileData, error: fetchError } = await supabase
        .from("profiles")
        .select("credit_balance")
        .eq("id", user.id)
        .single();

      if (fetchError) {
        console.error("Error fetching balance:", fetchError);
        return false;
      }

      if (!profileData || profileData.credit_balance <= 0) {
        setShowOutOfCredits(true);
        return false;
      }

      // Deduct 1 credit
      const newBalance = profileData.credit_balance - 1;
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ credit_balance: newBalance })
        .eq("id", user.id);

      if (updateError) {
        console.error("Error updating credits:", updateError);
        return false;
      }

      // Refresh profile to get updated balance
      await fetchProfile();
      return true;

    } catch (error) {
      console.error("Error in consumeCredit:", error);
      return false;
    }
  }, [fetchProfile]);

  const handleCheckout = useCallback(async (planType: "coffee" | "pro" | "vip") => {
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { planType },
      });

      if (error) {
        console.error("Checkout error:", error);
        toast({
          title: "Error",
          description: "Failed to create checkout session. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error in handleCheckout:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    profile,
    loading,
    showOutOfCredits,
    setShowOutOfCredits,
    fetchProfile,
    checkCanGenerate,
    consumeCredit,
    handleCheckout,
    creditBalance: profile?.credit_balance ?? 0,
    totalReportsGenerated: profile?.total_reports_generated ?? 0,
    tier: profile?.tier ?? "explorer",
    isAuthenticated: !!profile,
  };
}