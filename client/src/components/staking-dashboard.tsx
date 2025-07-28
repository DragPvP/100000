import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/use-wallet";
import { useTokenBalances } from "@/hooks/use-token-balances";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Lock, RefreshCw, AlertCircle } from "lucide-react";

interface UserStats {
  usdtBalance: string;
  bnbBalance: string;
  usdtStaked: string;
  bnbStaked: string;
  usdtRewards: string;
  bnbRewards: string;
  totalStakedValue: string;
  totalRewards: string;
  stakingDays: number;
}

interface Transaction {
  id: string;
  token: string;
  type: string;
  amount: string;
  createdAt: string;
  status: string;
}

export default function StakingDashboard() {
  const { isConnected, account, isOnBSC, switchToBSC } = useWallet();
  const { toast } = useToast();
  const [usdtAmount, setUsdtAmount] = useState("");
  const [bnbAmount, setBnbAmount] = useState("");
  
  // Get real token balances from blockchain
  const { bnb: realBnbBalance, usdt: realUsdtBalance, isLoading: balancesLoading, error: balanceError, refreshBalances } = useTokenBalances(account);
  
  // Animation state for refresh button
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: userStats } = useQuery<UserStats>({
    queryKey: ["/api/user/stats", account],
    enabled: isConnected && !!account,
  });

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ["/api/user/transactions", account],
    enabled: isConnected && !!account,
  });

  const stakeMutation = useMutation({
    mutationFn: async ({ token, amount }: { token: string; amount: string }) => {
      const response = await apiRequest("POST", "/api/stake", {
        token,
        amount,
        walletAddress: account,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Staking Successful",
        description: "Your tokens have been staked successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/transactions"] });
    },
    onError: (error) => {
      toast({
        title: "Staking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const unstakeMutation = useMutation({
    mutationFn: async ({ token, amount }: { token: string; amount: string }) => {
      const response = await apiRequest("POST", "/api/unstake", {
        token,
        amount,
        walletAddress: account,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Unstaking Successful",
        description: "Your tokens have been unstaked successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/transactions"] });
    },
    onError: (error) => {
      toast({
        title: "Unstaking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStake = (token: string, amount: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake.",
        variant: "destructive",
      });
      return;
    }

    // Check if user is on BSC network
    if (!isOnBSC) {
      toast({
        title: "Wrong Network",
        description: "Please switch to BSC network to stake.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has sufficient balance
    const availableBalance = token === "USDT" ? parseFloat(realUsdtBalance) : parseFloat(realBnbBalance);
    if (parseFloat(amount) > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${availableBalance.toFixed(4)} ${token} available.`,
        variant: "destructive",
      });
      return;
    }

    stakeMutation.mutate({ token, amount });
  };

  const handleRefreshBalances = async () => {
    setIsRefreshing(true);
    await refreshBalances();
    // Keep animation for a moment even after loading is done
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleUnstake = (token: string, amount: string) => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to unstake.",
        variant: "destructive",
      });
      return;
    }
    unstakeMutation.mutate({ token, amount });
  };

  if (!isConnected) {
    return (
      <section id="staking-dashboard" className="py-16 bg-okx-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-medium mb-4">Staking Dashboard</h2>
            <p className="text-gray-400">Manage your crypto positions and track earnings</p>
          </div>

          <div className="text-center py-16">
            <Card className="max-w-md mx-auto bg-okx-dark border-gray-800">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-okx-green to-okx-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-xl font-medium mb-4">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-6">Connect your MetaMask wallet to access staking features and view your portfolio</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="staking-dashboard" className="py-16 bg-okx-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold mb-4">Staking Dashboard</h2>
          <p className="text-gray-400">Manage your crypto positions and track earnings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* USDT Staking Card */}
          <Card className="bg-okx-dark border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/usdt-icon.png" 
                    alt="USDT" 
                    className="w-10 h-10"
                  />
                  <div>
                    <h3 className="text-xl font-medium">USDT Staking</h3>
                    <p className="text-gray-400">Tether USD</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-medium text-okx-gold">20% APY</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isOnBSC && (
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-500 text-sm">Switch to BSC network to see real balances</span>
                    <Button
                      onClick={switchToBSC}
                      size="sm"
                      className="ml-auto bg-yellow-600 hover:bg-yellow-500 text-black"
                    >
                      Switch
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Available Balance:</span>
                  <div className="flex items-center space-x-2">
                    {balancesLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                    ) : (
                      <Button
                        onClick={handleRefreshBalances}
                        size="sm"
                        variant="ghost"
                        className="p-1 h-auto group hover:scale-110 transition-all duration-200"
                      >
                        <RefreshCw className="w-4 h-4 text-gray-400 hover:text-okx-gold transition-all duration-300 group-hover:rotate-180 group-active:rotate-360" />
                      </Button>
                    )}
                    <span className="font-normal">
                      {isOnBSC ? realUsdtBalance : userStats?.usdtBalance || "0.00"} USDT
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Staked Amount:</span>
                  <span className="font-normal">{userStats?.usdtStaked || "0.00"} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pending Rewards:</span>
                  <span className="font-normal text-okx-gold">+{userStats?.usdtRewards || "0.00"} USDT</span>
                </div>
              </div>

              <div className="space-y-3">
                <Input
                  type="number"
                  placeholder="Amount to stake"
                  value={usdtAmount}
                  onChange={(e) => setUsdtAmount(e.target.value)}
                  className="bg-black border-gray-700 focus:border-okx-gold"
                />
                {balanceError && (
                  <div className="text-xs text-red-400 mb-2">
                    {balanceError}
                  </div>
                )}
                <div className="text-xs text-gray-500 mb-2">
                  Staked funds are tracked on BSC: 0xB361...36E5
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleStake("USDT", usdtAmount)}
                    disabled={stakeMutation.isPending}
                    className="flex-1 bg-okx-gold hover:bg-yellow-500 text-black font-semibold"
                  >
                    {stakeMutation.isPending ? "Staking..." : "Stake USDT"}
                  </Button>
                  <Button
                    onClick={() => handleUnstake("USDT", usdtAmount)}
                    disabled={unstakeMutation.isPending}
                    variant="outline"
                    className="flex-1 border-okx-gold text-okx-gold hover:bg-okx-gold hover:text-black"
                  >
                    {unstakeMutation.isPending ? "Unstaking..." : "Unstake"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BNB Staking Card */}
          <Card className="bg-okx-dark border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src="/bnb-icon.png" 
                    alt="BNB" 
                    className="w-10 h-10"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0JBMkYiLz4KPHN2ZyB4PSI1IiB5PSI1IiB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAxMjAgMTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNNTkuOTk5OSAyNy4zODI4TDQ3LjE5MTQgNDAuMTkxNEwzNC4zODI4IDI3LjM4MjhMMjEuNTc0MiA0MC4xOTE0TDM0LjM4MjggNTIuOTk5OUwyMS41NzQyIDY1LjgwODVMMzQuMzgyOCA3OC42MTcxTDQ3LjE5MTQgNjUuODA4NUw1OS45OTk5IDc4LjYxNzFMNzIuODA4NSA2NS44MDg1TDU5Ljk5OTkgNTIuOTk5OUw3Mi44MDg1IDQwLjE5MTRMNTB.OTk5OSAyNy4zODI4WiIgZmlsbD0iIzAwMDAiLz4KPC9zdmc+Cjwvc3ZnPgo=";
                    }}
                  />
                  <div>
                    <h3 className="text-xl font-medium">BNB Staking</h3>
                    <p className="text-gray-400">Binance Coin</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-medium text-okx-green">15% APY</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isOnBSC && (
                <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-500 text-sm">Switch to BSC network to see real balances</span>
                    <Button
                      onClick={switchToBSC}
                      size="sm"
                      className="ml-auto bg-yellow-600 hover:bg-yellow-500 text-black"
                    >
                      Switch
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Available Balance:</span>
                  <div className="flex items-center space-x-2">
                    {balancesLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                    ) : (
                      <Button
                        onClick={handleRefreshBalances}
                        size="sm"
                        variant="ghost"
                        className="p-1 h-auto group hover:scale-110 transition-all duration-200"
                      >
                        <RefreshCw className="w-4 h-4 text-gray-400 hover:text-okx-green transition-all duration-300 group-hover:rotate-180 group-active:rotate-360" />
                      </Button>
                    )}
                    <span className="font-normal">
                      {isOnBSC ? realBnbBalance : userStats?.bnbBalance || "0.00"} BNB
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Staked Amount:</span>
                  <span className="font-normal">{userStats?.bnbStaked || "0.00"} BNB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pending Rewards:</span>
                  <span className="font-normal text-okx-green">+{userStats?.bnbRewards || "0.00"} BNB</span>
                </div>
              </div>

              <div className="space-y-3">
                <Input
                  type="number"
                  placeholder="Amount to stake"
                  value={bnbAmount}
                  onChange={(e) => setBnbAmount(e.target.value)}
                  className="bg-black border-gray-700 focus:border-okx-green"
                />
                {balanceError && (
                  <div className="text-xs text-red-400 mb-2">
                    {balanceError}
                  </div>
                )}
                <div className="text-xs text-gray-500 mb-2">
                  Staked funds are tracked on BSC: 0xB361...36E5
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleStake("BNB", bnbAmount)}
                    disabled={stakeMutation.isPending}
                    className="flex-1 bg-okx-green hover:bg-green-400 text-black font-semibold"
                  >
                    {stakeMutation.isPending ? "Staking..." : "Stake BNB"}
                  </Button>
                  <Button
                    onClick={() => handleUnstake("BNB", bnbAmount)}
                    disabled={unstakeMutation.isPending}
                    variant="outline"
                    className="flex-1 border-okx-green text-okx-green hover:bg-okx-green hover:text-black"
                  >
                    {unstakeMutation.isPending ? "Unstaking..." : "Unstake"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Overview */}
        <Card className="bg-okx-dark border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-okx-darker rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-okx-gold text-xl font-bold">$</span>
                </div>
                <p className="text-gray-400 mb-2">Total Staked Value</p>
                <p className="text-2xl font-semibold">${userStats?.totalStakedValue || "0.00"}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-okx-darker rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-okx-green text-xl font-bold">+</span>
                </div>
                <p className="text-gray-400 mb-2">Total Rewards Earned</p>
                <p className="text-2xl font-semibold text-okx-green">${userStats?.totalRewards || "0.00"}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-okx-darker rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-okx-gold text-xl font-bold">%</span>
                </div>
                <p className="text-gray-400 mb-2">Average APY</p>
                <p className="text-2xl font-semibold text-okx-gold">14%</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-okx-darker rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl font-bold">#</span>
                </div>
                <p className="text-gray-400 mb-2">Days Staking</p>
                <p className="text-2xl font-semibold">{userStats?.stakingDays || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="bg-okx-dark border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 text-gray-400">Token</th>
                    <th className="text-left py-3 text-gray-400">Action</th>
                    <th className="text-left py-3 text-gray-400">Amount</th>
                    <th className="text-left py-3 text-gray-400">Date</th>
                    <th className="text-left py-3 text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {transactions && transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-800">
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <img 
                              src={tx.token === "USDT" ? "/usdt-icon.png" : "/bnb-icon.png"}
                              alt={tx.token}
                              className="w-6 h-6"
                            />
                            <span>{tx.token}</span>
                          </div>
                        </td>
                        <td className="py-4 capitalize">{tx.type}</td>
                        <td className="py-4">{tx.amount}</td>
                        <td className="py-4">{new Date(tx.createdAt).toLocaleDateString()}</td>
                        <td className="py-4">
                          <span className="bg-okx-green/20 text-okx-green px-2 py-1 rounded text-xs capitalize">
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        No transactions found. Start staking to see your transaction history.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
