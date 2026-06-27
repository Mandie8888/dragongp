import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set - webhook verification required");
    logStep("Stripe keys verified");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Get the raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    // SECURITY: Always require signature verification
    if (!signature) {
      logStep("Missing stripe-signature header");
      return new Response(JSON.stringify({ error: "Missing signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      logStep("Webhook signature verified");
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err });
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    logStep("Event type", { type: event.type });

    // Initialize Supabase with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Checkout session completed", { 
        sessionId: session.id, 
        metadata: session.metadata,
        customerEmail: session.customer_email 
      });

      const planType = session.metadata?.planType;
      const creditsToAdd = parseInt(session.metadata?.credits || "0", 10);
      const userId = session.metadata?.userId;

      if (!planType || !creditsToAdd) {
        logStep("Missing metadata, skipping credit addition");
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      logStep("Adding credits", { planType, creditsToAdd, userId });

      // Find user by email if userId not provided
      let targetUserId = userId;
      if (!targetUserId && session.customer_email) {
        const { data: profiles } = await supabaseAdmin
          .from("profiles")
          .select("user_id")
          .eq("email", session.customer_email)
          .limit(1);
        
        if (profiles && profiles.length > 0) {
          targetUserId = profiles[0].user_id;
          logStep("Found user by email", { userId: targetUserId });
        }
      }

      if (!targetUserId) {
        logStep("No user found for credit addition");
        return new Response(JSON.stringify({ received: true, warning: "No user found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Add credits using database function
      const { data: result, error: creditError } = await supabaseAdmin.rpc("add_credits", {
        p_user_id: targetUserId,
        p_credits: creditsToAdd,
        p_plan_type: planType,
      });

      if (creditError) {
        logStep("Error adding credits", { error: creditError });
        throw new Error(`Failed to add credits: ${creditError.message}`);
      }

      logStep("Credits added successfully", { result });

      // Record payment
      const { error: paymentError } = await supabaseAdmin.from("payments").insert({
        user_id: targetUserId,
        amount: session.amount_total || 0,
        credits_added: creditsToAdd,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent as string,
        plan_type: planType,
        status: "completed",
      });

      if (paymentError) {
        logStep("Error recording payment", { error: paymentError });
      } else {
        logStep("Payment recorded successfully");
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
