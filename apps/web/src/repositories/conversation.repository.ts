import { Conversation, IConversation } from '../models/conversation.model';
import { Types } from 'mongoose';

class ConversationRepository {
  async create(data: { walletAddress: string }): Promise<IConversation> {
    return await Conversation.create(data);
  }

  async getBySessionId(sessionId: Types.ObjectId): Promise<IConversation | null> {
    return await Conversation.findById(sessionId).populate('messages');
  }

  async addMessage(
    sessionId: Types.ObjectId,
    messageId: Types.ObjectId
  ): Promise<IConversation | null> {
    return await Conversation.findByIdAndUpdate(
      sessionId,
      { $push: { messages: messageId } },
      { new: true }
    );
  }

  async endConversation(sessionId: Types.ObjectId): Promise<IConversation | null> {
    return await Conversation.findByIdAndUpdate(sessionId, { endedAt: new Date() }, { new: true });
  }

  async getByWalletAddress(walletAddress: string): Promise<IConversation[]> {
    return await Conversation.find({ walletAddress })
      .populate('messages')
      .sort({ startedAt: -1 })
      .exec();
  }

  async deleteConversation(sessionId: Types.ObjectId) {
    return await Conversation.findByIdAndDelete(sessionId);
  }
}

export default ConversationRepository;
