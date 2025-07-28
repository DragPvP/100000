import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { detectEthereumProvider, connectMetaMask as connectMetaMaskWallet, getCurrentNetwork, BSC_MAINNET, addBSCNetwork } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";

interface WalletContextType {
  isConnected: boolean;
  account: string | null;
  isModalOpen: boolean;
  connectWallet: () => void;
  disconnectWallet: () => void;
  connectMetaMask: () => void;
  connectWalletConnect: () => void;
  openModal: () => void;
  closeModal: () => void;
  switchToBSC: () => Promise<void>;
  isOnBSC: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnBSC, setIsOnBSC] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if wallet was previously connected
    const savedAccount = localStorage.getItem("connectedAccount");
    if (savedAccount) {
      setAccount(savedAccount);
      setIsConnected(true);
    }

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
        setIsConnected(true);
        localStorage.setItem("connectedAccount", accounts[0]);
      }
    };

    // Check if MetaMask is available
    detectEthereumProvider().then((provider) => {
      if (provider) {
        provider.on("accountsChanged", handleAccountsChanged);
      }
    });
  }, []);

  const connectWallet = () => {
    setIsModalOpen(true);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAccount(null);
    localStorage.removeItem("connectedAccount");
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected successfully.",
    });
  };

  const connectMetaMask = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (!provider) {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to continue.",
          variant: "destructive",
        });
        return;
      }

      const accounts = await connectMetaMaskWallet();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        localStorage.setItem("connectedAccount", accounts[0]);
        setIsModalOpen(false);
        toast({
          title: "Wallet Connected",
          description: "Your MetaMask wallet has been connected successfully!",
        });
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask. Please try again.",
        variant: "destructive",
      });
    }
  };

  const connectWalletConnect = () => {
    toast({
      title: "Coming Soon",
      description: "WalletConnect integration is coming soon!",
    });
  };

  const switchToBSC = async () => {
    try {
      const provider = await detectEthereumProvider();
      if (!provider) {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to switch networks.",
          variant: "destructive",
        });
        return;
      }

      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: BSC_MAINNET.chainId }],
        });
      } catch (error: any) {
        // If BSC network is not added, add it
        if (error.code === 4902) {
          await addBSCNetwork();
        } else {
          throw error;
        }
      }

      setIsOnBSC(true);
      toast({
        title: "Network Switched",
        description: "Successfully switched to BSC network!",
      });
    } catch (error) {
      console.error("Error switching to BSC:", error);
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch to BSC network. Please try manually.",
        variant: "destructive",
      });
    }
  };

  const checkNetwork = async () => {
    try {
      const currentNetwork = await getCurrentNetwork();
      setIsOnBSC(currentNetwork === BSC_MAINNET.chainId);
    } catch (error) {
      console.error("Error checking network:", error);
      setIsOnBSC(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      checkNetwork();
    }
  }, [isConnected]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        account,
        isModalOpen,
        connectWallet,
        disconnectWallet,
        connectMetaMask,
        connectWalletConnect,
        openModal,
        closeModal,
        switchToBSC,
        isOnBSC,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

// Wrap the main App component with WalletProvider
export function withWalletProvider<P extends object>(Component: React.ComponentType<P>) {
  return function WrappedComponent(props: P) {
    return (
      <WalletProvider>
        <Component {...props} />
      </WalletProvider>
    );
  };
}
