'use client';
import { useWallet } from '@suiet/wallet-kit';

const WalletStatus = () => {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <div className="text-center p-4 my-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
        Please connect your wallet to start chatting and save your conversation history
      </div>
    );
  }

  return null;
};

export default WalletStatus;
