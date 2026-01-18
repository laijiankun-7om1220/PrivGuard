import React, { useState } from 'react';
import { Upload, Radio, Input, Card, message } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useI18n } from '@/i18n';
import { parseFile } from '@/utils/fileParser';

const { Dragger } = Upload;
const { TextArea } = Input;

export type UploadMode = 'file' | 'text';

interface FileUploadProps {
  onContentChange: (content: string) => void;
  onModeChange: (mode: UploadMode) => void;
  mode: UploadMode;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onContentChange,
  onModeChange,
  mode,
}) => {
  const { t } = useI18n();
  const [fileList, setFileList] = useState<any[]>([]);
  const [textContent, setTextContent] = useState('');

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    beforeUpload: async (file) => {
      try {
        const content = await parseFile(file);
        onContentChange(content);
        setFileList([file]);
        message.success(t.detect.fileUpload.uploadSuccess);
        return false; // 阻止自动上传
      } catch (error: any) {
        message.error(error.message || t.detect.fileUpload.fileParseError);
        return false;
      }
    },
    onRemove: () => {
      setFileList([]);
      onContentChange('');
    },
    accept: '.doc,.docx,.txt,.pdf',
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextContent(value);
    onContentChange(value);
  };

  return (
    <Card title={t.detect.fileUpload.title} className="file-upload-card">
      <Radio.Group
        value={mode}
        onChange={(e) => onModeChange(e.target.value)}
        style={{ marginBottom: 16 }}
      >
        <Radio value="file">{t.detect.fileUpload.uploadFile}</Radio>
        <Radio value="text">{t.detect.fileUpload.pasteText}</Radio>
      </Radio.Group>

      {mode === 'file' ? (
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{t.detect.fileUpload.uploadHint}</p>
          <p className="ant-upload-hint">{t.detect.fileUpload.fileFormats}</p>
        </Dragger>
      ) : (
        <TextArea
          rows={10}
          placeholder={t.detect.fileUpload.textPlaceholder}
          value={textContent}
          onChange={handleTextChange}
          showCount
        />
      )}
    </Card>
  );
};
