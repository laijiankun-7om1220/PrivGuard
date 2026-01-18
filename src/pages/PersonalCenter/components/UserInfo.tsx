import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message, Alert, Space, Avatar, Typography, Divider, Row, Col } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  PhoneOutlined, 
  MailOutlined,
  EditOutlined,
  SafetyOutlined 
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/i18n';
import { userService } from '@/services/user.service';
import { authService } from '@/services/auth.service';
import {
  validatePhone,
  validatePassword,
} from '@/utils/validators';
import './UserInfo.css';

const { Text } = Typography;

export const UserInfo: React.FC = () => {
  const { t } = useI18n();
  const [form] = Form.useForm();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [warningVisible, setWarningVisible] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        phone: user.phone || '',
        email: user.email || '',
      });
    }
  }, [user, form]);

  const handleSubmit = async (values: any) => {
    const hasChanges =
      values.username !== user?.username ||
      values.password ||
      values.phone !== (user?.phone || '') ||
      values.email !== (user?.email || '');

    if (!hasChanges) {
      setWarningVisible(true);
      setTimeout(() => setWarningVisible(false), 3000);
      return;
    }

    setLoading(true);
    try {
      if (!user?.objectId) return;

      await userService.updateUserInfo(user.objectId, {
        username: values.username,
        password: values.password || undefined,
        phone: values.phone,
        email: values.email,
      });

      // 刷新用户信息
      refreshUser();
      
      // 重新加载最新的用户数据到表单
      setTimeout(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          form.setFieldsValue({
            username: currentUser.username,
            phone: currentUser.phone || '',
            email: currentUser.email || '',
            password: '', // 清空密码字段
          });
        }
      }, 100);

      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 3000);
      message.success(t.personalCenter.userInfo.updateSuccess);
    } catch (error) {
      message.error(t.personalCenter.userInfo.updateFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    if (user) {
      form.setFieldsValue({
        username: user.username,
        phone: user.phone || '',
        email: user.email || '',
      });
    }
  };

  return (
    <div className="user-info-container">
      {successVisible && (
        <Alert
          message={t.personalCenter.userInfo.updateSuccess}
          type="success"
          showIcon
          closable
          onClose={() => setSuccessVisible(false)}
          style={{ marginBottom: 16 }}
          className="alert-animate"
        />
      )}

      {warningVisible && (
        <Alert
          message={t.personalCenter.userInfo.noChanges}
          type="warning"
          showIcon
          closable
          onClose={() => setWarningVisible(false)}
          style={{ marginBottom: 16 }}
          className="alert-animate"
        />
      )}

      {/* 用户头像卡片 */}
      <Card className="user-avatar-card" bordered={false}>
        <div className="avatar-section">
          <Avatar size={100} icon={<UserOutlined />} className="user-avatar" />
          <div className="avatar-info">
            <Text strong style={{ fontSize: 20, color: '#333' }}>{user?.username}</Text>
            <Text type="secondary" style={{ fontSize: 14 }}>
              {user?.email || t.personalCenter.userInfo.noEmail}
            </Text>
          </div>
        </div>
      </Card>

      {/* 基本信息卡片 */}
      <Card 
        title={
          <Space>
            <EditOutlined />
            <span>{t.personalCenter.userInfo.basicInfo}</span>
          </Space>
        }
        className="user-info-card" 
        bordered={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="username"
                label={t.personalCenter.userInfo.username}
                rules={[{ required: false }]}
              >
                <Input 
                  prefix={<UserOutlined className="input-icon" />}
                  placeholder={t.personalCenter.userInfo.username}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label={t.personalCenter.userInfo.phone}
                rules={[
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const error = validatePhone(value);
                      return error
                        ? Promise.reject(new Error(error))
                        : Promise.resolve();
                    },
                  },
                ]}
              >
                <Input 
                  prefix={<PhoneOutlined className="input-icon" />}
                  placeholder={t.personalCenter.userInfo.phone}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            label={t.personalCenter.userInfo.email}
            rules={[
              { type: 'email', message: t.personalCenter.userInfo.emailInvalid },
            ]}
          >
            <Input 
              prefix={<MailOutlined className="input-icon" />}
              placeholder={t.personalCenter.userInfo.email}
              size="large"
            />
          </Form.Item>
        </Form>
      </Card>

      {/* 安全设置卡片 */}
      <Card 
        title={
          <Space>
            <SafetyOutlined />
            <span>{t.personalCenter.userInfo.securitySettings}</span>
          </Space>
        }
        className="user-info-card security-card" 
        bordered={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="password"
            label={t.personalCenter.userInfo.password}
            rules={[
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const error = validatePassword(value);
                  return error
                    ? Promise.reject(new Error(error))
                    : Promise.resolve();
                },
              },
            ]}
            extra={
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t.personalCenter.userInfo.passwordHint}
              </Text>
            }
          >
            <Input.Password 
              prefix={<LockOutlined className="input-icon" />}
              placeholder={t.personalCenter.userInfo.passwordPlaceholder}
              size="large"
            />
          </Form.Item>

          <Divider />

          <Form.Item style={{ marginBottom: 0 }}>
            <Space size="middle">
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                size="large"
                className="submit-button"
              >
                {t.personalCenter.userInfo.update}
              </Button>
              <Button 
                onClick={handleReset}
                size="large"
                className="reset-button"
              >
                {t.personalCenter.userInfo.reset}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
