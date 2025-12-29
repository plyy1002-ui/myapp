
export enum Category {
  Productivity = '效率办公',
  Creative = '创意设计',
  Marketing = '市场营销',
  CustomerService = '智能客服',
  Education = '教育学习',
  Personal = '个人生活'
}

export interface Publisher {
  name: string;
  type: 'individual' | 'company';
  avatar?: string;
}

export interface AITemplate {
  id: string;
  name: string;
  description: string;
  category: Category;
  imageUrl: string;
  isNew?: boolean;
  usageCount?: number;
  publisher?: Publisher;
  previewImages?: string[];
}

export interface AIRecommendation {
  intent: string;
  suggestions: AITemplate[];
  explanation: string;
}
