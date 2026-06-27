import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number;
}

// SECURITY: HTML escape function to prevent XSS in email clients
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Require authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: authError } = await authClient.auth.getClaims(token);
    if (authError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const verifiedEmail = (claimsData.claims.email as string | undefined)?.toLowerCase();
    if (!verifiedEmail) {
      return new Response(
        JSON.stringify({ error: "Authenticated user has no email" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { name, subject, message, rating } = body as ContactEmailRequest;

    // SECURITY: Server-side input validation
    if (!name || typeof name !== 'string' || name.trim().length < 1 || name.length > 100) {
      return new Response(
        JSON.stringify({ error: "Name must be 1-100 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 1 || subject.length > 200) {
      return new Response(
        JSON.stringify({ error: "Subject must be 1-200 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 1 || message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Message must be 1-2000 characters" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return new Response(
        JSON.stringify({ error: "Rating must be integer 1-5" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize inputs (trim whitespace). Use the JWT-verified email — never trust the body.
    const sanitizedName = name.trim();
    const sanitizedEmail = verifiedEmail;
    const sanitizedSubject = subject.trim();
    const sanitizedMessage = message.trim();

    console.log("Received contact form submission:", { name: sanitizedName, email: sanitizedEmail, subject: sanitizedSubject, rating });

    // Service-role client for writing testimonial (auth already verified above)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Auto-approve 4-5 star ratings for display
    const isHighRating = rating >= 4;
    
    // Save to testimonials table
    const { error: dbError } = await supabase
      .from("testimonials")
      .insert({
        name: sanitizedName,
        email: sanitizedEmail,
        subject: sanitizedSubject,
        message: sanitizedMessage,
        rating,
        is_approved: isHighRating,
        is_featured: false,
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Failed to save testimonial: ${dbError.message}`);
    }

    console.log("Testimonial saved to database");

    // Generate star rating display
    const starRating = "★".repeat(rating) + "☆".repeat(5 - rating);

    // SECURITY: HTML-escape all user inputs before embedding in emails
    const safeName = escapeHtml(sanitizedName);
    const safeEmail = escapeHtml(sanitizedEmail);
    const safeSubject = escapeHtml(sanitizedSubject);
    const safeMessage = escapeHtml(sanitizedMessage);

    // Send notification email to business
    const emailResponse = await resend.emails.send({
      from: "Dragon G Pai <onboarding@resend.dev>",
      to: ["dragongpai@gmail.com"],
      subject: `New Contact Form: ${safeSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #c41e3a;">New Contact Form Submission</h1>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <p><strong>Rating:</strong> <span style="color: #fbbf24; font-size: 18px;">${starRating}</span> (${rating}/5)</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${safeMessage}</p>
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This submission has been saved to your testimonials database. 
            You can approve it to feature on your homepage.
          </p>
        </div>
      `,
    });

    console.log("Business notification sent:", emailResponse);

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "Dragon G Pai <onboarding@resend.dev>",
      to: [sanitizedEmail],
      subject: "Thank you for contacting Dragon G Pai!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #c41e3a;">Thank You, ${safeName}!</h1>
          
          <p>We have received your message and appreciate you taking the time to reach out.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <p><strong>Your Rating:</strong> <span style="color: #fbbf24; font-size: 18px;">${starRating}</span></p>
          </div>
          
          <p>Our team will review your message and get back to you as soon as possible.</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>Dragon G Pai Team</strong>
          </p>
        </div>
      `,
    });

    console.log("User confirmation sent:", userEmailResponse);

    return new Response(JSON.stringify({ success: true, userEmailSent: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
