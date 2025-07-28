import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function StakingCalculator() {
  const [token, setToken] = useState("usdt");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("30");
  const [results, setResults] = useState({
    initialStake: "0.00",
    totalRewards: "0.00",
    finalAmount: "0.00",
  });

  const calculateRewards = () => {
    const stakeAmount = parseFloat(amount) || 0;
    const stakingPeriod = parseInt(period) || 30;
    const apy = token === "usdt" ? 0.20 : 0.15;
    
    const dailyRate = apy / 365;
    const totalRewards = stakeAmount * dailyRate * stakingPeriod;
    const finalAmount = stakeAmount + totalRewards;

    setResults({
      initialStake: stakeAmount.toFixed(2),
      totalRewards: totalRewards.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
    });
  };

  useEffect(() => {
    calculateRewards();
  }, [token, amount, period]);

  return (
    <section id="calculator" className="py-16 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Staking Calculator</h2>
          <p className="text-gray-400">Calculate your potential earnings and plan your staking strategy</p>
        </div>

        <Card className="bg-okx-dark border-gray-800">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Select Token</label>
                  <Select value={token} onValueChange={setToken}>
                    <SelectTrigger className="w-full bg-black border-gray-700 focus:border-okx-green">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usdt">
                        <div className="flex items-center space-x-2">
                          <img 
                            src="/usdt-icon.png" 
                            alt="USDT" 
                            className="w-4 h-4"
                          />
                          <span>USDT - 20% APY</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="bnb">
                        <div className="flex items-center space-x-2">
                          <img 
                            src="/bnb-icon.png" 
                            alt="BNB" 
                            className="w-4 h-4"
                            onError={(e) => {
                              e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjgiIGZpbGw9IiNGM0JBMkYiLz4KPHN2ZyB4PSIyIiB5PSIyIiB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNTkuOTk5OSAyNy4zODI4TDQ3LjE5MTQgNDAuMTkxNEwzNC4zODI4IDI3LjM4MjhMMjEuNTc0MiA0MC4xOTE0TDM0LjM4MjggNTIuOTk5OUwyMS41NzQyIDY1LjgwODVMMzQuMzgyOCA3OC42MTcxTDQ3LjE5MTQgNjUuODA4NUw1OS45OTk5IDc4LjYxNzFMNzIuODA4NSA2NS44MDg1TDU5Ljk5OTkgNTIuOTk5OUw3Mi44MDg1IDQwLjE5MTRMNTF.OTk5OSAyNy4zODI4WiIgZmlsbD0iIzAwMDAiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                            }}
                          />
                          <span>BNB - 15% APY</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Stake Amount</label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-black border-gray-700 focus:border-okx-green"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Staking Period</label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-full bg-black border-gray-700 focus:border-okx-green">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="180">180 Days</SelectItem>
                      <SelectItem value="365">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-6">
                <Card className="bg-black border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Estimated Earnings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Initial Stake:</span>
                      <span className="font-semibold">${results.initialStake}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Rewards:</span>
                      <span className="font-semibold text-okx-green">${results.totalRewards}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Final Amount:</span>
                      <span className="font-bold text-xl text-okx-gold">${results.finalAmount}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Button
                  onClick={calculateRewards}
                  className="w-full bg-gradient-to-r from-okx-green to-green-400 hover:from-green-400 hover:to-okx-green text-black font-semibold py-3 transition-all duration-300"
                >
                  Calculate Returns
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
