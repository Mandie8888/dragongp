import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // SECURITY: Require authentication. Only an authenticated user can request
    // a promo email — and they can ONLY send it to their own verified email
    // address (taken from the JWT, never from the request body).
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: authError } = await authClient.auth.getClaims(token);
    if (authError || !claimsData?.claims?.email) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const verifiedEmail = (claimsData.claims.email as string).toLowerCase();

    const { name } = await req.json().catch(() => ({ name: undefined }));
    const email = verifiedEmail; // never trust caller-supplied recipient

    if (typeof name !== "undefined" && (typeof name !== "string" || name.length > 100)) {
      return new Response(JSON.stringify({ error: "Invalid name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const displayName = name || "Explorer";

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 12px; overflow: hidden; }
    .header { text-align: center; padding: 32px 24px 16px; background: linear-gradient(90deg, #B8860B 0%, #FFD700 50%, #B8860B 100%); }
    .header h1 { margin: 0; color: #1a1a1a; font-size: 22px; font-weight: 800; }
    .body-content { padding: 32px 24px; color: #E0E0E0; }
    .body-content h2 { color: #FFD700; font-size: 18px; margin-top: 24px; }
    .body-content p { line-height: 1.7; font-size: 15px; }
    .body-content ul { padding-left: 20px; }
    .body-content li { margin-bottom: 8px; line-height: 1.6; }
    .cta-button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #FF4444 0%, #FFD700 100%); color: #fff; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; margin: 24px 0; box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3); }
    .footer { text-align: center; padding: 24px; color: #666; font-size: 12px; border-top: 1px solid rgba(255, 215, 0, 0.1); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🧧 DragonGP Lunar Valentine's: Your 10-Day Free AI Pass!</h1>
    </div>
    <div class="body-content">
      <p>Dear ${displayName},</p>
      <p>To celebrate the <strong>Lunar New Year</strong> and <strong>Valentine's Day</strong>, we are opening the "Mental Gym" for everyone!</p>
      <p>For the next 10 days, you have <strong>Full Access</strong> to our new AI Probability Reports. We have credited your account with <strong>10 Free Analysis Credits</strong>.</p>
      
      <h2>🐉 What's New?</h2>
      <ul>
        <li><strong>Meet the 5 AI Partners</strong> — each with different mathematical probability modules.</li>
        <li><strong>AI Stocks & Games</strong> — Explore mathematical simulations for your favorite indices and Mark 6.</li>
        <li><strong>Member Dashboard</strong> — Track your history and watchlist with our new prestige terminal.</li>
      </ul>
      
      <div style="text-align: center;">
        <a href="https://dragonmind-rewire.lovable.app/dashboard" class="cta-button">
          🎁 Claim My 10 Free Credits
        </a>
      </div>
      
      <p style="font-size: 13px; color: #999; margin-top: 24px;">
        Happy exploring, and may the probabilities be in your favor!<br>
        <strong>The DragonGP Team</strong><br>
        dragonpgai@gmail.com
      </p>
    </div>
    <div class="footer">
      <p>© 2026 DragonGP AI. This is a promotional email for the Lunar Valentine's Free Trial.</p>
      <p>You're receiving this because you have a DragonGP account.</p>
    </div>
  </div>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "DragonGP AI <onboarding@resend.dev>",
        to: [email],
        subject: "🐉 DragonGP Lunar Valentine's: Your 10-Day Free AI Pass!",
        html: htmlBody,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify({ error: "Failed to send email", details: result }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: result.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
