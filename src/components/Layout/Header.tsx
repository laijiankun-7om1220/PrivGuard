import React from 'react';
import { Layout, Dropdown, Button, Space, Avatar, Select } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined, SafetyOutlined, GlobalOutlined } from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/i18n';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: t.header.logout,
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const handleNavClick = (path: string) => {
    // 需要登录的路径
    const protectedRoutes = ['/detect', '/personal-center'];
    
    if (!isAuthenticated && protectedRoutes.includes(path)) {
      // 未登录时访问受保护页面，跳转到首页并打开登录弹窗
      navigate('/?login=true');
      return;
    }
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <AntHeader className="app-header">
      <div className="header-content">
        <div className="logo-section" onClick={() => navigate('/')}>
          <div className="logo-icon">
            <SafetyOutlined />
          </div>
          <h1 className="logo-text">Privacy-Guard Online</h1>
        </div>
        
        <nav className="nav-section">
          <Space size="large">
            <span
              className={`nav-item ${isActive('/') ? 'active' : ''}`}
              onClick={() => handleNavClick('/')}
            >
              {t.header.home}
            </span>
            <span
              className={`nav-item ${isActive('/detect') ? 'active' : ''}`}
              onClick={() => handleNavClick('/detect')}
            >
              {t.header.detect}
            </span>
            <span
              className={`nav-item ${isActive('/help') ? 'active' : ''}`}
              onClick={() => handleNavClick('/help')}
            >
              {t.header.help}
            </span>
            <span
              className={`nav-item ${isActive('/personal-center') ? 'active' : ''}`}
              onClick={() => handleNavClick('/personal-center')}
            >
              {t.header.personalCenter}
            </span>
          </Space>
        </nav>

        <div className="user-section">
          <Select
            value={locale}
            onChange={setLocale}
            className="language-selector"
            suffixIcon={<GlobalOutlined />}
            options={[
              { value: 'zh-CN', label: '中文' },
              { value: 'en-US', label: 'English' },
            ]}
          />
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space className="user-info">
                <span>{t.header.welcome}{user?.username}</span>
                <Avatar icon={<UserOutlined />} />
              </Space>
            </Dropdown>
          ) : (
            <Space>
              <Button type="primary" onClick={() => navigate('/?login=true')}>
                {t.header.login}
              </Button>
              <Button onClick={() => navigate('/?register=true')}>{t.header.register}</Button>
            </Space>
          )}
        </div>
      </div>
    </AntHeader>
  );
};
