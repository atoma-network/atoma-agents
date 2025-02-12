import { Schema, model, Document, Types } from 'mongoose';
import Utils from '../utils';
const { encrypt, decrypt } = new Utils();
interface IMessage extends Document {
  sender: 'user' | 'ai';
  walletAddress: string;
  message: string;
  iv: string;
  isHTML?: boolean;
  timestamp: Date;
  sessionId: Types.ObjectId;
  getDecryptedMessage: () => string;
}

const MessageSchema = new Schema<IMessage>({
  sender: { type: String, enum: ['user', 'ai'], required: true },
  walletAddress: { type: String, required: true },
  message: { type: String, required: true }, // Will be stored encrypted
  isHTML: { type: Boolean, default: false },
  iv: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  sessionId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true }
});

// **Encrypt before saving**
MessageSchema.pre('save', function (next) {
  if (this.isModified('message')) {
    const { encrypted, iv } = encrypt(this.message);
    this.message = encrypted;
    this.iv = iv;
  }
  next();
});

// **Decrypt when retrieving**
MessageSchema.methods.getDecryptedMessage = function () {
  return decrypt(this.message, this.iv);
};

export const Message = model<IMessage>('Message', MessageSchema);
export { IMessage };
