import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Space, Statistic } from 'antd';
import {
  SafetyOutlined,
  SearchOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  ThunderboltOutlined,
  FileProtectOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { LoginModal } from '@/components/Auth/LoginModal';
import { RegisterModal } from '@/components/Auth/RegisterModal';
import { useI18n } from '@/i18n';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import './Home.css';

const { Title, Paragraph } = Typography;

export const Home: React.FC = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    const login = searchParams.get('login');
    const register = searchParams.get('register');
    
    if (login === 'true') {
      setLoginOpen(true);
      setSearchParams({});
    }
    if (register === 'true') {
      setRegisterOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleStartDetect = () => {
    if (isAuthenticated) {
      navigate('/detect');
    } else {
      setLoginOpen(true);
    }
  };

  const features = [
    {
      icon: <RocketOutlined />,
      title: t.home.features.fastDetection.title,
      description: t.home.features.fastDetection.description,
      color: '#1890ff',
    },
    {
      icon: <CheckCircleOutlined />,
      title: t.home.features.accurateRecognition.title,
      description: t.home.features.accurateRecognition.description,
      color: '#52c41a',
    },
    {
      icon: <BarChartOutlined />,
      title: t.home.features.detailedReport.title,
      description: t.home.features.detailedReport.description,
      color: '#722ed1',
    },
    {
      icon: <FileProtectOutlined />,
      title: t.home.features.secure.title,
      description: t.home.features.secure.description,
      color: '#fa8c16',
    },
  ];

  return (
    <div className="home-container">
      {/* Hero 区域 */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-illustration">
            <div className="magnifier-container">
              <div className="magnifier-glass">
                <div className="magnified-content">
                  <FileProtectOutlined className="document-icon" />
                  <CheckCircleOutlined className="check-icon" />
                </div>
              </div>
              <div className="magnifier-handle"></div>
              <div className="search-icon-wrapper">
                <SearchOutlined className="search-icon" />
              </div>
            </div>
          </div>
          <Title level={1} className="hero-title">
            {t.home.title}
          </Title>
          <Title level={3} className="hero-subtitle">
            {t.home.subtitle}
          </Title>
          <Paragraph className="hero-description">
            {t.home.description}
          </Paragraph>
          <Space size="large" className="hero-actions">
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleStartDetect}
              className="start-button"
            >
              {t.home.startDetection}
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/help')}
              className="learn-button"
            >
              {t.home.learnMore}
            </Button>
          </Space>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="stats-section">
        <Row gutter={[24, 24]} justify="center">
          <Col xs={12} sm={12} md={6}>
            <Card className="stat-card" hoverable>
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <FileProtectOutlined />
              </div>
              <Statistic
                title={t.home.stats.appsDetected}
                value={1000}
                suffix="+"
                valueStyle={{ color: '#667eea', fontSize: '32px', fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card className="stat-card" hoverable>
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)' }}>
                <CheckCircleOutlined />
              </div>
              <Statistic
                title={t.home.stats.accuracy}
                value={95}
                suffix="%"
                valueStyle={{ color: '#52c41a', fontSize: '32px', fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card className="stat-card" hoverable>
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)' }}>
                <ClockCircleOutlined />
              </div>
              <Statistic
                title={t.home.stats.timeSaved}
                value={90}
                suffix="%"
                valueStyle={{ color: '#fa8c16', fontSize: '32px', fontWeight: 700 }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card className="stat-card" hoverable>
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)' }}>
                <ThunderboltOutlined />
              </div>
              <Statistic
                title={t.home.stats.speed}
                value={3}
                suffix={t.home.stats.seconds}
                valueStyle={{ color: '#722ed1', fontSize: '32px', fontWeight: 700 }}
              />
            </Card>
          </Col>
        </Row>
      </section>

      {/* 产品特性 */}
      <section className="features-section">
        <Title level={2} className="section-title">
          {t.home.whyChooseUs}
        </Title>
        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card className="feature-card" hoverable>
                <div className="feature-icon" style={{ background: feature.color }}>
                  {feature.icon}
                </div>
                <Title level={4} className="feature-title">
                  {feature.title}
                </Title>
                <Paragraph className="feature-desc">
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 使用步骤 */}
      <section className="steps-section">
        <Title level={2} className="section-title">
          {t.home.stepsTitle}
        </Title>
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} sm={12} lg={6}>
            <Card className="step-card" hoverable>
              <div className="step-number">1</div>
              <Title level={4} className="step-title">{t.home.steps.fillInfo.title}</Title>
              <Paragraph className="step-desc">{t.home.steps.fillInfo.description}</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="step-card" hoverable>
              <div className="step-number">2</div>
              <Title level={4} className="step-title">{t.home.steps.selectDimensions.title}</Title>
              <Paragraph className="step-desc">{t.home.steps.selectDimensions.description}</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="step-card" hoverable>
              <div className="step-number">3</div>
              <Title level={4} className="step-title">{t.home.steps.uploadFile.title}</Title>
              <Paragraph className="step-desc">{t.home.steps.uploadFile.description}</Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="step-card" hoverable>
              <div className="step-number">4</div>
              <Title level={4} className="step-title">{t.home.steps.viewReport.title}</Title>
              <Paragraph className="step-desc">{t.home.steps.viewReport.description}</Paragraph>
            </Card>
          </Col>
        </Row>
      </section>

      <LoginModal
        open={loginOpen}
        onCancel={() => setLoginOpen(false)}
        onSwitchToRegister={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <RegisterModal
        open={registerOpen}
        onCancel={() => setRegisterOpen(false)}
        onSwitchToLogin={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </div>
  );
};
