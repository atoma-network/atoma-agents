'use client';
import React from 'react';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import Image from 'next/image';
const Header = () => {
  const wallet = useWallet();
  console.log(wallet.address, wallet.connected);
  return (
    <div className="w-[75dvw] grid grid-cols-1 md:flex justify-between">
      {/* <p style={{
        fontFamily:"Manrope",
      }} className="text-lg text-right md:text-left">Atoma's Coin Sage</p> */}
      <span className="flex items-center">
        <Image src="/coinSageLogo.png" width={50} height={50} alt="atomasage logo" />
        <p
          style={{
            fontFamily: 'fantasy'
          }}
          className="text-lg text-right font-thin md:text-left"
        >
          AtomaSage
        </p>
      </span>

      <div className="w-10 md:block z-20 hidden ">
        <ConnectButton className="" label="Connect Wallet" />
      </div>
    </div>
  );
};

export default Header;
