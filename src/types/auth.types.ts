export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  phone: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export interface User {
  objectId: string;
  username: string;
  phone?: string;
  email?: string;
  role?: 'admin' | 'user'; // 用户角色：管理员或普通用户
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => void;
  refreshUser: () => void;
  loading: boolean;
}
