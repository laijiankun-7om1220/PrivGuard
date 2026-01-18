/**
 * 隐私政策检测 Prompt
 * 用于调用 AI 进行文本分析
 * 提示词模板从环境变量 VITE_AI_DETECT_PROMPT_TEMPLATE 读取
 */

/**
 * 从环境变量获取提示词模板
 */
const getPromptTemplate = (): string => {
  const envTemplate = import.meta.env.VITE_AI_DETECT_PROMPT_TEMPLATE;
  
  if (!envTemplate) {
    throw new Error(
      'VITE_AI_DETECT_PROMPT_TEMPLATE 未配置。请在 .env 文件中设置 AI 检测提示词模板。' +
      '提示词模板必须包含 {{TEXT_CONTENT}} 占位符。'
    );
  }
  
  // 将环境变量中的 \n 转换为实际的换行符
  const template = envTemplate.replace(/\\n/g, '\n');
  
  // 验证模板是否包含必需的占位符
  if (!template.includes('{{TEXT_CONTENT}}')) {
    throw new Error(
      '提示词模板必须包含 {{TEXT_CONTENT}} 占位符，用于替换实际检测的文本内容。'
    );
  }
  
  return template;
};

// 导出提示词模板（从环境变量读取）
export const DETECT_PROMPT_TEMPLATE = getPromptTemplate();

/**
 * 构建完整的检测 prompt
 */
export const buildDetectPrompt = (text: string): string => {
  return DETECT_PROMPT_TEMPLATE.replace('{{TEXT_CONTENT}}', text);
};
