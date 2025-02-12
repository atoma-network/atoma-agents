'use client';

import React, { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { useRouter, useParams } from 'next/navigation';
import api from '@/app/lib/api';
import SampleQuestions from '@/app/components/sections/SampleQuestions';
import Messages from '@/app/components/sections/Messages';
//import JSONFormatter from '@/app/utils/JSONFormatter';
import PulseLoader from '@/app/components/ui/pulseLoader';
import LoadingPage from '@/app/components/ui/loadingPage';

interface Message {
  message: string;
  sender: 'user' | 'ai';
  isHTML?: boolean;
}

interface Conversation {
  id: string;
  messages: Message[];
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initially true to show loading
  const { address } = useWallet();
  const { conversationId } = useParams();
  const router = useRouter();

  // Fetch the current conversation messages
  const loadConversation = async () => {
    if (!conversationId) return;

    try {
      const response = await api.get<Conversation>(`/conversations/${conversationId}`);
      if (!response.data) {
        router.push('/');
        return;
      }

      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error loading conversation:', error);
      router.push('/');
    } finally {
      setIsLoading(false); // Only stop loading after first fetch
    }
  };

  // Fetch messages when conversationId changes
  useEffect(() => {
    loadConversation();
  }, [conversationId]);

  const handleSend = async (message?: string) => {
    const userMessage = message || inputValue.trim();
    if (!userMessage) return;
    if (!address) {
      alert('wallet not connected');
      router.push('/');
    }
    // Optimistically update UI
    setMessages((prev) => [...prev, { message: userMessage, sender: 'user' }]);
    setInputValue('');
    setIsThinking(true);

    try {
      await api.post(`/conversations/${conversationId}/messages`, {
        sender: 'user',
        message: userMessage,
        walletAddress: address
      });

      // Refetch only messages without resetting the entire page
      loadConversation();
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [...prev, { message: 'Error occurred. Try again.', sender: 'ai' }]);
    } finally {
      setIsThinking(false);
    }
  };

  if (isLoading) return <LoadingPage />;

  return (
    <div className="h-[90dvh]  flex-1 flex justify-center relative items-center flex-col bg-gradient-to-b from-white to-gray-100">
      <div className="flex-grow overflow-y-auto p-4 w-full max-w-5xl rounded mt-3 bg-transparent relative">
        <div className="fixed inset-0 flex justify-center items-center pointer-events-none">
          <img src="/atomaLogo.svg" alt="Logo" className="w-[300px] h-[200px] opacity-10" />
        </div>

        <div className="relative z-10">
          <div className="flex-grow overflow-y-auto p-4 w-[70dvw] h-[70dvh] rounded mt-3 bg-transparent relative">
            <Messages messages={messages} />
          </div>
          {isThinking && (
            <div className="relative mb-3 p-3 rounded-md w-fit max-w-[70%] bg-gray-300 text-black self-start mr-auto text-left">
              <PulseLoader />
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="w-[90%] max-w-2xl">
        <div className="flex items-center mt-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Chat with AtomaSage..."
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
