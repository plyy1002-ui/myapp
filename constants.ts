
import { Category, AITemplate } from './types';

export const INITIAL_TEMPLATES: AITemplate[] = [
  {
    id: '1',
    name: 'AI 智能玩具助手',
    description: '您的专属智能伙伴，即刻开启互动体验。',
    category: Category.Creative,
    imageUrl: 'https://picsum.photos/seed/toy/400/300',
    usageCount: 1200
  },
  {
    id: '2',
    name: 'AI 超级员工 04',
    description: '您的 AI 职场超级助手，处理繁琐任务。',
    category: Category.Productivity,
    imageUrl: 'https://picsum.photos/seed/office/400/300',
    isNew: true,
    usageCount: 850
  },
  {
    id: '3',
    name: '亮亮毛绒小店',
    description: '商品上架助手与智能客服，提升转化。',
    category: Category.Marketing,
    imageUrl: 'https://picsum.photos/seed/shop/400/300',
    usageCount: 340
  },
  {
    id: '4',
    name: '智能文档阅读器',
    description: '快速总结和查询任何 PDF 或文档内容。',
    category: Category.Education,
    imageUrl: 'https://picsum.photos/seed/book/400/300',
    usageCount: 2100
  }
];

export const QUICK_CATEGORIES = [
  { name: '智能客服', icon: '🎧' },
  { name: '文案策划', icon: '✍️' },
  { name: '图像生成', icon: '🎨' },
  { name: '数据分析', icon: '📊' }
];
