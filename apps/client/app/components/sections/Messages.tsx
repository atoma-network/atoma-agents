import React from 'react';

interface Message {
  text: string;
  sender: 'user' | 'llm';
  isHTML?: boolean;
}

interface MessagesProps {
  messages: Message[];
}

const Messages: React.FC<MessagesProps> = ({ messages }) => {
  return (
    <div>
      {' '}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`relative mb-3 p-3 rounded-md  w-fit  md:max-w-[40%] break-words opacity-100 ${
            message.sender === 'user'
              ? 'bg-blue-500 text-white self-end ml-auto text-right'
              : 'bg-gray-300 text-black self-start mr-auto text-left'
          }`}
        >
          {message.isHTML ? (
            <div dangerouslySetInnerHTML={{ __html: message.text }} />
          ) : (
            <div>{message.text}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Messages;
