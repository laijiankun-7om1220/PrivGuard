import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Checkbox } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/i18n';
import { authService } from '@/services/auth.service';
import './AuthModal.css';

interface LoginModalProps {
  open: boolean;
  onCancel: () => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onCancel,
  onSwitchToRegister,
}) => {
  const { t } = useI18n();
  const [form] = Form.useForm();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      message.success(t.auth.login.loginSuccess);
      form.resetFields();
      onCancel();
    } catch (error: any) {
      // 检查用户是否存在
      const exists = await authService.checkUserExists(values.username);
      if (!exists) {
        message.error(t.auth.login.userNotRegistered);
      } else {
        message.error(t.auth.login.wrongCredentials);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t.auth.login.title}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={400}
      className="auth-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          label={t.auth.login.username}
          rules={[{ required: true, message: t.auth.login.usernameRequired }]}
        >
          <Input placeholder={t.auth.login.usernamePlaceholder} />
        </Form.Item>

        <Form.Item
          name="password"
          label={t.auth.login.password}
          rules={[{ required: true, message: t.auth.login.passwordRequired }]}
        >
          <Input.Password placeholder={t.auth.login.passwordPlaceholder} />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>{t.auth.login.remember}</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {t.auth.login.submit}
          </Button>
        </Form.Item>

        <Form.Item>
          <div className="auth-footer">
            <Button type="link" onClick={onSwitchToRegister}>
              {t.auth.login.switchToRegister}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
