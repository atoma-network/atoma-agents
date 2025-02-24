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

  const formatJSONResponse = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        // Format array of responses
        return parsed.map(item => (
          <div className="mb-2">
            {item.reasoning && (
              <div className="text-gray-500 text-sm italic mb-1">
                {item.reasoning}
              </div>
            )}
            <div className="font-medium">
              {typeof item.response === 'object' 
                ? <pre className="bg-gray-50 rounded-md p-3 text-sm overflow-x-auto">
                    {JSON.stringify(item.response, null, 2)}
                  </pre>
                : <div className="text-base">{item.response}</div>
              }
            </div>
          </div>
        ));
      }
      // Format single response object
      return (
        <div>
          {parsed.reasoning && (
            <div className="text-gray-500 text-sm italic mb-1">
              {parsed.reasoning}
            </div>
          )}
          <div className="font-medium">
            {typeof parsed.response === 'object'
              ? <pre className="bg-gray-50 rounded-md p-3 text-sm overflow-x-auto">
                  {JSON.stringify(parsed.response, null, 2)}
                </pre>
              : <div className="text-base">{parsed.response}</div>
            }
          </div>
        </div>
      );
    } catch (error) {
      return jsonString;
    }
  };

  const processedMessages = messages.map((message) => {
    try {
      if (message.sender === 'ai') {
        const parsed = JSON.parse(message.message);
        if (parsed && typeof parsed === 'object') {
          return { 
            ...message, 
            message: message.message, // Keep original JSON for formatting
            isHTML: true 
          };
        }
      }
    } catch (error) {
      // Not a JSON string or parsing failed, keep as is
    }
    return message;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {processedMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`relative p-4 rounded-lg max-w-[85%] md:max-w-[70%] ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-black'
              }`}
            >
              {message.isHTML ? (
                <div className="text-sm">
                  {formatJSONResponse(message.message)}
                </div>
              ) : (
                <div className="whitespace-pre-wrap break-words text-base">
                  {message.message}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default Messages;
