import React, { useState, useEffect } from 'react';
import { Card, Checkbox, Button, Space } from 'antd';
import { useI18n } from '@/i18n';
import type { DetectOptionKey } from '@/types/detect.types';
import './DetectOptions.css';

interface DetectOptionsProps {
  onNext: (selectedOptions: DetectOptionKey[]) => void;
  onBack: () => void;
  loading?: boolean;
}

export const DetectOptions: React.FC<DetectOptionsProps> = ({
  onNext,
  onBack,
  loading = false,
}) => {
  const { t } = useI18n();
  const [selectedOptions, setSelectedOptions] = useState<DetectOptionKey[]>([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);

  useEffect(() => {
    const detectOptions = t.constants.detectOptions;
    setIndeterminate(
      selectedOptions.length > 0 && selectedOptions.length < detectOptions.length
    );
    setCheckAll(selectedOptions.length === detectOptions.length);
  }, [selectedOptions, t]);

  const handleOptionChange = (key: DetectOptionKey, checked: boolean) => {
    if (checked) {
      setSelectedOptions([...selectedOptions, key]);
    } else {
      setSelectedOptions(selectedOptions.filter((item) => item !== key));
    }
  };

  const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOptions(t.constants.detectOptions.map((item) => item.key as DetectOptionKey));
    } else {
      setSelectedOptions([]);
    }
  };

  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      return;
    }
    onNext(selectedOptions);
  };

  return (
    <Card title={t.detect.options.title} className="detect-options-card">
      <div className="detect-content">
        <div className="options-list">
          {t.constants.detectOptions.map((option) => (
            <div key={option.key} className="option-item">
              <Checkbox
                checked={selectedOptions.includes(option.key as DetectOptionKey)}
                onChange={(e) =>
                  handleOptionChange(option.key as DetectOptionKey, e.target.checked)
                }
              >
                {option.label}
              </Checkbox>
            </div>
          ))}
        </div>

        <div className="check-all-section">
          <Checkbox
            indeterminate={indeterminate}
            checked={checkAll}
            onChange={handleCheckAll}
          >
            {t.detect.options.selectAll}
          </Checkbox>
        </div>

        <div className="action-buttons">
          <Space>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={selectedOptions.length === 0 || loading}
              loading={loading}
            >
              {t.detect.options.submit}
            </Button>
            <Button onClick={onBack} disabled={loading}>
              {t.detect.options.back}
            </Button>
          </Space>
        </div>
      </div>
    </Card>
  );
};
