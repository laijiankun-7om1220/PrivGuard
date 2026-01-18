import { initializeBmob } from './bmob';
import type { User, RegisterForm } from '@/types/auth.types';

const Bmob = initializeBmob();

export const authService = {
  async login(username: string, password: string): Promise<User> {
    try {
      const res = await Bmob.User.login(username, password);
      await Bmob.User.updateStorage(res.objectId);
      return res;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(data: RegisterForm): Promise<void> {
    try {
      const params = {
        username: data.username,
        phone: data.phone,
        password: data.password,
        role: 'user', // 注册时默认设置为普通用户
      };
      await Bmob.User.register(params);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      Bmob.User.logout();
      localStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser(): User | null {
    try {
      return Bmob.User.current();
    } catch (error) {
      return null;
    }
  },

  async checkUserExists(usernameOrPhone: string): Promise<boolean> {
    try {
      const res = await Bmob.User.find();
      const result = res.filter(
        (item: any) => item?.phone === usernameOrPhone || item?.username === usernameOrPhone
      );
      return result.length > 0;
    } catch (error) {
      console.error('Check user exists error:', error);
      return false;
    }
  },

  /**
   * 检查用户是否为管理员
   */
  isAdmin(user: User | null): boolean {
    return user?.role === 'admin';
  },
};
