import { useState, useEffect } from "react";
import { getBNBBalance, getUSDTBalance, getCurrentNetwork, BSC_MAINNET } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";

interface TokenBalances {
  bnb: string;
  usdt: string;
  isLoading: boolean;
  error: string | null;
}

export function useTokenBalances(walletAddress: string | null) {
  const [balances, setBalances] = useState<TokenBalances>({
    bnb: "0",
    usdt: "0",
    isLoading: false,
    error: null,
  });
  const { toast } = useToast();

  const fetchBalances = async () => {
    if (!walletAddress) {
      setBalances(prev => ({ ...prev, bnb: "0", usdt: "0", isLoading: false }));
      return;
    }

    setBalances(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check if user is on BSC network
      const currentNetwork = await getCurrentNetwork();
      if (currentNetwork !== BSC_MAINNET.chainId) {
        setBalances(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: "Please switch to BSC network to view real balances" 
        }));
        return;
      }

      // Fetch real balances from BSC blockchain
      const [bnbBalance, usdtBalance] = await Promise.all([
        getBNBBalance(walletAddress),
        getUSDTBalance(walletAddress),
      ]);

      setBalances({
        bnb: bnbBalance,
        usdt: usdtBalance,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching token balances:", error);
      setBalances(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to fetch balances. Please ensure you're connected to BSC network.",
      }));
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [walletAddress]);

  // Refresh balances every 30 seconds
  useEffect(() => {
    if (!walletAddress) return;

    const interval = setInterval(fetchBalances, 30000);
    return () => clearInterval(interval);
  }, [walletAddress]);

  return {
    ...balances,
    refreshBalances: fetchBalances,
  };
}