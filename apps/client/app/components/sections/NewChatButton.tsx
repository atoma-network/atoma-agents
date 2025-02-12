'use client';
import { AiOutlinePlus } from 'react-icons/ai';

interface NewChatButtonProps {
  addChat: () => void;
}

export const NewChatButton: React.FC<NewChatButtonProps> = ({ addChat }) => {
  return (
    <button
      className="flex items-center bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg w-full gap-2 transition-colors"
      onClick={addChat}
    >
      <AiOutlinePlus size={20} />
      <span>New Chat</span>
    </button>
  );
};
