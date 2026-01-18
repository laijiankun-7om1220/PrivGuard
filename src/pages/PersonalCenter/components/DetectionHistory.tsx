import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Space, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  EyeOutlined, 
  DownloadOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { useI18n } from '@/i18n';
import { detectService } from '@/services/detect.service';
import type { DetectRecord, SelectedOptionItem } from '@/types/detect.types';
import type { AIDetectResult } from '@/services/detectAI.service';
import { AI_MODELS } from '@/services/detectAI.service';
import dayjs from 'dayjs';
import './DetectionHistory.css';

interface DetectionHistoryProps {
  onRefresh?: () => void;
}

export const DetectionHistory: React.FC<DetectionHistoryProps> = () => {
  const { t } = useI18n();
  const [records, setRecords] = useState<DetectRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string>('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detectResult, setDetectResult] = useState<AIDetectResult | null>(null);
  const [selectedSoftName, setSelectedSoftName] = useState<string>('');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await detectService.getDetectRecords();
      setRecords(data);
    } catch (error) {
      message.error(t.personalCenter.detectionHistory.loadFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (recordId: string) => {
    setSelectedRecordId(recordId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await detectService.deleteDetectRecord(selectedRecordId);
      message.success(t.personalCenter.detectionHistory.deleteSuccess);
      setDeleteModalOpen(false);
      loadRecords();
    } catch (error) {
      message.error(t.personalCenter.detectionHistory.deleteFailed);
    }
  };

  const handleViewDetail = async (softName: string) => {
    setSelectedSoftName(softName);
    setDetailModalOpen(true);
    setDetailLoading(true);
    setDetectResult(null);

    try {
      const result = await detectService.getDetectResult(softName);
      console.log('getDetectResult result:', result);
      
      // 如果 result 存在
      if (result) {
        // 如果 detectResult 存在，解析它
        if (result.detectResult) {
          if (typeof result.detectResult === 'string') {
            try {
              setDetectResult(JSON.parse(result.detectResult));
            } catch (e) {
              console.warn('解析 detectResult 失败', e);
              setDetectResult({}); // 设置为空对象，而不是关闭弹窗
            }
          } else {
            setDetectResult(result.detectResult);
          }
        } else {
          // detectResult 不存在，设置为空对象，显示空结果
          console.warn('检测结果不存在，result:', result);
          setDetectResult({});
        }
      } else {
        // result 为 null，说明没有找到记录
        message.warning(t.personalCenter.detectionHistory.resultNotFound);
        setDetailModalOpen(false);
      }
    } catch (error) {
      console.error('查看详情错误:', error);
      message.error(t.personalCenter.detectionHistory.loadResultFailed);
      setDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const detailColumns: ColumnsType<any> = [
    {
      title: t.personalCenter.detectionHistory.detailItem,
      dataIndex: 'name',
      key: 'name',
      width: '60%',
    },
    {
      title: t.personalCenter.detectionHistory.detailStatus,
      dataIndex: 'passed',
      key: 'passed',
      align: 'center',
      width: '40%',
      render: (passed: boolean) => {
        return (
          <Tag
            icon={passed ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            color={passed ? 'success' : 'error'}
          >
            {passed ? t.personalCenter.detectionHistory.detailPassed : t.personalCenter.detectionHistory.detailFailed}
          </Tag>
        );
      },
    },
  ];

  const detailData = detectResult
    ? t.constants.aiDetectCategories.map((category) => ({
        key: category.key,
        name: category.name,
        passed: detectResult[category.key] || false,
      }))
    : [];

  // 根据模型值获取显示名称
  const getModelLabel = (modelValue: string | undefined): string => {
    if (!modelValue) return '-';
    const model = AI_MODELS.find((m) => m.value === modelValue);
    return model ? model.label : modelValue;
  };

  // 导出JSON文件
  const handleExport = async (record: DetectRecord) => {
    try {
      // 获取检测详情数据
      const detectResult = await detectService.getDetectResult(record.softName);
      let detailResult: AIDetectResult | null = null;
      
      if (detectResult && detectResult.detectResult) {
        if (typeof detectResult.detectResult === 'string') {
          detailResult = JSON.parse(detectResult.detectResult);
        } else {
          detailResult = detectResult.detectResult;
        }
      }

      // 解析selectedOptions（从detect表）
      let selectedOptions: SelectedOptionItem[] = [];
      if (record.selectedOptions) {
        if (typeof record.selectedOptions === 'string') {
          try {
            selectedOptions = JSON.parse(record.selectedOptions);
          } catch (e) {
            console.warn('解析 selectedOptions JSON 失败', e);
            selectedOptions = [];
          }
        } else if (Array.isArray(record.selectedOptions)) {
          selectedOptions = record.selectedOptions;
        }
      }

      // 构建导出数据
      const aiModelValue = typeof record.aiModel === 'string' ? record.aiModel : undefined;
      const exportData = {
        // 表格数据（检测记录基本信息）
        softName: record.softName,
        softCategory: typeof record.softCategory === 'string' ? record.softCategory : '',
        softTitle: typeof record.softTitle === 'string' ? record.softTitle : '',
        softBrife: typeof record.softBrife === 'string' ? record.softBrife : '',
        aiModel: aiModelValue || '',
        aiModelLabel: getModelLabel(aiModelValue),
        detectTime: record.updatedAt,
        createdAt: record.createdAt,
        // 选中的检测选项
        selectedOptions: selectedOptions,
        // 检测详情数据（用对象包裹）
        detectDetails: detailResult || {},
      };

      // 转换为JSON字符串并格式化
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // 创建Blob并下载
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${record.softName}_${dayjs(record.updatedAt).format('YYYY-MM-DD_HH-mm-ss')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success(t.personalCenter.detectionHistory.exportSuccess);
    } catch (error) {
      console.error('Export error:', error);
      message.error(t.personalCenter.detectionHistory.exportFailed);
    }
  };

  const columns: ColumnsType<DetectRecord> = [
    {
      title: t.personalCenter.detectionHistory.softwareName,
      dataIndex: 'softName',
      key: 'softName',
      align: 'center',
    },
    {
      title: t.personalCenter.detectionHistory.aiModel,
      dataIndex: 'aiModel',
      key: 'aiModel',
      align: 'center',
      render: (text: string | boolean | undefined) => {
        const modelValue = typeof text === 'string' ? text : undefined;
        return getModelLabel(modelValue);
      },
    },
    {
      title: t.personalCenter.detectionHistory.detectTime,
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      align: 'center',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateB - dateA;
      },
    },
    {
      title: t.personalCenter.detectionHistory.actions,
      key: 'action',
      align: 'center',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.softName)}
          >
            {t.personalCenter.detectionHistory.viewDetail}
          </Button>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleExport(record)}
          >
            {t.personalCenter.detectionHistory.export}
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.objectId)}
          >
            {t.personalCenter.detectionHistory.delete}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={records}
        rowKey="objectId"
        loading={loading}
        bordered
        size="middle"
        rowClassName={(_, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => t.personalCenter.detectionHistory.paginationTotal.replace('{total}', total.toString()),
          pageSizeOptions: ['10', '20', '50'],
        }}
      />

      <Modal
        title={t.personalCenter.detectionHistory.deleteConfirmTitle}
        open={deleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        okText={t.common.confirm}
        cancelText={t.common.cancel}
      >
        <p>{t.personalCenter.detectionHistory.deleteConfirmMessage}</p>
      </Modal>

      <Modal
        title={t.personalCenter.detectionHistory.detailTitle.replace('{name}', selectedSoftName)}
        open={detailModalOpen}
        onCancel={() => {
          setDetailModalOpen(false);
          setDetectResult(null);
        }}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            {t.personalCenter.detectionHistory.close}
          </Button>,
        ]}
        width={700}
      >
        {detailLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>{t.personalCenter.detectionHistory.detailLoading}</div>
        ) : (
          <Table
            columns={detailColumns}
            dataSource={detailData}
            rowKey="key"
            pagination={false}
            size="small"
          />
        )}
      </Modal>
    </div>
  );
};
