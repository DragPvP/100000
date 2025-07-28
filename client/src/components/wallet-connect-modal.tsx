import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { Wifi, X } from "lucide-react";

export default function WalletConnectModal() {
  const { isModalOpen, closeModal, connectMetaMask, connectWalletConnect } = useWallet();

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="bg-okx-dark border-gray-700 max-w-md">
        <DialogHeader>
          <div className="w-16 h-16 bg-gradient-to-r from-okx-green to-okx-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <Wifi className="w-8 h-8 text-black" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">Connect Wallet</DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            Connect your wallet to start staking and earning rewards
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <Button
            onClick={connectMetaMask}
            className="w-full flex items-center space-x-3 p-4 bg-black hover:bg-gray-900 border border-gray-700 text-left h-auto"
            variant="ghost"
          >
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold">MetaMask</div>
              <div className="text-sm text-gray-400">Connect using browser wallet</div>
            </div>
          </Button>
          
          <Button
            onClick={connectWalletConnect}
            className="w-full flex items-center space-x-3 p-4 bg-black hover:bg-gray-900 border border-gray-700 text-left h-auto"
            variant="ghost"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">W</span>
            </div>
            <div className="flex-1">
              <div className="font-semibold">WalletConnect</div>
              <div className="text-sm text-gray-400">Connect using QR code</div>
            </div>
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            By connecting a wallet, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
