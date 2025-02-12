import MessageRepository from '../repositories/message.repository';
import ConversationRepository from '../repositories/conversation.repository';
import { Types } from 'mongoose';

class MessageService {
  private messageRepository: MessageRepository;
  private conversationRepository: ConversationRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
    this.conversationRepository = new ConversationRepository();
  }

  async createMessage(data: {
    sender: 'user' | 'ai';
    walletAddress: string;
    message: string;
    sessionId: Types.ObjectId;
  }) {
    // Create message

    const message = await this.messageRepository.create(data);
    // Store message in conversation
    await this.conversationRepository.addMessage(
      data.sessionId,
      new Types.ObjectId(message._id as string)
    );
    return message;
  }

  async getConversationMessages(sessionId: Types.ObjectId) {
    const messages = await this.messageRepository.getBySessionId(sessionId);

    // **Decrypt messages before returning**
    return messages.map((msg) => ({
      ...msg.toObject(),
      message: msg.getDecryptedMessage()
    }));
  }
}

export default MessageService;
