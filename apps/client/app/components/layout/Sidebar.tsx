'use client';
import { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { useRouter, useParams } from 'next/navigation';
import api from '@/app/lib/api';
import { ConversationItem } from '../sections/ConversationItem';
import { KebabMenu } from '../sections/ConversationMenu';
import { NewChatButton } from '../sections/NewChatButton';
import { SearchBar } from '../sections/ConversationSearchBar';
import { MobileSidebar } from '../sections/MobileSidebar';

interface Conversation {
  title: string;
  id: string;
}

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { connected, address } = useWallet();
  const { conversationId } = useParams();
  const [kebabMenu, setKebabMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    id: ''
  });

  useEffect(() => {
    if (address) {
      const getConvoIds = async () => {
        try {
          const res = await api.get(`/conversations/user/${address}/id`);
          setConversations(res.data);
        } catch (error) {
          console.error(error);
        }
      };
      getConvoIds();
    }
  }, [connected, address]);

  const addChat = () => {
    if (!address) {
      alert('Connect wallet to add a new chat');
    } else {
      (async () => {
        try {
          const res = await api.post('/conversations/new', { walletAddress: address });
          const { _id } = res.data;
          setConversations((prev) => [...prev, { title: res.data?.title, id: _id }]);
          router.push(`/conversations/${_id}`);
        } catch (error) {
          alert('Failed to create new chat');
        }
      })();
    }
  };

  const handleKebabClick = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    setKebabMenu({
      show: true,
      x: event.clientX,
      y: event.clientY,
      id: id
    });
  };

  const handleKebabClose = () => {
    setKebabMenu({ ...kebabMenu, show: false });
  };
  const handleDelete = async () => {
    try {
      const response = await api.delete(`/conversations/${kebabMenu.id}/remove`);
      if (response.status === 204) {
        setConversations((prevConversations) =>
          prevConversations.filter((convo) => convo.id !== kebabMenu.id)
        );
        handleKebabClose();
        // If the deleted conversation was the current one, redirect to the homepage
        if (kebabMenu.id === conversationId) {
          router.push('/');
        }
      } else {
        console.error('Unexpected status code:', response.status);
        alert('Failed to delete conversation. Server returned an unexpected response.');
      }
    } catch (error) {
      // Handle error (e.g., network issues, server problems)
      console.error('Error deleting conversation:', error);
      alert('Failed to delete conversation. Please check your connection and try again.');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="hidden sm:flex flex-col bg-white border-r w-72 p-4 space-y-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-purple-600"></div>
          <span className="text-lg font-semibold">AtomaSage</span>
        </div>
        <NewChatButton addChat={addChat} />
        <SearchBar />
        <div className="overflow-scroll">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              conversationId={conversationId}
              handleKebabClick={handleKebabClick}
            />
          ))}
        </div>
        {kebabMenu.show && (
          <KebabMenu
            x={kebabMenu.x}
            y={kebabMenu.y}
            onClose={handleKebabClose}
            onDelete={handleDelete}
          />
        )}
      </div>
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        addChat={addChat}
        conversations={conversations}
        handleKebabClick={handleKebabClick}
      />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
};

export default Sidebar;
