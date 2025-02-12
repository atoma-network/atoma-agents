'use client';
import React from 'react';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import Image from 'next/image';

const Header = () => {
  const { address, connected } = useWallet();

  return (
    <div className="w-[60dvw] grid grid-cols-1 md:flex justify-end">
      {/* <span className="flex items-center">
        <Image src="/coinSageLogo.png" width={50} height={50} alt="atomasage logo" priority />
        <p
          style={{
            fontFamily: 'fantasy'
          }}
          className="text-lg text-right font-thin md:text-left"
        >
          AtomaSage
        </p>
      </span> */}

      <div className="flex items-center gap-4">
        {connected && (
          <span className="text-sm text-gray-600">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        )}
        <div className="w-40 md:block z-20">
          <ConnectButton label="Connect Wallet" />
        </div>
      </div>
    </div>
  );
};

export default Header;
