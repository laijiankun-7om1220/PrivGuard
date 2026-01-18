import React from 'react';
import { Card, List, Tag, Button, Result } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useI18n } from '@/i18n';
import type { DetectOptionKey, SoftwareInfo } from '@/types/detect.types';
import type { AIDetectResult } from '@/services/detectAI.service';
import './DetectResult.css';

interface DetectResultProps {
  softwareInfo: SoftwareInfo;
  selectedOptions: DetectOptionKey[];
  detectResult: AIDetectResult;
  onBack: () => void;
}

export const DetectResult: React.FC<DetectResultProps> = ({
  softwareInfo,
  selectedOptions,
  detectResult,
  onBack,
}) => {
  const { t } = useI18n();
  // 显示所有14个AI检测项的结果
  const resultItems = t.constants.aiDetectCategories.map((category) => {
    const passed = detectResult[category.key];

    return {
      key: category.key,
      label: category.name,
      passed: passed !== undefined ? passed : null,
    };
  });

  const passedCount = resultItems.filter((item) => item.passed === true).length;
  const totalCount = resultItems.length;

  return (
    <Card title={t.detect.result.title} className="detect-result-card">
      <div className="result-summary">
        <Result
          status={passedCount === totalCount ? 'success' : 'warning'}
          title={t.detect.result.summary.replace('{passed}', String(passedCount)).replace('{total}', String(totalCount))}
        />
      </div>

      <List
        dataSource={resultItems}
        renderItem={(item) => (
          <List.Item>
            <div className="result-item">
              <span className="result-label">• {item.label}</span>
              {item.passed !== null && (
                <Tag
                  icon={item.passed ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                  color={item.passed ? 'success' : 'error'}
                >
                  {item.passed ? t.personalCenter.detectionHistory.detailPassed : t.personalCenter.detectionHistory.detailFailed}
                </Tag>
              )}
              {item.passed === null && (
                <Tag color="default" style={{ color: '#808080' }}>
                  {t.personalCenter.detectionHistory.detailNotDetected}
                </Tag>
              )}
            </div>
          </List.Item>
        )}
      />

      <div className="result-actions">
        <Button type="primary" onClick={onBack}>
          {t.detect.result.back}
        </Button>
      </div>
    </Card>
  );
};
