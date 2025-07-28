declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function detectEthereumProvider(): Promise<any> {
  if (typeof window !== "undefined" && window.ethereum) {
    return window.ethereum;
  }
  return null;
}

export async function connectMetaMask(): Promise<string[]> {
  const provider = await detectEthereumProvider();
  if (!provider) {
    throw new Error("MetaMask is not installed");
  }

  try {
    // Request account access
    const accounts = await provider.request({
      method: "eth_requestAccounts",
    });
    
    return accounts;
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error("User rejected the request");
    }
    throw new Error("Failed to connect to MetaMask");
  }
}

export async function getConnectedAccounts(): Promise<string[]> {
  const provider = await detectEthereumProvider();
  if (!provider) {
    return [];
  }

  try {
    const accounts = await provider.request({
      method: "eth_accounts",
    });
    return accounts;
  } catch (error) {
    console.error("Error getting connected accounts:", error);
    return [];
  }
}

export async function switchToNetwork(chainId: string): Promise<void> {
  const provider = await detectEthereumProvider();
  if (!provider) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      throw new Error("Network not added to MetaMask");
    }
    throw error;
  }
}

// BSC Mainnet configuration
export const BSC_MAINNET = {
  chainId: "0x38", // 56 in decimal
  chainName: "BNB Smart Chain",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com/"],
};

export async function addBSCNetwork(): Promise<void> {
  const provider = await detectEthereumProvider();
  if (!provider) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [BSC_MAINNET],
    });
  } catch (error) {
    throw new Error("Failed to add BSC network");
  }
}

// Token contract addresses on BSC
export const TOKEN_CONTRACTS = {
  USDT: "0x55d398326f99059fF775485246999027B3197955", // USDT on BSC
  BNB: "0x0000000000000000000000000000000000000000", // Native BNB
};

// ERC-20 token ABI (minimal for balance checking)
export const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

export async function getBNBBalance(walletAddress: string): Promise<string> {
  const provider = await detectEthereumProvider();
  if (!provider) {
    throw new Error("MetaMask is not installed");
  }

  try {
    // Get BNB balance
    const balance = await provider.request({
      method: "eth_getBalance",
      params: [walletAddress, "latest"],
    });
    
    // Convert from wei to BNB (18 decimals)
    const balanceInBNB = parseInt(balance, 16) / Math.pow(10, 18);
    return balanceInBNB.toFixed(6);
  } catch (error) {
    console.error("Error fetching BNB balance:", error);
    return "0";
  }
}

export async function getUSDTBalance(walletAddress: string): Promise<string> {
  const provider = await detectEthereumProvider();
  if (!provider) {
    throw new Error("MetaMask is not installed");
  }

  try {
    // Create contract call data for balanceOf function
    const data = `0x70a08231000000000000000000000000${walletAddress.slice(2)}`;
    
    const balance = await provider.request({
      method: "eth_call",
      params: [
        {
          to: TOKEN_CONTRACTS.USDT,
          data: data,
        },
        "latest",
      ],
    });
    
    // Convert from wei to USDT (18 decimals for USDT on BSC)
    const balanceInUSDT = parseInt(balance, 16) / Math.pow(10, 18);
    return balanceInUSDT.toFixed(2);
  } catch (error) {
    console.error("Error fetching USDT balance:", error);
    return "0";
  }
}

export async function getCurrentNetwork(): Promise<string> {
  const provider = await detectEthereumProvider();
  if (!provider) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const chainId = await provider.request({ method: "eth_chainId" });
    return chainId;
  } catch (error) {
    console.error("Error getting current network:", error);
    return "0x1"; // Default to Ethereum mainnet
  }
}
