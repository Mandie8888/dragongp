import Navbar from "@/components/Navbar";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

const Pricing = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0F172A]">
      <Navbar />
      <div className="flex-1 pt-14 overflow-hidden">
        <PricingSection />
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
