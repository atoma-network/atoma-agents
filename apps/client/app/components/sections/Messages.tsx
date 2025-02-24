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
      // Only try to parse AI responses
      if (message.sender === 'ai') {
        const parsed = JSON.parse(message.message);
        if (parsed && typeof parsed === 'object') {
          // Extract the actual response content from the JSON structure
          const content = Array.isArray(parsed)
            ? parsed[0]?.response || message.message
            : parsed.response || message.message;
          return { ...message, message: content, isHTML: false };
        }
      }
    } catch (error) {
      // Not a JSON string or parsing failed, keep as is
    }
    return message;
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-2">
      {processedMessages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
        >
          <div
            className={`relative p-4 rounded-lg max-w-[80%] md:max-w-[60%] break-words ${
              message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black'
            }`}
          >
            {message.isHTML ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: JSONFormatter.format(message.message)
                }}
              />
            ) : (
              <div className="whitespace-pre-wrap">{message.message}</div>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
