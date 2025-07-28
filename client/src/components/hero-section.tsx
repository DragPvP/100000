import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-20 bg-gradient-to-br from-black via-okx-darker to-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-okx-green/5 to-okx-gold/5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-semibold mb-6 bg-gradient-to-r from-okx-green via-green-400 to-okx-gold bg-clip-text text-transparent animate-float">
            Premium Crypto Staking
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Earn up to <span className="text-okx-gold font-semibold">20% APY</span> on USDT and <span className="text-okx-green font-semibold">15% APY</span> on BNB with our institutional-grade staking platform
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button 
              onClick={() => scrollToSection('staking-dashboard')}
              className="bg-gradient-to-r from-okx-green to-green-400 hover:from-green-400 hover:to-okx-green text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 border-2 border-okx-green"
            >
              Start Staking Now
            </Button>
            <Button 
              variant="outline"
              onClick={() => scrollToSection('calculator')}
              className="border-2 border-okx-gold text-okx-gold hover:bg-okx-gold hover:text-black font-semibold px-8 py-4 rounded-xl transition-all duration-300"
            >
              View Calculator
            </Button>
          </div>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="gradient-border">
            <div className="gradient-border-content text-center">
              <div className="flex items-center justify-center mb-3">
                <img 
                  src="/usdt-icon.png" 
                  alt="USDT" 
                  className="w-12 h-12"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiMyNkEzN0IiLz4KPHN2ZyB4PSIxMiIgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDMzOSAyOTUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xNjkuNSAwQzI2My40IDAgMzM5IDY2LjEgMzM5IDE0Ny41UzI2My40IDI5NSAxNjkuNSAyOTVTMCAyMjguOSAwIDE0Ny41UzY1LjYgMCAxNjkuNSAwWiIgZmlsbD0iIzUzQUU5NCIvPgo8cGF0aCBkPSJNMTg2LjggMTA5LjJIMjMwVjg5LjZIMTA5VjEwOS4ySDEzMi43VjE2Ni4zSDE1M1YxMDkuMkgxODYuOFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNjkuNSAxMjUuN0gxOTkuNVYxMzZIMTY5LjVWMTI1LjdaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+Cg==";
                  }}
                />
              </div>
              <h3 className="text-3xl font-semibold text-okx-gold mb-2">20% APY</h3>
              <p className="text-gray-400">USDT Staking</p>
            </div>
          </div>
          <div className="gradient-border">
            <div className="gradient-border-content text-center">
              <div className="flex items-center justify-center mb-3">
                <img 
                  src="/bnb-icon.png" 
                  alt="BNB" 
                  className="w-12 h-12"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjQiIGN5PSIyNCIgcj0iMjQiIGZpbGw9IiNGM0JBMkYiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMzYiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNTkuOTk5OSAyNy4zODI4TDQ3LjE5MTQgNDAuMTkxNEwzNC4zODI4IDI3LjM4MjhMMjEuNTc0MiA0MC4xOTE0TDM0LjM4MjggNTIuOTk5OUwyMS41NzQyIDY1LjgwODVMMzQuMzgyOCA3OC42MTcxTDQ3LjE5MTQgNjUuODA4NUw1OS45OTk5IDc4LjYxNzFMNzIuODA4NSA2NS44MDg1TDU5Ljk5OTkgNTIuOTk5OUw3Mi44MDg1IDQwLjE5MTRMNTB.OTk5OSAyNy4zODI4WiIgZmlsbD0iIzAwMDAiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                  }}
                />
              </div>
              <h3 className="text-3xl font-semibold text-okx-green mb-2">15% APY</h3>
              <p className="text-gray-400">BNB Staking</p>
            </div>
          </div>
          <div className="gradient-border">
            <div className="gradient-border-content text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-okx-green to-okx-gold rounded-full flex items-center justify-center mx-auto mb-3">
                <svg 
                  className="w-8 h-8 text-green-500" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        fill="none"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold text-white mb-2">$2.4M</h3>
              <p className="text-gray-400">Total Value Locked</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
