import { User, IUser } from '../models/user.model';

class UserRepository {
  async getAllUsers(): Promise<IUser[]> {
    return await User.find();
  }

  async getById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }
}

export default UserRepository;
