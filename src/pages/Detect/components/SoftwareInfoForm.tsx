import React from 'react';
import { Form, Input, Select, Button, Card } from 'antd';
import { useI18n } from '@/i18n';
import type { SoftwareInfo } from '@/types/detect.types';

const { TextArea } = Input;
const { Option } = Select;

interface SoftwareInfoFormProps {
  onNext: (data: SoftwareInfo) => void;
}

export const SoftwareInfoForm: React.FC<SoftwareInfoFormProps> = ({ onNext }) => {
  const { t } = useI18n();
  const [form] = Form.useForm();

  const handleSubmit = (values: SoftwareInfo) => {
    onNext(values);
  };

  return (
    <Card title={t.detect.softwareInfo.title} className="software-info-form">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="softName"
          label={t.detect.softwareInfo.name}
          rules={[{ required: true, message: t.detect.softwareInfo.nameRequired }]}
        >
          <Input placeholder={t.detect.softwareInfo.namePlaceholder} />
        </Form.Item>

        <Form.Item
          name="softCategory"
          label={t.detect.softwareInfo.category}
          rules={[{ required: true, message: t.detect.softwareInfo.categoryRequired }]}
        >
          <Select placeholder={t.detect.softwareInfo.categoryPlaceholder}>
            {t.constants.softwareCategories.map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="softTitle"
          label={t.detect.softwareInfo.titleLabel}
          rules={[{ required: true, message: t.detect.softwareInfo.titleRequired }]}
        >
          <Input placeholder={t.detect.softwareInfo.titlePlaceholder} />
        </Form.Item>

        <Form.Item
          name="softBrife"
          label={t.detect.softwareInfo.description}
          rules={[{ required: true, message: t.detect.softwareInfo.descriptionRequired }]}
        >
          <TextArea
            rows={4}
            placeholder={t.detect.softwareInfo.descriptionPlaceholder}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {t.detect.softwareInfo.submit}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
