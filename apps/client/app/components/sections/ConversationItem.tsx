'use client';
import { MoreVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ConversationItemProps {
  conversation: {
    title: string;
    id: string;
  };
  conversationId: string;
  handleKebabClick: (event: React.MouseEvent, id: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  conversationId,
  handleKebabClick
}) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/conversations/${conversation.id}`)}
      className={`${
        conversation.id === conversationId ? 'bg-purple-600' : ''
      } p-2 border rounded-lg mt-1 flex justify-center items-center relative`}
    >
      <p className={`${conversation.id === conversationId ? 'text-white' : ''}`}>
        conversation {conversation.id}
      </p>
      <MoreVertical
        size={30}
        className="z-10 cursor-pointer"
        onClick={(e) => handleKebabClick(e, conversation.id)}
      />
    </div>
  );
};
