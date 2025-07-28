import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";

export default function Header() {
  const { isConnected, account, connectWallet, isOnBSC, switchToBSC } = useWallet();
  const [bnbPrice, setBnbPrice] = useState("$0.00");
  const [priceChange, setPriceChange] = useState("0.00");

  // Fetch real BNB price from CoinGecko API
  useEffect(() => {
    const fetchBNBPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd&include_24hr_change=true');
        const data = await response.json();
        
        if (data.binancecoin) {
          const price = data.binancecoin.usd;
          const change = data.binancecoin.usd_24h_change;
          
          setBnbPrice(`$${price.toFixed(2)}`);
          setPriceChange(change.toFixed(2));
        }
      } catch (error) {
        console.error('Error fetching BNB price:', error);
        setBnbPrice("$--");
        setPriceChange("0.00");
      }
    };

    fetchBNBPrice();
    
    // Update price every 5 minutes
    const interval = setInterval(fetchBNBPrice, 300000);
    return () => clearInterval(interval);
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="bg-okx-dark border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-okx-green to-okx-gold rounded-full flex items-center justify-center">
                <span className="text-black font-semibold text-sm">CS</span>
              </div>
              <span className="text-xl font-medium">CryptoStake Pro</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#dashboard" className="text-gray-300 hover:text-okx-green transition-colors">Dashboard</a>
              <a href="#stake" className="text-gray-300 hover:text-okx-green transition-colors">Stake</a>
              <a href="#rewards" className="text-gray-300 hover:text-okx-green transition-colors">Rewards</a>
              <a href="#calculator" className="text-gray-300 hover:text-okx-green transition-colors">Calculator</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 bg-okx-darker px-4 py-2 rounded-lg">
              <img 
                src="/bnb-icon.png" 
                alt="BNB" 
                className="w-6 h-6 flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNGM0JBMkYiLz4KPHN2ZyB4PSI2IiB5PSI2IiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNTkuOTk5OSAyNy4zODI4TDQ3LjE5MTQgNDAuMTkxNEwzNC4zODI4IDI3LjM4MjhMMjEuNTc0MiA0MC4xOTE0TDM0LjM4MjggNTIuOTk5OUwyMS41NzQyIDY1LjgwODVMMzQuMzgyOCA3OC42MTcxTDQ3LjE5MTQgNjUuODA4NUw1OS45OTk5IDc4LjYxNzFMNzIuODA4NSA2NS44MDg1TDU5Ljk5OTkgNTIuOTk5OUw3Mi44MDg1IDQwLjE5MTRMNTB.OTk5OSAyNy4zODI4WiIgZmlsbD0iIzAwMDAiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                }}
              />
              <div className="flex flex-col items-start">
                <span className="text-sm font-normal leading-tight">{bnbPrice}</span>
                <span className={`text-xs leading-tight ${parseFloat(priceChange) >= 0 ? 'text-okx-green' : 'text-red-400'}`}>
                  {parseFloat(priceChange) >= 0 ? '+' : ''}{priceChange}%
                </span>
              </div>
            </div>
            {isConnected && !isOnBSC && (
              <Button
                onClick={switchToBSC}
                className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg mr-3 text-sm"
              >
                Switch to BSC
              </Button>
            )}
            <Button
              onClick={connectWallet}
              className={`font-medium px-6 py-2 rounded-lg transition-all duration-300 ${
                isConnected
                  ? "bg-okx-green text-black"
                  : "bg-gradient-to-r from-okx-green to-green-400 hover:from-green-400 hover:to-okx-green text-black animate-glow"
              }`}
            >
              {isConnected ? formatAddress(account!) : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
