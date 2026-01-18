// Bmob SDK 类型声明
declare global {
  interface Window {
    Bmob: any;
  }
}

// 动态加载 Bmob SDK
export const initBmob = () => {
  if (typeof window !== 'undefined' && window.Bmob) {
    return window.Bmob;
  }
  
  throw new Error('Bmob SDK not loaded. Please ensure Bmob-2.5.2.min.js is loaded before the app initializes.');
};

// Bmob 初始化配置（从环境变量读取）
export const BMOB_CONFIG = {
  ApplicationID: import.meta.env.VITE_BMOB_APPLICATION_ID || '',
  RestAPIKey: import.meta.env.VITE_BMOB_REST_API_KEY || '',
};

// 初始化 Bmob
export const initializeBmob = () => {
  const Bmob = initBmob();
  Bmob.initialize(BMOB_CONFIG.ApplicationID, BMOB_CONFIG.RestAPIKey);
  Bmob.debug(true);
  return Bmob;
};
