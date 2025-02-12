import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  walletAddress: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  walletAddress: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = model<IUser>('User', UserSchema);
export { IUser };
