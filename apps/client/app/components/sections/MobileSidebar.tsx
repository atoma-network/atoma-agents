'use client';
import { FiMenu } from 'react-icons/fi';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { ConversationItem } from './ConversationItem';

interface MobileSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addChat: () => void;
  conversations: any[];
  handleKebabClick: (e: React.MouseEvent, id: string) => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  setIsOpen,
  addChat,
  conversations,
  handleKebabClick
}) => {
  if (!isOpen) return null;

  return (
    <div id="mobile-menu" className="fixed inset-0 bg-white flex flex-col z-40 p-4">
      <button className="self-end p-2 text-gray-600" onClick={() => setIsOpen(false)}>
        ✖
      </button>

      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-purple-600"></div>
        <span className="text-lg font-semibold">AtomaSage</span>
      </div>

      <button
        className="flex items-center bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg w-full gap-2 mb-4 transition-colors"
        onClick={addChat}
      >
        <AiOutlinePlus size={20} />
        <span>New Chat</span>
      </button>

      <div className="relative">
        <AiOutlineSearch
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-100 p-2 pl-10 rounded-lg focus:outline-none border-none"
        />
      </div>

      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          conversationId={''}
          handleKebabClick={handleKebabClick}
        />
      ))}
    </div>
  );
};
