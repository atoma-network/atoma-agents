'use client';
import React, { useState, useEffect } from 'react';
import PulseLoader from './components/ui/pulseLoader';
import api from './lib/api';
import { useWallet } from '@suiet/wallet-kit';
import JSONFormatter from './utils/JSONFormatter';

import Messages from './components/sections/Messages';
import SampleQuestions from './components/sections/SampleQuestions';
import LoadingPage from './components/ui/loadingPage';

export default function Home() {
  const [messages, setMessages] = useState<
    { text: string; sender: 'user' | 'llm'; isHTML?: boolean }[]
  >([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const { address, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history when wallet connects
  useEffect(() => {
    if (address && connected) {
      loadChatHistory();
      // // Send initial wallet connection message
      // handleSend(`Connected wallet: ${address}`);
    }
  }, [address, connected]);

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/query/history/${address}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (message?: string) => {
    const userMessage = message || inputValue.trim();

    if (userMessage) {
      setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
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

        setMessages((prev) => [...prev, { text: llmResponse, sender: 'llm', isHTML: true }]);
      } catch (error) {
        console.error('Error querying the LLM:', error);
        setMessages((prev) => [
          ...prev,
          {
            text: 'Sorry, there was an error. Please try again.',
            sender: 'llm',
            isHTML: false
          }
        ]);
      } finally {
        setIsThinking(false);
      }
    }
  };
  if (isLoading) return <LoadingPage />;
  return (
    <div className="h-[90dvh] w-[90dvw] flex justify-center relative items-center flex-col bg-gradient-to-b from-white to-gray-100">
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto p-4 w-[82dvw] rounded mt-3 bg-transparent relative">
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
