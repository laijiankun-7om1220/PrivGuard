import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/i18n';
import {
  validateUsername,
  validatePhone,
  validateCode,
  validatePassword,
  validateConfirmPassword,
} from '@/utils/validators';
import './AuthModal.css';

interface RegisterModalProps {
  open: boolean;
  onCancel: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  open,
  onCancel,
  onSwitchToLogin,
}) => {
  const { t } = useI18n();
  const [form] = Form.useForm();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);

  const handleSendCode = () => {
    const phone = form.getFieldValue('phone');
    if (!phone) {
      message.warning(t.auth.register.phoneInputFirst);
      return;
    }

    const phoneError = validatePhone(phone);
    if (phoneError) {
      message.error(phoneError);
      return;
    }

    // 开始倒计时
    setCodeCountdown(30);
    const timer = setInterval(() => {
      setCodeCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 这里应该调用发送验证码的 API
    message.success(t.auth.register.codeSent);
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await register(values);
      message.success(t.auth.register.registerSuccess);
      form.resetFields();
      onCancel();
      onSwitchToLogin();
    } catch (error: any) {
      message.error(t.auth.register.registerFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t.auth.register.title}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
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
          label={t.auth.register.username}
          rules={[
            { required: true, message: t.auth.register.usernameRequired },
            {
              validator: (_, value) => {
                const error = validateUsername(value);
                return error ? Promise.reject(new Error(error)) : Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder={t.auth.register.usernamePlaceholder} />
        </Form.Item>

        <Form.Item
          name="phone"
          label={t.auth.register.phone}
          rules={[
            { required: true, message: t.auth.register.phoneRequired },
            {
              validator: (_, value) => {
                const error = validatePhone(value);
                return error ? Promise.reject(new Error(error)) : Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder={t.auth.register.phonePlaceholder} />
        </Form.Item>

        <Form.Item
          name="code"
          label={t.auth.register.code}
          rules={[
            { required: true, message: t.auth.register.codeRequired },
            {
              validator: (_, value) => {
                const error = validateCode(value);
                return error ? Promise.reject(new Error(error)) : Promise.resolve();
              },
            },
          ]}
        >
          <Input
            placeholder={t.auth.register.codePlaceholder}
            suffix={
              <Button
                type="link"
                onClick={handleSendCode}
                disabled={codeCountdown > 0}
                style={{ padding: 0 }}
              >
                {codeCountdown > 0 ? `${codeCountdown}${t.auth.register.resendCode}` : t.auth.register.sendCode}
              </Button>
            }
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={t.auth.register.password}
          rules={[
            { required: true, message: t.auth.register.passwordRequired },
            {
              validator: (_, value) => {
                const error = validatePassword(value);
                return error ? Promise.reject(new Error(error)) : Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password placeholder={t.auth.register.passwordPlaceholder} />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={t.auth.register.confirmPassword}
          dependencies={['password']}
          rules={[
            { required: true, message: t.auth.register.confirmPasswordRequired },
            {
              validator: (_, value) => {
                const password = form.getFieldValue('password');
                const error = validateConfirmPassword(password, value);
                return error ? Promise.reject(new Error(error)) : Promise.resolve();
              },
            },
          ]}
        >
          <Input.Password placeholder={t.auth.register.confirmPasswordPlaceholder} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            {t.auth.register.submit}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
