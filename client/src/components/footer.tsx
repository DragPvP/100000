export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-okx-green to-okx-gold rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">CS</span>
              </div>
              <span className="text-xl font-bold">CryptoStake Pro</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Professional crypto staking platform offering institutional-grade security and competitive returns on your digital assets.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 bg-okx-darker px-3 py-2 rounded-lg">
                <img 
                  src="/usdt-icon.png" 
                  alt="USDT" 
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-okx-gold">20% APY</span>
              </div>
              <div className="flex items-center space-x-2 bg-okx-darker px-3 py-2 rounded-lg">
                <img 
                  src="/bnb-icon.png" 
                  alt="BNB" 
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-okx-green">15% APY</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#staking-dashboard" className="hover:text-okx-green transition-colors">Staking</a></li>
              <li><a href="#calculator" className="hover:text-okx-green transition-colors">Calculator</a></li>
              <li><a href="#staking-dashboard" className="hover:text-okx-green transition-colors">Dashboard</a></li>
              <li><a href="#staking-dashboard" className="hover:text-okx-green transition-colors">Rewards</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-okx-green transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-okx-green transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-okx-green transition-colors">Risk Disclosure</a></li>
              <li><a href="#" className="hover:text-okx-green transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">© 2024 CryptoStake Pro. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0">
            Staking involves risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  );
}
