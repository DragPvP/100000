import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import StakingDashboard from "@/components/staking-dashboard";
import StakingCalculator from "@/components/staking-calculator";
import FeaturesSection from "@/components/features-section";
import Footer from "@/components/footer";
import WalletConnectModal from "@/components/wallet-connect-modal";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header />
      <HeroSection />
      <StakingDashboard />
      <StakingCalculator />
      <FeaturesSection />
      <Footer />
      <WalletConnectModal />
    </div>
  );
}
