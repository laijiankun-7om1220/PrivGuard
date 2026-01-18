import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import {
  FileTextOutlined,
  CheckSquareOutlined,
  UserOutlined,
  AimOutlined,
  SettingOutlined,
  ShareAltOutlined,
  SafetyOutlined,
  UnlockOutlined,
  SaveOutlined,
  GlobalOutlined,
  SyncOutlined,
  BankOutlined,
  NotificationOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import { useI18n } from '@/i18n';
import './Help.css';

const { Title, Paragraph } = Typography;

// 图标映射
const iconMap: Record<number, React.ReactNode> = {
  0: <FileTextOutlined />,
  1: <CheckSquareOutlined />,
  2: <UserOutlined />,
  3: <AimOutlined />,
  4: <SettingOutlined />,
  5: <ShareAltOutlined />,
  6: <SafetyOutlined />,
  7: <UnlockOutlined />,
  8: <SaveOutlined />,
  9: <GlobalOutlined />,
  10: <SyncOutlined />,
  11: <BankOutlined />,
  12: <NotificationOutlined />,
  13: <HeartOutlined />,
};

// 颜色映射
const colorMap: Record<number, string> = {
  0: '#1890ff',
  1: '#52c41a',
  2: '#722ed1',
  3: '#fa8c16',
  4: '#13c2c2',
  5: '#eb2f96',
  6: '#faad14',
  7: '#2f54eb',
  8: '#fa541c',
  9: '#1890ff',
  10: '#52c41a',
  11: '#722ed1',
  12: '#fa8c16',
  13: '#eb2f96',
};

export const Help: React.FC = () => {
  const { t } = useI18n();
  
  return (
    <div className="help-page">
      {/* 顶部标题区域 */}
      <div className="help-header">
        <Title level={2} className="help-main-title">
          {t.help.title}
        </Title>
        <Paragraph className="help-subtitle">
          {t.help.subtitle}
        </Paragraph>
      </div>

      {/* 检测项目说明 - 卡片网格 */}
      <div className="help-content">
        <Row gutter={[24, 24]}>
          {t.help.content.map((item, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <Card className="help-card-item" hoverable>
                <div className="help-card-icon" style={{ background: colorMap[index] }}>
                  {iconMap[index]}
                </div>
                <Title level={4} className="help-card-title">
                  {item.title}
                </Title>
                <Paragraph className="help-card-desc">
                  {item.desc}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};
