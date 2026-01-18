import React from 'react';
import { Layout } from 'antd';
import { Header } from './Header';
import './AppLayout.css';

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Layout className="app-layout">
      <Header />
      <Content className="app-content">{children}</Content>
    </Layout>
  );
};
