/**
 * 文本预处理工具
 * 用于优化文本内容，提高 LLM 识别准确率
 * 减少 token 消耗
 */

/**
 * 清理和规范化文本内容
 */
export const preprocessText = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let processedText = text;

  // 1. 统一换行符（将不同系统的换行符统一为 \n）
  processedText = processedText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. 清理多余的空白字符（保留单个空格和换行）
  // 将多个连续空格替换为单个空格
  processedText = processedText.replace(/[ \t]+/g, ' ');
  // 将多个连续换行替换为最多两个换行（保留段落分隔）
  processedText = processedText.replace(/\n{3,}/g, '\n\n');

  // 3. 清理页眉页脚常见模式（页码、页眉等）
  // 移除单独的页码（如 "第 1 页"、"Page 1"）
  processedText = processedText.replace(/第\s*\d+\s*页/g, '');
  processedText = processedText.replace(/Page\s*\d+/gi, '');
  processedText = processedText.replace(/^\d+$/gm, ''); // 移除单独的数字行

  // 4. 清理 PDF 提取可能产生的格式问题
  // 移除 PDF 中常见的特殊字符和格式标记
  processedText = processedText.replace(/[\u200B-\u200D\uFEFF]/g, ''); // 移除零宽字符
  processedText = processedText.replace(/\u00A0/g, ' '); // 将不间断空格替换为普通空格

  // 5. 标准化中文标点符号周围的空格
  // 中文标点前后不需要空格
  processedText = processedText.replace(/\s+([，。、；：！？）】])/g, '$1');
  processedText = processedText.replace(/([（【])\s+/g, '$1');

  // 6. 清理行首行尾空白
  processedText = processedText.split('\n').map(line => line.trim()).join('\n');

  // 7. 移除空行（保留段落之间的单个空行）
  processedText = processedText.replace(/^\s*$/gm, '');

  // 8. 统一段落分隔（确保段落之间只有一个换行）
  processedText = processedText.replace(/\n\n+/g, '\n\n');

  // 9. 清理文本首尾空白
  processedText = processedText.trim();

  return processedText;
};

/**
 * 提取关键段落（可选的高级预处理）
 * 识别隐私政策中的关键章节
 */
export const extractKeySections = (text: string): string => {
  const keyPatterns = [
    /隐私[政策|条款|声明|协议]/i,
    /个人信息[收集|使用|保护|处理]/i,
    /数据[收集|使用|共享|安全|存储]/i,
    /用户[权利|权益|隐私]/i,
    /第三方[服务|共享|合作]/i,
    /法律[依据|法规|合规]/i,
    /联系[方式|我们]/i,
  ];

  const lines = text.split('\n');
  const keySections: string[] = [];
  let currentSection: string[] = [];
  let isKeySection = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      if (currentSection.length > 0) {
        if (isKeySection) {
          keySections.push(currentSection.join('\n'));
        }
        currentSection = [];
        isKeySection = false;
      }
      continue;
    }

    // 检查是否是关键章节标题
    const isTitle = keyPatterns.some(pattern => pattern.test(trimmedLine));
    if (isTitle) {
      if (currentSection.length > 0 && isKeySection) {
        keySections.push(currentSection.join('\n'));
      }
      currentSection = [trimmedLine];
      isKeySection = true;
    } else {
      currentSection.push(trimmedLine);
    }
  }

  if (currentSection.length > 0 && isKeySection) {
    keySections.push(currentSection.join('\n'));
  }

  // 如果提取到关键段落，返回提取的内容；否则返回原文本
  return keySections.length > 0 ? keySections.join('\n\n') : text;
};

/**
 * 智能文本预处理（结合基础清理和关键段落提取）
 */
export const smartPreprocessText = (text: string, options?: {
  extractKeySections?: boolean;
  maxLength?: number;
}): string => {
  let processedText = preprocessText(text);

  // 可选：提取关键段落
  if (options?.extractKeySections) {
    processedText = extractKeySections(processedText);
  }

  // 可选：限制最大长度（保留完整句子）
  if (options?.maxLength && processedText.length > options.maxLength) {
    // 找到最后一个完整句子的位置
    const truncated = processedText.substring(0, options.maxLength);
    const lastSentenceEnd = Math.max(
      truncated.lastIndexOf('。'),
      truncated.lastIndexOf('！'),
      truncated.lastIndexOf('？'),
      truncated.lastIndexOf('.'),
      truncated.lastIndexOf('!'),
      truncated.lastIndexOf('?')
    );
    
    if (lastSentenceEnd > options.maxLength * 0.8) {
      processedText = truncated.substring(0, lastSentenceEnd + 1);
    } else {
      processedText = truncated;
    }
  }

  return processedText;
};
