import { initializeBmob } from './bmob';

const Bmob = initializeBmob();

export interface UpdateUserInfo {
  username?: string;
  password?: string;
  phone?: string;
  email?: string;
}

export const userService = {
  async updateUserInfo(userId: string, data: UpdateUserInfo): Promise<void> {
    try {
      const query = Bmob.Query('_User');
      const res = await query.get(userId);
      
      if (data.username) {
        res.set('username', data.username);
      }
      if (data.password) {
        res.set('password', data.password);
      }
      if (data.phone) {
        res.set('phone', data.phone);
      }
      if (data.email) {
        res.set('email', data.email);
      }
      
      await res.save();
    } catch (error) {
      console.error('Update user info error:', error);
      throw error;
    }
  },
};
