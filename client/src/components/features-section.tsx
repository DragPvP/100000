import { Card, CardContent } from "@/components/ui/card";
import { Shield, DollarSign, Zap, Calendar, Users, BarChart3 } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Multi-signature wallets and cold storage protection for your digital assets",
      color: "okx-green",
    },
    {
      icon: DollarSign,
      title: "Competitive Returns",
      description: "Industry-leading APY rates with transparent fee structures and no hidden costs",
      color: "okx-gold",
    },
    {
      icon: Zap,
      title: "Instant Liquidity",
      description: "Flexible staking terms with early unstaking options and quick withdrawals",
      color: "okx-green",
    },
    {
      icon: Calendar,
      title: "Daily Rewards",
      description: "Automatic daily reward distribution with real-time tracking and analytics",
      color: "okx-gold",
    },
    {
      icon: Users,
      title: "24/7 Support",
      description: "Round-the-clock customer support and dedicated account management",
      color: "okx-green",
    },
    {
      icon: BarChart3,
      title: "Transparent Reporting",
      description: "Detailed analytics, performance reports, and blockchain transaction tracking",
      color: "okx-gold",
    },
  ];

  return (
    <section className="py-16 bg-okx-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose CryptoStake Pro?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Industry-leading security, competitive rates, and professional-grade infrastructure for your crypto staking needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorClass = feature.color === "okx-green" ? "bg-okx-green/20 text-okx-green" : "bg-okx-gold/20 text-okx-gold";
            const borderClass = feature.color === "okx-green" ? "hover:border-okx-green/50" : "hover:border-okx-gold/50";
            
            return (
              <Card key={index} className={`bg-okx-dark border-gray-800 ${borderClass} transition-colors`}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
