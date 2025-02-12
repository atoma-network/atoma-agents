import { Message, IMessage } from '../models/message.model';
import { Types } from 'mongoose';

class MessageRepository {
  async create(messageData: {
    sender: 'user' | 'ai';
    walletAddress: string;
    message: string;
    sessionId: Types.ObjectId;
  }): Promise<IMessage> {
    const encryptedMessage = { ...messageData, iv: 'iv' };
    const message = new Message(encryptedMessage);
    await message.save();
    return message;
  }
  async getBySessionId(sessionId: Types.ObjectId): Promise<IMessage[]> {
    return await Message.find({ sessionId }).sort({ timestamp: 1 });
  }
  async getByWalletAddress(walletAddress: string): Promise<IMessage[]> {
    return await Message.find({ walletAddress }).sort({ timestamp: -1 });
  }
}

export default MessageRepository;
