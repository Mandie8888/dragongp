import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeedbackMarquee from "@/components/TestimonialMarquee";
import Footer from "@/components/Footer";
import StockPickBox from "@/components/StockPickBox";
import ExplorerGiftBox from "@/components/ExplorerGiftBox";

import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isSubscriber, setIsSubscriber] = useState(false);

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
    <div className="min-h-screen lg:max-h-screen lg:h-screen bg-background overflow-hidden">
      <Navbar />
      <StockPickBox />
      <ExplorerGiftBox />
      
      <HeroSection isSubscriber={isSubscriber} />
      
      <FeedbackMarquee />
      
      <Footer />
    </div>
  );
};

export default Index;
