import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  text: string;
  sender: 'user' | 'llm';
  isHTML?: boolean;
  timestamp: Date;
}

export interface IChatHistory extends Document {
  walletAddress: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatHistorySchema = new Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      index: true
    },
    messages: [
      {
        text: { type: String, required: true },
        sender: { type: String, enum: ['user', 'llm'], required: true },
        isHTML: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);
