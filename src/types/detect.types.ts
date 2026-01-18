export interface SoftwareInfo {
  softName: string;
  softCategory: string;
  softTitle: string;
  softBrife: string;
}

export type DetectOptionKey =
  | 'brief'
  | 'title'
  | 'developer'
  | 'action'
  | 'processing'
  | 'dataShare'
  | 'dataSecurity'
  | 'user'
  | 'dataSafe'
  | 'international'
  | 'privacy'
  | 'law'
  | 'advertisement'
  | 'child'
  | 'link';

export interface DetectOption {
  key: DetectOptionKey;
  label: string;
}

// 检测选项项（用于JSON存储）
export interface SelectedOptionItem {
  key: DetectOptionKey;
  label: string;
  value: boolean;
}

export interface DetectRecord {
  objectId: string;
  softName: string;
  softCategory?: string;
  softTitle?: string;
  softBrife?: string;
  aiModel?: string;
  userId?: string; // 关联的用户ID
  selectedOptions?: string | SelectedOptionItem[]; // JSON字符串或解析后的数组
  createdAt: string;
  updatedAt: string;
  [key: string]: string | boolean | SelectedOptionItem[] | undefined;
}

export interface DetectResult {
  [key: string]: boolean;
}
