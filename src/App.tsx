import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { I18nProvider, useI18n } from '@/i18n';
import { AppRoutes } from '@/routes';
import { themeConfig } from '@/config/theme';
import './App.css';

// 内部组件，用于访问 I18n context
const AppContent: React.FC = () => {
  const { locale } = useI18n();
  
  // 根据语言选择对应的 antd 语言包
  const antdLocale = locale === 'zh-CN' ? zhCN : enUS;
  
  return (
    <ConfigProvider theme={themeConfig} locale={antdLocale}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
};

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;
