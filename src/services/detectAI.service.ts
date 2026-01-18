import OpenAI from 'openai';
import { buildDetectPrompt } from '@/utils/detectPrompt';
import { smartPreprocessText } from '@/utils/textPreprocessor';

// 从环境变量获取 API Key
const deepseekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
const qwenApiKey = import.meta.env.VITE_QWEN_API_KEY;
const doubaoApiKey = import.meta.env.VITE_DOUBAO__API_KEY;

if (!deepseekApiKey) {
  console.warn('VITE_DEEPSEEK_API_KEY 未配置，请检查 .env 文件');
}
if (!qwenApiKey) {
  console.warn('VITE_QWEN_API_KEY 未配置，请检查 .env 文件');
}
if (!doubaoApiKey) {
  console.warn('VITE_DOUBAO__API_KEY 未配置，请检查 .env 文件');
}

// 初始化各个AI服务的客户端
const deepseekClient = deepseekApiKey
  ? new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: deepseekApiKey,
      dangerouslyAllowBrowser: true,
    })
  : null;

const qwenClient = qwenApiKey
  ? new OpenAI({
      baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      apiKey: qwenApiKey,
      dangerouslyAllowBrowser: true,
    })
  : null;

const doubaoClient = doubaoApiKey
  ? new OpenAI({
      baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
      apiKey: doubaoApiKey,
      dangerouslyAllowBrowser: true,
    })
  : null;

export interface AIDetectResultItem {
  key: string;
  name: string;
  value: 0 | 1;
}

export interface AIDetectResult {
  [key: string]: boolean; // key: AI检测类别key, value: 检测结果(true/false)
}

// 所有可用的模型列表
export const AI_MODELS = [
  // DeepSeek 模型
  {
    value: 'deepseek-chat',
    provider: 'deepseek',
    label: 'DeepSeek Chat (非思考模式)',
    description: '快速响应，适合常规分析',
  },
  {
    value: 'deepseek-reasoner',
    provider: 'deepseek',
    label: 'DeepSeek Reasoner (思考模式)',
    description: '深度思考，适合复杂分析',
  },
  // 通义千问模型
  {
    value: 'qwen-plus',
    provider: 'qwen',
    label: '通义千问 Plus',
    description: '更强的理解能力，适合复杂分析',
  },
  // 豆包模型
  {
    value: 'doubao-seed-1-6-251015',
    provider: 'doubao',
    label: '豆包 Seed',
    description: '全新多模态深度思考模型，更强模型效果，服务复杂任务和有挑战场景',
  },
] as const;

export type AIModel = typeof AI_MODELS[number]['value'];
export type AIProvider = 'deepseek' | 'qwen' | 'doubao';

/**
 * 根据模型获取对应的客户端和提供者
 */
function getClientAndProvider(model: AIModel): { client: OpenAI | null; provider: AIProvider } {
  const modelConfig = AI_MODELS.find((m) => m.value === model);
  if (!modelConfig) {
    throw new Error(`未知的模型: ${model}`);
  }

  const provider = modelConfig.provider;
  let client: OpenAI | null = null;

  switch (provider) {
    case 'deepseek':
      client = deepseekClient;
      if (!client) {
        throw new Error('DeepSeek API Key 未配置，请在 .env 文件中设置 VITE_DEEPSEEK_API_KEY');
      }
      break;
    case 'qwen':
      client = qwenClient;
      if (!client) {
        throw new Error('通义千问 API Key 未配置，请在 .env 文件中设置 VITE_QWEN_API_KEY');
      }
      break;
    case 'doubao':
      client = doubaoClient;
      if (!client) {
        throw new Error('豆包 API Key 未配置，请在 .env 文件中设置 VITE_DOUBAO__API_KEY');
      }
      break;
    default:
      throw new Error(`不支持的AI提供者: ${provider}`);
  }

  return { client, provider };
}

/**
 * 使用 AI 分析隐私政策文本
 */
export const detectAIService = {
  async analyzeText(text: string, model: AIModel = 'deepseek-chat'): Promise<AIDetectResult> {
    try {
      // 预处理文本内容，提高 LLM 识别准确率
      const processedText = smartPreprocessText(text, {
        extractKeySections: false, // 可以根据需要开启关键段落提取
        maxLength: 50000, // 如果文本过长，限制长度（保留完整句子）
      });
      
      // 构建 prompt
      const prompt = buildDetectPrompt(processedText);

      // 获取对应的客户端
      const { client } = getClientAndProvider(model);

      if (!client) {
        throw new Error('AI 客户端未初始化');
      }

      const response = await client.chat.completions.create({
        model: model, // 使用传入的模型
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3, // 降低温度以获得更确定的结果
        stream: false, // 非流式输出
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('AI 返回内容为空');
      }

      // 解析返回的 JSON（content 可能是 JSON 字符串，需要解析两次）
      let parsedContent: any;
      try {
        // 第一次解析：将字符串解析为 JSON
        const firstParse = JSON.parse(content);
        
        // 如果第一次解析的结果是字符串，需要再次解析
        if (typeof firstParse === 'string') {
          parsedContent = JSON.parse(firstParse);
        } else {
          parsedContent = firstParse;
        }
      } catch (parseError) {
        // 如果解析失败，尝试提取 JSON 数组
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            parsedContent = JSON.parse(jsonMatch[0]);
          } catch (e) {
            throw new Error('无法解析 AI 返回的 JSON 结果');
          }
        } else {
          throw new Error('AI 返回格式不符合预期，期望 JSON 数组');
        }
      }

      // 处理返回结果
      // 如果返回的是对象，尝试找到数组
      let resultArray: AIDetectResultItem[] = [];
      if (Array.isArray(parsedContent)) {
        resultArray = parsedContent;
      } else if (parsedContent.results && Array.isArray(parsedContent.results)) {
        resultArray = parsedContent.results;
      } else if (parsedContent.data && Array.isArray(parsedContent.data)) {
        resultArray = parsedContent.data;
      } else {
        throw new Error('AI 返回格式不符合预期，期望 JSON 数组');
      }

      // 转换为结果对象
      const result: AIDetectResult = {};
      resultArray.forEach((item) => {
        if (item.key && (item.value === 0 || item.value === 1)) {
          result[item.key] = item.value === 1;
        }
      });

      // 确保所有14个类别都有结果
      const requiredKeys = [
        'intro',
        'data_type',
        'collection_method',
        'usage_purpose',
        'data_sharing',
        'third_party',
        'storage_security',
        'retention_deletion',
        'user_rights',
        'legal_compliance',
        'advertising',
        'children_privacy',
        'policy_update',
        'contact',
      ];

      requiredKeys.forEach((key) => {
        if (result[key] === undefined) {
          result[key] = false; // 如果没有结果，默认为 false
        }
      });

      return result;
    } catch (error) {
      console.error('AI 检测错误:', error);
      throw new Error(
        `检测失败: ${error instanceof Error ? error.message : '未知错误'}`
      );
    }
  },
};
