import React, { useEffect, useRef } from 'react';
import JSONFormatter from '@/app/utils/JSONFormatter';

interface Message {
  message: string;
  sender: 'user' | 'ai';
  isHTML?: boolean;
}

interface MessagesProps {
  messages: Message[];
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processedMessages = messages.map((message) => {
    try {
      const parsed = JSON.parse(message.message);
      if (parsed && typeof parsed === 'object') {
        return { ...message, isHTML: true };
      }
    } catch (error) {
      // Not a JSON string, keep as is
    }
    return { ...message, isHTML: false };
  });

  return (
    <div className="h-full  overflow-y-auto relative">
      {processedMessages.map((message, index) => (
        <div
          key={index}
          className={`relative mb-3 p-3 rounded-md w-fit md:max-w-[40%] break-words opacity-100 ${
            message.sender === 'user'
              ? 'bg-blue-500 text-white self-end ml-auto text-right'
              : 'bg-gray-300 text-black self-start mr-auto text-left'
          }`}
        >
          {message.isHTML ? (
            <div
              dangerouslySetInnerHTML={{
                __html: JSONFormatter.format(JSON.parse(message.message))
              }}
            />
          ) : (
            <div>{message.message}</div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
