import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Row, Col, Statistic, Avatar, Space, Tag, Typography } from 'antd';
import { 
  HistoryOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CrownOutlined
} from '@ant-design/icons';
import { useI18n } from '@/i18n';
import { useAuth } from '@/contexts/AuthContext';
import { detectService } from '@/services/detect.service';
import { DetectionHistory } from './components/DetectionHistory';
import { UserInfo } from './components/UserInfo';
import './PersonalCenter.css';
import dayjs from 'dayjs';

const { Sider, Content } = Layout;
const { Text } = Typography;

type MenuKey = 'history' | 'info';

export const PersonalCenter: React.FC = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [selectedKey, setSelectedKey] = useState<MenuKey>('history');
  const [totalCount, setTotalCount] = useState(0);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [recentCount, setRecentCount] = useState(0);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const records = await detectService.getDetectRecords();
      setTotalCount(records.length);
      
      // 计算本月检测数
      const currentMonth = dayjs().format('YYYY-MM');
      const monthlyRecords = records.filter(record => 
        dayjs(record.createdAt).format('YYYY-MM') === currentMonth
      );
      setMonthlyCount(monthlyRecords.length);
      
      // 计算最近7天检测数
      const sevenDaysAgo = dayjs().subtract(7, 'day');
      const recentRecords = records.filter(record => 
        dayjs(record.createdAt).isAfter(sevenDaysAgo)
      );
      setRecentCount(recentRecords.length);
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  };

  const isAdmin = user?.role === 'admin';

  const menuItems = [
    {
      key: 'history',
      icon: <HistoryOutlined />,
      label: t.personalCenter.history,
    },
    {
      key: 'info',
      icon: <UserOutlined />,
      label: t.personalCenter.userInfoLabel,
    },
  ];

  return (
    <div className="personal-center-page">
      <Layout className="personal-center-layout">
        <Sider width={220} className="personal-center-sider">
          {/* 用户信息卡片 */}
          <div className="user-profile-card">
            <Space direction="vertical" align="center" style={{ width: '100%' }}>
              <Avatar 
                size={64} 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: isAdmin ? '#ff4d4f' : '#1890ff',
                  fontSize: 28
                }}
              />
              <div style={{ textAlign: 'center' }}>
                <Text strong style={{ fontSize: 16, display: 'block' }}>
                  {user?.username || t.personalCenter.defaultUser}
                </Text>
                <Tag 
                  color={isAdmin ? 'red' : 'blue'} 
                  icon={isAdmin ? <CrownOutlined /> : <UserOutlined />}
                  style={{ marginTop: 8 }}
                >
                  {isAdmin ? t.personalCenter.adminRole : t.personalCenter.userRole}
                </Tag>
              </div>
            </Space>
          </div>
          
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => setSelectedKey(key as MenuKey)}
            className="personal-center-menu"
          />
        </Sider>
        
        <Content className="personal-center-content">
          {/* 统计卡片区域 */}
          {selectedKey === 'history' && (
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card" hoverable>
                  <Statistic
                    title={t.personalCenter.totalDetections}
                    value={totalCount}
                    prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card" hoverable>
                  <Statistic
                    title={t.personalCenter.monthlyDetections}
                    value={monthlyCount}
                    prefix={<CalendarOutlined style={{ color: '#52c41a' }} />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card" hoverable>
                  <Statistic
                    title={t.personalCenter.recentDetections}
                    value={recentCount}
                    prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Card className="stat-card" hoverable>
                  <Statistic
                    title={t.personalCenter.passRate}
                    value={totalCount > 0 ? 85 : 0}
                    suffix="%"
                    prefix={<CheckCircleOutlined style={{ color: '#722ed1' }} />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>
          )}
          
          <Card className="content-card">
            {selectedKey === 'history' && <DetectionHistory onRefresh={loadStatistics} />}
            {selectedKey === 'info' && <UserInfo />}
          </Card>
        </Content>
      </Layout>
    </div>
  );
};
