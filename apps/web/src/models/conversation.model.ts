import { Schema, model, Document, Types, PopulatedDoc } from 'mongoose';
import { IMessage } from './message.model';

interface IConversation extends Document {
  title: string;
  walletAddress: string;
  messages: PopulatedDoc<Document<Types.ObjectId> & IMessage>[];
  startedAt: Date;
  endedAt?: Date;
}

const ConversationSchema = new Schema<IConversation>({
  title: String,
  walletAddress: { type: String, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
});

export const Conversation = model<IConversation>('Conversation', ConversationSchema);
export { IConversation };
