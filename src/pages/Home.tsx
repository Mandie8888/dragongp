import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeedbackMarquee from "@/components/TestimonialMarquee";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const [isSubscriber, setIsSubscriber] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we should open dashboard
    if (location.state?.openDashboard) {
      localStorage.setItem('openDashboard', 'true');
      window.dispatchEvent(new Event('storage'));
    }
  }, [location]);

  // ❌ REMOVED: Mobile redirect - was causing issues

  useEffect(() => {
    const checkSubscriberStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("tier")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (profile?.tier && profile.tier !== "explorer") {
          setIsSubscriber(true);
        }
      }
    };
    checkSubscriberStatus();
  }, []);

  // Handle body overflow for desktop single-page feel
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="min-h-screen lg:max-h-screen lg:h-screen bg-background flex flex-col">
      <div className="flex-1 overflow-hidden">
        <Navbar />
        <HeroSection isSubscriber={isSubscriber} />
        <FeedbackMarquee />
        <Footer />
      </div>
    </div>
  );
};

export default Home;