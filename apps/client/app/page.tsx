'use client';
import React, { useState, useEffect } from 'react';
import PulseLoader from './components/ui/pulseLoader';
import api from './lib/api';
import { useWallet } from '@suiet/wallet-kit';
import JSONFormatter from './utils/JSONFormatter';
import Messages from './components/sections/Messages';
import SampleQuestions from './components/sections/SampleQuestions';
import { useRouter } from 'next/navigation';
export default function Home() {
  const [messages, setMessages] = useState<
    { message: string; sender: 'user' | 'ai'; isHTML?: boolean }[]
  >([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const { address } = useWallet();

  const router = useRouter();
  const handleSend = async (message?: string) => {
    const userMessage = message || inputValue.trim();
    //if connected , switch to chat conversation not anonymous mode
    if (address) {
      (async () => {
        try {
          const res = await api.post('/conversations/new', {
            walletAddress: address
          });
          const { _id } = res.data;
          router.push(`/conversations/${_id}`);
          console.log(message, 'message');
          await api.post(`/conversations/${_id}/messages`, {
            sender: 'user',
            message: userMessage,
            walletAddress: address
          });
          window.location.reload();
        } catch (error) {
          console.log(error);
          alert('failed to create new chat');
        }
      })();
    }

    if (userMessage) {
      setMessages((prev) => [...prev, { message: userMessage, sender: 'user' }]);
      setInputValue('');
      setIsThinking(true);

      try {
        // Always send the wallet address with the query
        const response = await api.post('/query', {
          query: userMessage,
          walletAddress: address
        });

        const res = response.data[0];
        let llmResponse = '';

        if (typeof res.response === 'string') {
          llmResponse = res.response;
        } else {
          llmResponse = JSONFormatter.format(res.response);
        }

        setMessages((prev) => [...prev, { message: llmResponse, sender: 'ai', isHTML: true }]);
      } catch (error) {
        console.error('Error querying the LLM:', error);
        setMessages((prev) => [
          ...prev,
          {
            message: 'Sorry, there was an error. Please try again.',
            sender: 'ai',
            isHTML: false
          }
        ]);
      } finally {
        setIsThinking(false);
      }
    }
  };
  return (
    <div className="h-[90dvh] flex-1 flex justify-center relative items-center flex-col bg-gradient-to-b from-white to-gray-100">
      {/* Change the messages container width to use flex-basis instead of fixed width */}
      <div className="flex-grow overflow-y-auto p-4 w-full max-w-5xl rounded mt-3 bg-transparent relative">
        {/* Fixed background container */}
        <div className="fixed inset-0 flex justify-center items-center pointer-events-none">
          <img src="/atomaLogo.svg" alt="Logo" className="w-[300px] h-[200px] opacity-10" />
        </div>

        {/* Scrollable content */}
        <div className="relative z-10">
          <Messages messages={messages} />

          {isThinking && (
            <div className="relative mb-3 p-3 rounded-md w-fit max-w-[70%] bg-gray-300 text-black self-start mr-auto text-left">
              {/* Please wait... */}
              <PulseLoader />
            </div>
          )}
        </div>
      </div>
      {/* Input area */}

      {/* Input area */}
      <div className="w-[90%] max-w-2xl">
        <div className="flex items-center mt-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Chat with CoinSage..."
            className="flex-grow border-gray-500 border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleSend()}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </div>

        {/* Sample Questions */}
        <SampleQuestions handleSend={handleSend} />
      </div>
    </div>
  );
}
