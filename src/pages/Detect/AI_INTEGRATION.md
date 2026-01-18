# AI 服务接入指南

## 当前实现

当前使用 DeepSeek AI，实现位于 `src/services/detectAI.service.ts`

## 接入其他 AI 服务

### 1. 实现接口

在 `src/services/detectAI.service.ts` 中，主要需要实现：

```typescript
export const detectAIService = {
  async analyzeText(text: string, model: string): Promise<AIDetectResult> {
    // 1. 构建 prompt（使用 buildDetectPrompt）
    // 2. 调用 AI API
    // 3. 解析返回的 JSON 数组
    // 4. 转换为 AIDetectResult 格式返回
  }
}
```

### 2. 返回数据格式

`AIDetectResult` 类型定义：
```typescript
{
  [key: string]: boolean;  // key 为检测类别（如 "intro", "data_type"），value 为检测结果
}
```

### 3. 核心步骤

1. **构建 Prompt**：使用 `buildDetectPrompt(text)` 生成提示词
2. **调用 API**：根据目标 AI 服务的 API 文档调用
3. **解析结果**：将 API 返回解析为包含 14 个检测项的数组
4. **格式转换**：转换为 `{ [key]: boolean }` 格式

### 4. 示例：接入 OpenAI

```typescript
import OpenAI from 'openai';
import { buildDetectPrompt } from '@/utils/detectPrompt';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export const detectAIService = {
  async analyzeText(text: string): Promise<AIDetectResult> {
    const prompt = buildDetectPrompt(text);
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });
    
    const result = JSON.parse(response.choices[0].message.content || '[]');
    // 转换为 AIDetectResult 格式
    return result.reduce((acc: AIDetectResult, item: any) => {
      acc[item.key] = item.value === 1;
      return acc;
    }, {});
  }
}
```

### 5. 注意事项

- Prompt 模板在 `src/utils/detectPrompt.ts`，可根据需要调整
- 确保返回的 JSON 格式与预期一致（14 个检测项）
- 在 `.env` 中添加新的 API Key 环境变量
