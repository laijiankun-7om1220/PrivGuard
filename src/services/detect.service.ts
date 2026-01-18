import { initializeBmob } from './bmob';
import type { SoftwareInfo, DetectRecord, DetectOptionKey, SelectedOptionItem } from '@/types/detect.types';
import type { AIDetectResult } from './detectAI.service';
import { DETECT_OPTIONS } from '@/utils/constants';
import { authService } from './auth.service';

const Bmob = initializeBmob();

export const detectService = {
  async saveDetectRecord(
    softwareInfo: SoftwareInfo,
    selectedOptions: DetectOptionKey[],
    aiModel: string
  ): Promise<DetectRecord> {
    try {
      // 获取当前登录用户
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.objectId) {
        throw new Error('用户未登录');
      }

      const detectBmob = Bmob.Query('detect');
      detectBmob.set('softName', softwareInfo.softName);
      detectBmob.set('softCategory', softwareInfo.softCategory);
      detectBmob.set('softTitle', softwareInfo.softTitle);
      detectBmob.set('softBrife', softwareInfo.softBrife);
      detectBmob.set('aiModel', aiModel); // 保存使用的AI模型到detect表
      detectBmob.set('userId', currentUser.objectId); // 关联当前用户ID

      // 将所有检测选项转换为JSON格式（包括选中的和未选中的）
      // 格式: [{"key":"brief","label":"简介合规性","value":true}, {"key":"title","label":"标题合规性","value":false}, ...]
      const allOptionsArray: SelectedOptionItem[] = DETECT_OPTIONS.map((option) => {
        const isSelected = selectedOptions.includes(option.key as DetectOptionKey);
        return {
          key: option.key as DetectOptionKey,
          label: option.label,
          value: isSelected, // 根据是否在selectedOptions中决定value
        };
      });

      // 将数组转换为JSON字符串保存
      detectBmob.set('selectedOptions', JSON.stringify(allOptionsArray));

      const result = await detectBmob.save();
      return result;
    } catch (error) {
      console.error('Save detect record error:', error);
      throw error;
    }
  },

  async getDetectRecords(): Promise<DetectRecord[]> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.objectId) {
        throw new Error('用户未登录');
      }

      // 调试日志
      console.log('=== getDetectRecords 调试信息 ===');
      console.log('currentUser.role:', currentUser.role, 'type:', typeof currentUser.role);
      console.log('currentUser.objectId:', currentUser.objectId, 'type:', typeof currentUser.objectId);

      const detectBmob = Bmob.Query('detect');
      
      // 如果不是管理员，只查询当前用户的数据
      if (currentUser.role !== 'admin') {
        console.log('设置 userId 过滤条件:', currentUser.objectId);
        detectBmob.equalTo('userId', '==', currentUser.objectId);
      } else {
        console.log('管理员身份，不过滤 userId');
      }
      // 管理员不添加过滤条件，可以查询所有数据

      const res = await detectBmob.find();
      
      console.log('reresresress', res);
      
      // 解析selectedOptions JSON字符串
      const records = res.map((record: any) => {
        if (record.selectedOptions && typeof record.selectedOptions === 'string') {
          try {
            record.selectedOptions = JSON.parse(record.selectedOptions);
          } catch (e) {
            console.warn('解析 selectedOptions JSON 失败', e);
            record.selectedOptions = [];
          }
        }
        return record;
      });
      
      // 按更新时间降序排序
      records.sort((a: DetectRecord, b: DetectRecord) => {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateB - dateA;
      });

      return records.slice(0, 30); // 只返回前30条
    } catch (error) {
      console.error('Get detect records error:', error);
      throw error;
    }
  },

  async deleteDetectRecord(objectId: string): Promise<void> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.objectId) {
        throw new Error('用户未登录');
      }

      // 先查询记录，检查权限
      const query = Bmob.Query('detect');
      const record = await query.get(objectId);
      
      // 如果不是管理员，只能删除自己的记录
      if (currentUser.role !== 'admin' && record.userId !== currentUser.objectId) {
        throw new Error('无权删除此记录');
      }

      await query.destroy(objectId);
    } catch (error) {
      console.error('Delete detect record error:', error);
      throw error;
    }
  },

  async getDetectResult(softName: string): Promise<any> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.objectId) {
        throw new Error('用户未登录');
      }

      // 调试日志
      console.log('=== getDetectResult 调试信息 ===');
      console.log('softName:', softName, 'type:', typeof softName);
      console.log('currentUser.role:', currentUser.role, 'type:', typeof currentUser.role);
      console.log('currentUser.objectId:', currentUser.objectId, 'type:', typeof currentUser.objectId);

      const detectResultBmob = Bmob.Query('detectResult2');
      
      // 设置 softName 条件
      console.log('准备设置 softName 条件...');
      detectResultBmob.equalTo('softName', '==', softName);
      console.log('softName 条件设置成功');
      
      // 如果不是管理员，添加 userId 过滤
      if (currentUser.role !== 'admin') {
        console.log('准备设置 userId 过滤条件:', currentUser.objectId);
        detectResultBmob.equalTo('userId', '==', currentUser.objectId);
        console.log('userId 条件设置成功');
      } else {
        console.log('管理员身份，不过滤 userId');
      }
      // 管理员不添加过滤条件，可以查询所有数据
      
      console.log('准备执行查询...');
      const res = await detectResultBmob.find();
      console.log('查询成功，结果数量:', res.length);
      
      if (res.length > 0) {
        const item = res[0];
        
        // 如果 detectResult 字段是 JSON 字符串，解析它
        if (item.detectResult && typeof item.detectResult === 'string') {
          try {
            item.detectResult = JSON.parse(item.detectResult);
          } catch (e) {
            console.warn('解析 detectResult JSON 失败', e);
          }
        }
        return item;
      }
      
      return null;
    } catch (error) {
      console.error('Get detect result error:', error);
      throw error;
    }
  },

  /**
   * 保存 AI 检测结果到数据库
   * 注意：由于 Bmob 表字段数量限制，将检测结果保存为 JSON 字符串
   */
  async saveDetectResult(
    softwareInfo: SoftwareInfo,
    aiResult: AIDetectResult,
    _aiModel: string // 保留参数以保持接口一致性，但不保存到数据库
  ): Promise<void> {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.objectId) {
        throw new Error('用户未登录');
      }

      const detectResultBmob = Bmob.Query('detectResult2');
      detectResultBmob.set('softName', softwareInfo.softName);
      detectResultBmob.set('softCategory', softwareInfo.softCategory);
      detectResultBmob.set('softTitle', softwareInfo.softTitle);
      detectResultBmob.set('softBrife', softwareInfo.softBrife);
      detectResultBmob.set('userId', currentUser.objectId); // 关联当前用户ID

      // 将检测结果保存为 JSON 字符串，避免字段数量限制
      const resultJson = JSON.stringify(aiResult);
      detectResultBmob.set('detectResult', resultJson);

      await detectResultBmob.save();
    } catch (error: any) {
      console.error('Save detect result error:', error);
      
      // 如果是字段数量限制错误，提供更友好的错误信息
      if (error?.error === 'Fields of the table can add has reached to limit' || error?.code === 1004) {
        throw new Error('数据库表字段数量已达上限，请使用 JSON 格式存储结果');
      }
      
      throw error;
    }
  },
};
