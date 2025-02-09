'use client';

import { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import { AiOutlineHome, AiOutlineUser, AiOutlineSetting } from 'react-icons/ai';

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        !(event.target as HTMLElement).closest('#mobile-menu') &&
        !(event.target as HTMLElement).closest('#menu-button')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isMobileMenuOpen]);

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden sm:flex flex-col bg-purple-950 text-white w-16 hover:w-64 group transition-all duration-300">
        {/* Logo */}
        <div className="p-4 flex justify-center">
          <FiMenu size={24} />
        </div>

        {/* Sidebar Items */}
        <div className="flex-1 space-y-4 mt-4">
          <div className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
            <AiOutlineHome size={24} />
            <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">Home</span>
          </div>
          <div className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
            <AiOutlineUser size={24} />
            <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              Profile
            </span>
          </div>
          <div className="flex items-center p-4 hover:bg-gray-700 cursor-pointer">
            <AiOutlineSetting size={24} />
            <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              Settings
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="sm:hidden">
        <button
          id="menu-button"
          className="fixed top-4 right-4 z-50 p-2 bg-gray-900 text-white rounded"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <FiMenu size={24} />
        </button>

        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="fixed inset-0 bg-gray-800/90 text-white flex flex-col z-40 p-4"
          >
            <button className="self-end p-2" onClick={() => setIsMobileMenuOpen(false)}>
              ✖
            </button>
            <div className="flex-1 space-y-4 mt-4">
              <div className="p-4 hover:bg-gray-700 cursor-pointer">Home</div>
              <div className="p-4 hover:bg-gray-700 cursor-pointer">Profile</div>
              <div className="p-4 hover:bg-gray-700 cursor-pointer">Settings</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Sidebar;
