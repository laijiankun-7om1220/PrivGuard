import React, { useState } from 'react';
import { Steps, Card, Button, Space, Select } from 'antd';
import { SoftwareInfoForm } from './components/SoftwareInfoForm';
import { FileUpload, UploadMode } from './components/FileUpload';
import { DetectOptions } from './components/DetectOptions';
import { DetectResult } from './components/DetectResult';
import { LoadingOverlay } from '@/components/common/LoadingOverlay';
import { detectService } from '@/services/detect.service';
import {
  detectAIService,
  type AIDetectResult,
  type AIModel,
} from '@/services/detectAI.service';
import { useI18n } from '@/i18n';
import { message } from 'antd';
import type { SoftwareInfo, DetectOptionKey } from '@/types/detect.types';
import './Detect.css';

type Step = 'info' | 'upload' | 'options' | 'result';

export const Detect: React.FC = () => {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [softwareInfo, setSoftwareInfo] = useState<SoftwareInfo | null>(null);
  const [uploadContent, setUploadContent] = useState('');
  const [uploadMode, setUploadMode] = useState<UploadMode>('file');
  const [selectedOptions, setSelectedOptions] = useState<DetectOptionKey[]>([]);
  const [detectResult, setDetectResult] = useState<AIDetectResult>({});
  const [detecting, setDetecting] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('deepseek-chat');

  const handleSoftwareInfoNext = (data: SoftwareInfo) => {
    setSoftwareInfo(data);
    setCurrentStep('upload');
  };

  const handleUploadNext = () => {
    if (!uploadContent.trim()) {
      message.warning(uploadMode === 'file' ? t.detect.actions.uploadFileFirst : t.detect.actions.inputTextFirst);
      return;
    }
    setCurrentStep('options');
  };

  const handleOptionsNext = async (options: DetectOptionKey[]) => {
    if (!softwareInfo || !uploadContent.trim()) {
      message.error(t.detect.actions.uploadContentFirst);
      return;
    }

    try {
      setSelectedOptions(options);
      setDetecting(true);

      // 调用 AI 进行检测（检测所有14个类别）
      const aiResult = await detectAIService.analyzeText(uploadContent, selectedModel);

      setDetectResult(aiResult);

      // 保存检测记录（软件信息 + 选中的选项 + AI模型）
      await detectService.saveDetectRecord(softwareInfo, options, selectedModel);

      // 保存 AI 检测结果
      await detectService.saveDetectResult(softwareInfo, aiResult, selectedModel);

      message.success(t.detect.actions.detectComplete);
      setCurrentStep('result');
    } catch (error: any) {
      message.error(error.message || t.detect.actions.detectFailed);
    } finally {
      setDetecting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'upload') {
      setCurrentStep('info');
    } else if (currentStep === 'options') {
      setCurrentStep('upload');
    } else if (currentStep === 'result') {
      setCurrentStep('options');
    }
  };

  const handleReset = () => {
    setCurrentStep('info');
    setSoftwareInfo(null);
    setUploadContent('');
    setSelectedOptions([]);
  };

  const steps = [
    {
      title: t.detect.steps.info.title,
      description: t.detect.steps.info.description,
    },
    {
      title: t.detect.steps.upload.title,
      description: t.detect.steps.upload.description,
    },
    {
      title: t.detect.steps.options.title,
      description: t.detect.steps.options.description,
    },
    {
      title: t.detect.steps.result.title,
      description: t.detect.steps.result.description,
    },
  ];

  const getCurrentStepIndex = () => {
    const stepMap: Record<Step, number> = {
      info: 0,
      upload: 1,
      options: 2,
      result: 3,
    };
    return stepMap[currentStep];
  };

  return (
    <div className="detect-page">
      <LoadingOverlay
        visible={detecting}
        text={t.detect.actions.detecting}
      />

      <Card className="detect-steps-card">
        <Steps
          current={getCurrentStepIndex()}
          items={steps}
          className="detect-steps"
        />
      </Card>

      {/* 模型选择器 - 在步骤卡片下方，仅在需要时显示 */}
      {(currentStep === 'upload' || currentStep === 'options') && (
        <Card className="model-selector-card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 500, color: '#666' }}>{t.detect.modelSelector}</span>
            <Select
              value={selectedModel}
              onChange={(value) => setSelectedModel(value)}
              style={{ width: 280 }}
              options={t.constants.aiModels.map((model) => ({
                value: model.value,
                label: (
                  <div>
                    <div style={{ fontWeight: 500 }}>{model.label}</div>
                    <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                      {model.description}
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        </Card>
      )}

      <div className="detect-content">
        {currentStep === 'info' && (
          <SoftwareInfoForm onNext={handleSoftwareInfoNext} />
        )}

        {currentStep === 'upload' && (
          <div>
            <FileUpload
              mode={uploadMode}
              onModeChange={setUploadMode}
              onContentChange={setUploadContent}
            />
            <div className="upload-actions">
              <Space>
                <Button type="primary" onClick={handleUploadNext}>
                  {t.detect.actions.next}
                </Button>
                <Button onClick={handleBack}>{t.detect.actions.back}</Button>
              </Space>
            </div>
          </div>
        )}

        {currentStep === 'options' && softwareInfo && (
          <DetectOptions
            onNext={handleOptionsNext}
            onBack={handleBack}
            loading={detecting}
          />
        )}

        {currentStep === 'result' && softwareInfo && (
          <DetectResult
            softwareInfo={softwareInfo}
            selectedOptions={selectedOptions}
            detectResult={detectResult}
            onBack={handleReset}
          />
        )}
      </div>
    </div>
  );
};
