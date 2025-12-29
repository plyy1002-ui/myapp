
import React, { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { AITemplate } from '@/types';
import { 
  Plus, Zap, X, Settings, Activity, Database, Layers, LayoutGrid, List, Search, 
  ChevronRight, Shield, Bell, HelpCircle, LogOut, CheckCircle2, Loader2, SlidersHorizontal, Image as ImageIcon,
  Flame, Sparkles, AlertTriangle, Copy, Clock, Calendar, UserCircle2, Eye, Crown, MoreHorizontal, Trash2, Edit2
} from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  description: string;
  syncMode: string;
  tags: string[];
  statusColor: string;
  createdAt: number;
  updatedAt?: number; // 更新时间
  imageUrl: string;
  computeUsage: number; // 可用算力百分比 0-100 (<10:红, 10-30:黄, >=30:绿)
  visitCount: number; // 访问记录数量
  owner: string;
  ownerAvatar: string;
  templateName?: string; // 模板名称，如果没有则使用name
  hasUnpublishedVersion?: boolean; // 是否有未发布的版本
  isBoundToAI?: boolean; // 是否绑定AI微卡
  isPublished?: boolean; // 是否已发布
}

// 扩展的热门推荐数据池 (12个)，包含作者信息
const ALL_RECOMMENDATIONS = [
  { id: 'h1', name: '电商金牌客服', tags: ['热门', '营销'], color: 'bg-purple-500', imageUrl: 'https://picsum.photos/seed/hot1/540/960', author: 'Sarah Li' },
  { id: 'h2', name: '日报周报生成器', tags: ['效率', '办公'], color: 'bg-blue-500', imageUrl: 'https://picsum.photos/seed/hot2/540/960', author: 'WorkSmart' },
  { id: 'h3', name: '私域流量管家', tags: ['增长', '社交'], color: 'bg-pink-500', imageUrl: 'https://picsum.photos/seed/hot3/540/960', author: 'GrowthHacker' },
  { id: 'h4', name: '代码审计专家', tags: ['开发', '安全'], color: 'bg-indigo-500', imageUrl: 'https://picsum.photos/seed/hot4/540/960', author: 'DevSecOps' },
  
  { id: 'h5', name: '小红书文案助手', tags: ['创作', '社媒'], color: 'bg-red-500', imageUrl: 'https://picsum.photos/seed/hot5/540/960', author: 'Jenny Chen' },
  { id: 'h6', name: '英语口语教练', tags: ['教育', '语言'], color: 'bg-green-500', imageUrl: 'https://picsum.photos/seed/hot6/540/960', author: 'EduTech Pro' },
  { id: 'h7', name: 'Python脚本生成', tags: ['编程', '工具'], color: 'bg-yellow-500', imageUrl: 'https://picsum.photos/seed/hot7/540/960', author: 'CodeMaster' },
  { id: 'h8', name: '法律咨询顾问', tags: ['专业', '咨询'], color: 'bg-slate-500', imageUrl: 'https://picsum.photos/seed/hot8/540/960', author: 'LawAI' },
  
  { id: 'h9', name: '健身计划制定', tags: ['健康', '生活'], color: 'bg-teal-500', imageUrl: 'https://picsum.photos/seed/hot9/540/960', author: 'FitLife' },
  { id: 'h10', name: 'PPT大纲生成器', tags: ['办公', '效率'], color: 'bg-orange-500', imageUrl: 'https://picsum.photos/seed/hot10/540/960', author: 'OfficeWiz' },
  { id: 'h11', name: '塔罗牌占卜师', tags: ['娱乐', '趣味'], color: 'bg-purple-800', imageUrl: 'https://picsum.photos/seed/hot11/540/960', author: 'MysticAI' },
  { id: 'h12', name: '面试模拟官', tags: ['求职', '模拟'], color: 'bg-blue-700', imageUrl: 'https://picsum.photos/seed/hot12/540/960', author: 'HR Assistant' },
];

// Toast 组件
const ToastNotification = ({ message, visible }: { message: string, visible: boolean }) => (
  <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-[110] transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
    <div className="bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-3">
      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
        <CheckCircle2 size={12} className="text-white" strokeWidth={3} />
      </div>
      <span className="text-sm font-bold pr-1">{message}</span>
    </div>
  </div>
);

// Promo Banner 组件
const PromoBanner = ({ showHint, onHintClick }: { showHint: boolean, onHintClick: () => void }) => (
  <div className="relative mb-2 transition-all">
    <div 
      onClick={onHintClick}
      className="bg-gradient-to-br from-[#eff6ff] to-[#f5f3ff] rounded-[32px] p-6 border border-blue-50/50 shadow-sm relative overflow-visible group cursor-pointer active:scale-[0.98] transition-all z-10"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        
        <h2 className="text-[19px] font-black text-slate-800 mb-2.5 relative z-10 leading-tight">
          管理您的OPC智能中台
        </h2>
        <p className="text-[12px] text-slate-500 font-medium leading-relaxed mb-5 relative z-10 pr-8">
          轻松创建您的 AI 智能伙伴，帮您搞定复杂任务，让工作生活从此简单高效。
        </p>
        
        <div className="flex items-center gap-3 relative z-10">
          <div className="flex -space-x-2.5">
            {[44, 12, 68].map((i) => (
              <div key={i} className="w-7 h-7 rounded-full border-[2px] border-white bg-slate-200 overflow-hidden shadow-sm">
                <img src={`https://picsum.photos/id/${i}/100/100`} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
          <div className="flex items-center text-slate-600 gap-1.5 bg-white/60 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm border border-white/40">
            <span className="text-[11px] font-bold">🔥 11,980 人在使用</span>
          </div>
        </div>

        {/* 引导气泡提示 */}
        {showHint && (
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <div className="relative bg-slate-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45" />
              ✨ 点这里发现更多推荐
            </div>
          </div>
        )}
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedSolution, setSelectedSolution] = useState<AITemplate | null>(null);

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // 初始状态为空，展示空状态UI
  const [myPlatforms, setMyPlatforms] = useState<Platform[]>([]);
  
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('中台创建成功');
  const [showPromoHint, setShowPromoHint] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null); // 当前打开的更多菜单ID
  const [showUnboundModal, setShowUnboundModal] = useState<string | null>(null); // 未绑定AI微卡弹窗
  const [showRenameModal, setShowRenameModal] = useState<string | null>(null); // 重命名弹窗
  const [renameValue, setRenameValue] = useState('');

  // 图片上传相关的 Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetIdRef = useRef<string | null>(null);

  const [configData, setConfigData] = useState({
    name: '',
    description: '',
    syncMode: 'auto'
  });

  const onStartCreating = (template?: AITemplate) => {
    setSelectedSolution(null);
    setConfigData({
      name: template?.name || '未命名中台',
      description: template?.description || '',
      syncMode: 'auto'
    });
    setIsConfiguring(true);
  };


  const handleImageUpload = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    uploadTargetIdRef.current = id;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTargetIdRef.current) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result as string;
            setMyPlatforms(prev => prev.map(p => 
                p.id === uploadTargetIdRef.current ? { ...p, imageUrl: result } : p
            ));
            // Show toast feedback
            setToastMessage('封面图更新成功');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        };
        reader.readAsDataURL(file);
    }
    // Clear input so same file can be selected again
    e.target.value = '';
  };

  const visibleRecs = ALL_RECOMMENDATIONS.slice(0, 4);

  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  };
  
  const formatTimeShort = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) + ' ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
  }

  const formatCount = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const handleDeploy = () => {
    if (!configData.name) return;
    
    setIsDeploying(true);
    
    // 模拟网络请求延迟
    setTimeout(() => {
        const currentCount = myPlatforms.length;
        let newPlatform: Platform;
        
        // 预设逻辑：前两个创建的模板强制使用特定样式，演示不同状态
        if (currentCount === 0) {
            // 第一个：模拟“客户洞察分析”（黄色警告状态） - 归属自己
            newPlatform = {
                id: Math.random().toString(36).substr(2, 9),
                name: configData.name,
                description: configData.description || '自动分析客户反馈与情感倾向',
                syncMode: 'auto',
                tags: ['已配置', '未发布'],
                statusColor: 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.4)]',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                imageUrl: 'https://picsum.photos/seed/preset1/540/960',
                computeUsage: 24,
                visitCount: 3421,
                owner: 'Alex Chen',
                ownerAvatar: 'https://picsum.photos/id/64/200/200',
                templateName: configData.name,
                hasUnpublishedVersion: false,
                isBoundToAI: false,
                isPublished: false
            };
        } else if (currentCount === 1) {
            // 第二个：模拟“实时视频流处理”（红色告警状态） - 演示分配给其他人
            newPlatform = {
                id: Math.random().toString(36).substr(2, 9),
                name: configData.name,
                description: configData.description || '高频视频帧分析与识别',
                syncMode: 'manual',
                tags: ['算力不足'],
                statusColor: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]',
                createdAt: Date.now(),
                updatedAt: Date.now(),
                imageUrl: 'https://picsum.photos/seed/preset2/540/960',
                computeUsage: 8,
                visitCount: 89,
                owner: 'Sarah Wu',
                ownerAvatar: 'https://picsum.photos/id/32/200/200',
                templateName: configData.name,
                hasUnpublishedVersion: false,
                isBoundToAI: false,
                isPublished: false
            };
        } else {
            // 第三个及以后：完全随机生成
            const possibleStatusConfigs = [
              { tags: ['未配置'], color: 'bg-slate-300' },
              { tags: ['已配置', '未发布'], color: 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.4)]' },
              { tags: ['已发布'], color: 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' },
              { tags: ['已配置'], color: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' }
            ];
            const randomConfig = possibleStatusConfigs[Math.floor(Math.random() * possibleStatusConfigs.length)];
            const imgSeed = Math.floor(Math.random() * 1000);
            
            // 算力随机
            const rand = Math.random();
            let computeUsage;
            if (rand > 0.9) {
               computeUsage = Math.floor(Math.random() * 10); // <10 Critical
            } else if (rand > 0.75) {
               computeUsage = Math.floor(Math.random() * 20) + 10; // 10-29 Warning
            } else {
               computeUsage = Math.floor(Math.random() * 70) + 30; // 30-100 Normal
            }

            // 随机访问量
            const visitCount = Math.floor(Math.random() * 8000) + 100;

            // 随机归属者 (80% 是自己)
            const isMe = Math.random() > 0.2;
            const owner = isMe ? 'Alex Chen' : 'David Park';
            const ownerAvatar = isMe ? 'https://picsum.photos/id/64/200/200' : 'https://picsum.photos/id/12/200/200';

            const isPublished = randomConfig.tags.includes('已发布');
            const hasUnpublished = isPublished && Math.random() > 0.7; // 30%概率有未发布版本
            
            newPlatform = {
              id: Math.random().toString(36).substr(2, 9),
              name: configData.name,
              description: configData.description,
              syncMode: configData.syncMode,
              tags: randomConfig.tags,
              statusColor: randomConfig.color,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              imageUrl: `https://picsum.photos/seed/${imgSeed}/540/960`,
              computeUsage,
              visitCount,
              owner,
              ownerAvatar,
              templateName: configData.name,
              hasUnpublishedVersion: hasUnpublished,
              isBoundToAI: Math.random() > 0.5,
              isPublished: isPublished
            };
        }
        
        // 如果是添加的第一个，显示引导提示
        if (currentCount === 0) {
          setShowPromoHint(true);
          setTimeout(() => setShowPromoHint(false), 5000);
        }

        setMyPlatforms(prev => [newPlatform, ...prev]);
        setIsDeploying(false);
        setIsConfiguring(false);
        setActiveTab('home');
        setSearchQuery('');
        setIsFiltering(false);
        setActiveFilter(null);
        
        // 显示 Toast
        setToastMessage('中台创建成功');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  const getTagStyle = (tag: string) => {
    switch (tag) {
      case '已发布': return 'bg-green-50 text-green-600 border border-green-100';
      case '未发布': return 'bg-orange-50 text-orange-600 border border-orange-100';
      case '有未发布的版本': return 'bg-amber-50 text-amber-600 border border-amber-100';
      case '已配置': return 'bg-blue-50 text-blue-600 border border-blue-100';
      case '未配置': return 'bg-slate-50 text-slate-500 border border-slate-200';
      case '算力不足': return 'bg-red-50 text-red-600 border border-red-100';
      default: return 'bg-slate-50 text-slate-400 border border-slate-100';
    }
  };

  // 获取状态标签
  const getStatusTags = (platform: Platform): string[] => {
    const statusTags: string[] = [];
    if (platform.isPublished) {
      statusTags.push('已发布');
      if (platform.hasUnpublishedVersion) {
        statusTags.push('有未发布的版本');
      }
    } else {
      statusTags.push('未发布');
    }
    return statusTags;
  };

  // 处理删除
  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个中台吗？')) {
      setMyPlatforms(prev => prev.filter(p => p.id !== id));
      setShowMoreMenu(null);
      setToastMessage('中台已删除');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // 处理重命名
  const handleRename = (id: string, newName: string) => {
    if (newName.trim()) {
      setMyPlatforms(prev => prev.map(p => 
        p.id === id ? { ...p, templateName: newName.trim(), name: newName.trim(), updatedAt: Date.now() } : p
      ));
      setShowRenameModal(null);
      setRenameValue('');
      setToastMessage('模板名称已更新');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // 复制ID
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setShowMoreMenu(null);
    setToastMessage('ID已复制到剪贴板');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // 处理配置
  const handleConfigure = (platform: Platform) => {
    setConfigData({
      name: platform.templateName || platform.name,
      description: platform.description,
      syncMode: platform.syncMode
    });
    setIsConfiguring(true);
  };

  // 算力状态配置助手函数
  const getComputeStatusConfig = (usage: number) => {
    if (usage < 10) return { 
        text: 'text-red-500', 
        bar: 'bg-red-500', 
        icon: 'text-red-500',
        gridIconBg: 'bg-red-500',
        gridText: 'text-red-400' 
    };
    if (usage < 30) return { 
        text: 'text-yellow-600', 
        bar: 'bg-yellow-500', 
        icon: 'text-yellow-500', 
        gridIconBg: 'bg-yellow-500',
        gridText: 'text-yellow-400'
    };
    return { 
        text: 'text-emerald-500', 
        bar: 'bg-emerald-500', 
        icon: 'text-emerald-500',
        gridIconBg: 'bg-emerald-500',
        gridText: 'text-emerald-400'
    };
  };

  const filteredPlatforms = myPlatforms.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (p.templateName && p.templateName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesFilter = true;
    if (activeFilter) {
        if (activeFilter === '算力不足') {
            matchesFilter = p.computeUsage < 30; // 筛选 < 30% 的项 (红+黄)
        } else if (activeFilter === '已发布') {
            matchesFilter = p.isPublished === true;
        } else if (activeFilter === '未发布') {
            matchesFilter = p.isPublished === false;
        } else if (activeFilter === '有未发布的版本') {
            matchesFilter = p.hasUnpublishedVersion === true;
        } else {
            matchesFilter = p.tags.includes(activeFilter);
        }
    }
    
    return matchesSearch && matchesFilter;
  });

  const hasPlatforms = myPlatforms.length > 0;
  // 控制 Banner 显示：无平台数据时显示 (即添加后隐藏)
  const showBanner = !hasPlatforms;

  // 渲染会员升级页面内容
  const renderMembershipContent = () => (
    <div className="pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mt-6 mb-6">
        <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-[32px] p-6 border border-amber-200/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Crown size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 mb-1">当前：免费版</h2>
              <p className="text-[12px] text-slate-600 font-medium">升级会员解锁更多功能</p>
            </div>
          </div>
        </div>
      </div>

      {/* 会员等级卡片 */}
      <div className="space-y-4 mb-6">
        {/* 初级会员 */}
        <div className="bg-white rounded-[28px] p-6 border-2 border-amber-400 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100/50 to-orange-100/50 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                  <Crown size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">初级会员</h3>
                  <p className="text-[11px] text-slate-500 font-medium">适合个人用户</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-amber-600">¥29</div>
                <div className="text-[10px] text-slate-400 font-bold">/月</div>
              </div>
            </div>
            
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-[13px] text-slate-700">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                <span className="font-medium">最多创建 20 个智能中台</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-slate-700">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                <span className="font-medium">优先技术支持</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-slate-700">
                <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                <span className="font-medium">高级模板库访问</span>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all shadow-lg shadow-amber-200 hover:shadow-xl hover:shadow-amber-300">
              立即升级
            </button>
          </div>
        </div>

        {/* 高级会员 */}
        <div className="bg-white rounded-[28px] p-6 border-2 border-purple-300 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/50 to-pink-100/50 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">高级会员</h3>
                  <p className="text-[11px] text-slate-500 font-medium">适合团队使用</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-purple-600">¥99</div>
                <div className="text-[10px] text-slate-400 font-bold">/月</div>
              </div>
            </div>
            
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-[13px] text-slate-700">
                <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
                <span className="font-medium">无限创建智能中台</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-slate-700">
                <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
                <span className="font-medium">专属客服支持</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-slate-700">
                <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
                <span className="font-medium">API 调用额度提升</span>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300">
              立即升级
            </button>
          </div>
        </div>
      </div>

      {/* 功能对比 */}
      <div className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-black text-slate-800 mb-4">功能对比</h3>
        <div className="space-y-3">
          {[
            { feature: '智能中台数量', free: '7个', primary: '20个', advanced: '无限' },
            { feature: 'API 调用额度', free: '10k/月', primary: '50k/月', advanced: '无限' },
            { feature: '技术支持', free: '社区支持', primary: '优先支持', advanced: '专属客服' },
            { feature: '高级模板', free: '❌', primary: '✅', advanced: '✅' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
              <span className="text-[13px] font-bold text-slate-700 flex-1">{item.feature}</span>
              <div className="flex items-center gap-4">
                <span className="text-[12px] text-slate-400 font-medium w-12 text-right">{item.free}</span>
                <span className="text-[12px] text-amber-600 font-medium w-12 text-right">{item.primary}</span>
                <span className="text-[12px] text-purple-600 font-medium w-12 text-right">{item.advanced}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 渲染 "我的" 页面内容
  const renderMeContent = () => (
    <div className="pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mt-8 mb-8 flex items-center gap-5">
        <div className="w-20 h-20 rounded-[28px] bg-slate-100 border-4 border-white shadow-xl overflow-hidden relative group">
          <img src="https://picsum.photos/id/64/200/200" alt="Avatar" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/10 hidden group-hover:flex items-center justify-center cursor-pointer">
            <Settings size={20} className="text-white drop-shadow-md" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Alex Chen</h2>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Pro 开发者</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-1">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">运行实例</span>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-800">{myPlatforms.length}</span>
            <span className="text-green-500 font-bold text-xs mb-1.5 flex items-center gap-0.5">
              <Activity size={10} /> 运行中
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-1">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">API 调用</span>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-black text-slate-800">12.4k</span>
            <span className="text-blue-500 font-bold text-xs mb-1.5">本月</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-2 border border-slate-100 shadow-sm space-y-1">
        {[
          { icon: Shield, label: '账号安全与隐私', color: 'text-blue-500', bg: 'bg-blue-50' },
          { icon: Bell, label: '消息通知设置', color: 'text-orange-500', bg: 'bg-orange-50' },
          { icon: Database, label: '数据连接管理', color: 'text-purple-500', bg: 'bg-purple-50' },
          { icon: HelpCircle, label: '帮助与支持', color: 'text-teal-500', bg: 'bg-teal-50' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-[24px] cursor-pointer group transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-[18px] flex items-center justify-center transition-transform group-hover:scale-110`}>
                <item.icon size={20} />
              </div>
              <span className="font-bold text-slate-700 text-[15px]">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500" />
          </div>
        ))}
        <div className="h-px bg-slate-50 mx-4 my-2" />
        <div className="flex items-center justify-between p-4 hover:bg-red-50 rounded-[24px] cursor-pointer group transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-[18px] flex items-center justify-center group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </div>
              <span className="font-bold text-slate-400 group-hover:text-red-500 transition-colors text-[15px]">退出登录</span>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      <ToastNotification message={toastMessage} visible={showToast} />
      
      {/* Hidden File Input for Image Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      {activeTab === 'home' && (
        <div className="py-2 pb-10">
          <section className={`px-1 relative transition-all duration-500 ease-in-out mt-4 ${myPlatforms.length <= 5 ? 'mb-0' : 'mb-2'}`}>
            <div className={`transition-all duration-500 ease-in-out origin-top ${!showBanner ? 'max-h-0 opacity-0 mb-0 scale-95 overflow-hidden' : 'max-h-[300px] opacity-100 mb-2 scale-100'}`}>
               <PromoBanner showHint={showPromoHint} onHintClick={() => setShowPromoHint(false)} />
            </div>
            
            <div className="relative flex flex-col">
              <div className={`flex items-center w-full ${myPlatforms.length > 5 ? 'h-12' : 'h-0'}`}>
                {myPlatforms.length > 5 ? (
                  <div className="w-full flex items-center gap-3">
                    <div className="flex-1 bg-[#f1f3f5] rounded-xl flex items-center px-3 py-2.5 border border-transparent focus-within:border-blue-200 transition-all shadow-sm">
                      <Search size={18} className="text-slate-400 mr-2" />
                      <input 
                        type="text" 
                        placeholder="搜索中台名称或标签..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent text-[14px] font-medium text-slate-800 outline-none placeholder:text-slate-400"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-colors mr-1"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button 
                         onClick={() => setIsFiltering(!isFiltering)}
                         className={`p-1.5 ml-1 rounded-lg transition-all ${isFiltering || activeFilter ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-black/5'}`}
                       >
                         <SlidersHorizontal size={16} />
                       </button>
                    </div>
                  </div>
                ) : null}
              </div>

              {myPlatforms.length > 5 && isFiltering && (
                <div className="flex items-center gap-2 mt-3 animate-in fade-in slide-in-from-top-1 overflow-x-auto pb-1 no-scrollbar">
                   {['全部', '已发布', '有未发布的版本', '未发布'].map(status => {
                     const isActive = (status === '全部' && !activeFilter) || activeFilter === status;
                     const activeStyle = 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200';

                     return (
                     <button
                       key={status}
                       onClick={() => setActiveFilter(status === '全部' ? null : status)}
                       className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${
                         isActive 
                           ? activeStyle
                           : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                       }`}
                     >
                       {status}
                     </button>
                   )})}
                </div>
              )}
            </div>
          </section>

          <div className={`flex flex-col ${myPlatforms.length <= 5 ? 'gap-2' : 'gap-6'}`}>
            
            <section className="animate-in fade-in duration-700">
               <div className={`mb-5 px-1 border-t border-slate-100 ${myPlatforms.length <= 5 ? 'pt-1' : 'pt-3'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-[16px]">创建的中台</h3>
                  {/* Upgrade Header Button - Changed to Capsule with Text */}
                  {hasPlatforms && myPlatforms.length < 7 && (
                    <button 
                      onClick={() => onStartCreating()}
                      className="ml-2 px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 rounded-full flex items-center gap-1 transition-all shadow-sm active:scale-90 group"
                    >
                      <span className="text-[11px] font-bold">新建</span>
                      <Plus size={12} strokeWidth={3} />
                    </button>
                  )}
                  {/* 仅在有平台列表时显示视图切换 */}
                  {hasPlatforms && (
                    <div className="flex items-center bg-[#f1f3f5] p-1 rounded-lg ml-3 mt-3">
                      <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><List size={16} /></button>
                      <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}><LayoutGrid size={16} /></button>
                    </div>
                  )}
                </div>
                
                {/* 配额上限提示 - 在标题下方 */}
                {hasPlatforms && myPlatforms.length >= 7 && (
                  <div className="mt-3">
                    <p className="text-slate-600 text-[13px] leading-relaxed font-medium">
                      配额数量已达上限，请去升级 <span 
                        onClick={() => setActiveTab('membership')}
                        className="text-amber-600 font-bold cursor-pointer hover:text-amber-700 underline decoration-amber-600/30 hover:decoration-amber-600 transition-colors"
                      >初级</span> 会员
                    </p>
                  </div>
                )}
              </div>

              {/* 核心内容容器：空状态 vs 列表状态 */}
              {!hasPlatforms ? (
                /* 空状态布局 */
                <div className="flex flex-col gap-6">
                   {/* 添加按钮 - 全宽 (仅在空状态显示) */}
                   <div 
                      onClick={() => onStartCreating()}
                      className="w-full aspect-[16/7] rounded-[32px] border-2 border-dashed border-slate-200 bg-white/60 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50/20 transition-all group active:scale-[0.97] shadow-sm"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                        <Plus size={32} strokeWidth={2.5} className="text-slate-300 group-hover:text-white" />
                      </div>
                      <div className="text-center">
                        <span className="text-[15px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors block">创建您的第一个智能中台</span>
                        <span className="text-[10px] font-bold text-slate-300 tracking-widest uppercase group-hover:text-blue-300 transition-colors">Start Here</span>
                      </div>
                    </div>

                    {/* 热门推荐 - 横向滚动 */}
                    <div>
                      <div className="flex items-center mb-3 px-1">
                         <div className="flex items-center gap-2">
                             <Flame size={14} className="text-orange-500 fill-orange-500" />
                             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">热门模板推荐</span>
                         </div>
                      </div>
                      
                      <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 snap-x snap-mandatory no-scrollbar">
                         {visibleRecs.map((rec) => (
                           <div key={rec.id} onClick={() => onStartCreating({ name: rec.name, description: '基于热门推荐创建', category: '效率办公', imageUrl: rec.imageUrl, id: rec.id } as AITemplate)} className="min-w-[42%] aspect-[9/16] relative rounded-[24px] overflow-hidden snap-start shrink-0 shadow-md active:scale-95 transition-all">
                              <img src={rec.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                              <div className="absolute top-2 right-2">
                                <span className="bg-white/20 backdrop-blur-md text-[9px] font-bold text-white px-2 py-0.5 rounded-full border border-white/20">Hot</span>
                              </div>
                              <div className="absolute bottom-3 left-3 right-3">
                                <h4 className="text-white font-bold text-[13px] leading-tight">{rec.name}</h4>
                              </div>
                           </div>
                         ))}
                      </div>
                    </div>
                </div>
              ) : (
                /* 有数据时的列表布局 */
                <div className={`${viewMode === 'list' ? 'flex flex-col gap-4' : 'columns-2 gap-4 space-y-4'}`}>
                  
                  {filteredPlatforms.map((platform, idx) => {
                    const statusConfig = getComputeStatusConfig(platform.computeUsage);
                    const isLow = platform.computeUsage < 30;
                    
                    return viewMode === 'list' ? (
                      <div key={platform.id} className="w-full bg-white border border-slate-100/80 rounded-[28px] p-4 shadow-sm transition-all flex gap-4 items-stretch group relative">
                        <div 
                          onClick={(e) => handleImageUpload(e, platform.id)}
                          className="w-20 rounded-2xl overflow-hidden shrink-0 relative shadow-sm cursor-pointer group/img self-stretch"
                        >
                           <img src={platform.imageUrl} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" alt="" />
                           <div className="absolute inset-0 bg-black/5" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex justify-between items-start mb-1.5">
                              <h4 className="font-bold text-slate-800 text-[16px] leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                                {platform.templateName || platform.name || '未命名中台'}
                              </h4>
                              <div className="flex items-center gap-2">
                                {/* 更多菜单按钮 */}
                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowMoreMenu(showMoreMenu === platform.id ? null : platform.id);
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                                  >
                                    <MoreHorizontal size={18} className="text-slate-600" strokeWidth={2.5} />
                                  </button>
                                  {/* 更多菜单 */}
                                  {showMoreMenu === platform.id && (
                                    <div className="absolute right-0 top-8 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 min-w-[140px]">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowRenameModal(platform.id);
                                          setRenameValue(platform.templateName || platform.name);
                                          setShowMoreMenu(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                      >
                                        <Edit2 size={14} />
                                        <span>修改模板名称</span>
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopyId(platform.id);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                      >
                                        <Copy size={14} />
                                        <span>复制ID</span>
                                      </button>
                                      <div className="h-px bg-slate-100 my-1" />
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDelete(platform.id);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                      >
                                        <Trash2 size={14} />
                                        <span>删除</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* 状态标签 */}
                             <div className="flex flex-wrap gap-1.5 mb-2.5">
                                {getStatusTags(platform).map(tag => (
                                  <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded ${getTagStyle(tag)}`}>{tag}</span>
                                ))}
                             </div>
                          </div>

                          {/* Meta Footer */}
                          <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
                               <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                     <Clock size={8} />
                                     <span>{formatTimeShort(platform.updatedAt || platform.createdAt)}</span>
                                  </div>
                                  {!platform.isBoundToAI && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowUnboundModal(platform.id);
                                      }}
                                      className="text-[9px] text-blue-600 font-medium hover:text-blue-700 transition-colors text-left"
                                    >
                                      未绑定AI微卡
                                    </button>
                                  )}
                               </div>
                          </div>

                          {/* 操作按钮 */}
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-50">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfigure(platform);
                              }}
                              className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                            >
                              <Settings size={12} />
                              <span>配置</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        key={platform.id} 
                        className="w-full aspect-[9/16] relative rounded-[32px] overflow-hidden shadow-md group cursor-pointer active:scale-95 transition-all break-inside-avoid mb-4"
                      >
                        {/* Image */}
                        <img 
                          src={platform.imageUrl} 
                          alt="" 
                          onClick={(e) => handleImageUpload(e, platform.id)}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-90" />
                        
                        {/* 更多菜单按钮 - 右上角 */}
                        <div className="absolute top-3 right-3 z-10">
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowMoreMenu(showMoreMenu === platform.id ? null : platform.id);
                              }}
                              className="p-2 bg-white/30 backdrop-blur-md rounded-lg hover:bg-white/50 transition-colors shadow-lg"
                            >
                              <MoreHorizontal size={18} className="text-white" strokeWidth={2.5} />
                            </button>
                            {/* 更多菜单 */}
                            {showMoreMenu === platform.id && (
                              <div className="absolute right-0 top-10 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 min-w-[140px]">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowRenameModal(platform.id);
                                    setRenameValue(platform.templateName || platform.name);
                                    setShowMoreMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Edit2 size={14} />
                                  <span>修改模板名称</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyId(platform.id);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <Copy size={14} />
                                  <span>复制ID</span>
                                </button>
                                <div className="h-px bg-slate-100 my-1" />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(platform.id);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 size={14} />
                                  <span>删除</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content (Bottom) */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2">
                          <h4 className="text-white font-bold text-lg leading-tight shadow-sm line-clamp-1">
                            {platform.templateName || platform.name || '未命名中台'}
                          </h4>
                          <div className="flex flex-wrap gap-1.5 mb-1">
                             {getStatusTags(platform).slice(0, 2).map(tag => (
                               <span key={tag} className="text-[9px] font-bold text-white/90 bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10">{tag}</span>
                             ))}
                          </div>
                          
                          {/* Grid模式：更新时间 */}
                          <div className="flex flex-col gap-1 mb-2">
                            <div className="flex items-center gap-1 text-[9px] text-white/60">
                              <Clock size={8} />
                              <span>{formatTime(platform.updatedAt || platform.createdAt)}</span>
                            </div>
                            {!platform.isBoundToAI && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowUnboundModal(platform.id);
                                }}
                                className="text-[8px] text-white/80 font-medium hover:text-white transition-colors text-left"
                              >
                                未绑定AI微卡
                              </button>
                            )}
                          </div>

                          {/* 操作按钮 */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfigure(platform);
                              }}
                              className="flex-1 px-3 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-lg text-xs font-bold hover:bg-white/30 transition-colors flex items-center justify-center gap-1"
                            >
                              <Settings size={12} />
                              <span>配置</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {activeTab === 'me' && renderMeContent()}

      {activeTab === 'membership' && renderMembershipContent()}

      {/* 创建配置弹窗 */}
      {isConfiguring && (
        <div className="absolute inset-0 z-[100] flex items-end justify-center animate-in slide-in-from-bottom duration-400">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !isDeploying && setIsConfiguring(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-[48px] px-8 pt-10 pb-12 shadow-2xl h-[85%] overflow-y-auto no-scrollbar">
            <div className="w-14 h-1.5 bg-slate-100 rounded-full mx-auto mb-10" />
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-blue-600 rounded-[20px] flex items-center justify-center text-white shadow-lg shadow-blue-200"><Settings size={24} /></div>
              <div>
                <h4 className="text-xl font-bold text-slate-800">配置中台模板</h4>
                <p className="text-[11px] text-slate-400 font-bold tracking-widest uppercase">Quick Setup</p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <label className="text-[12px] font-bold text-slate-400 mb-3 block uppercase tracking-wider">业务名称</label>
                <input 
                  type="text" 
                  value={configData.name} 
                  onChange={(e) => setConfigData({...configData, name: e.target.value})} 
                  className="w-full bg-[#f8fafc] border-2 border-slate-50 rounded-2xl px-6 py-5 text-lg font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all" 
                  placeholder="输入中台名称..." 
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-400 mb-3 block uppercase tracking-wider">数据采集模式</label>
                <div className="grid grid-cols-2 gap-4">
                  <div onClick={() => setConfigData({...configData, syncMode: 'auto'})} className={`py-6 rounded-[28px] border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${configData.syncMode === 'auto' ? 'border-blue-500 bg-blue-50/40 shadow-sm' : 'border-slate-50 bg-[#f8fafc]'}`}>
                    <Activity size={24} className={configData.syncMode === 'auto' ? 'text-blue-600' : 'text-slate-400'} />
                    <span className={`text-[14px] font-bold ${configData.syncMode === 'auto' ? 'text-blue-600' : 'text-slate-500'}`}>定期快照</span>
                  </div>
                  <div onClick={() => setConfigData({...configData, syncMode: 'manual'})} className={`py-6 rounded-[28px] border-2 cursor-pointer transition-all flex flex-col items-center gap-3 ${configData.syncMode === 'manual' ? 'border-blue-500 bg-blue-50/40 shadow-sm' : 'border-slate-50 bg-[#f8fafc]'}`}>
                    <Database size={24} className={configData.syncMode === 'manual' ? 'text-blue-600' : 'text-slate-400'} />
                    <span className={`text-[14px] font-bold ${configData.syncMode === 'manual' ? 'text-blue-600' : 'text-slate-500'}`}>实时订阅</span>
                  </div>
                </div>
              </div>
              <div className="pt-6">
                <button 
                    onClick={handleDeploy} 
                    disabled={isDeploying || !configData.name}
                    className="w-full bg-slate-900 py-6 rounded-[28px] text-white font-bold text-xl active:scale-95 transition-all shadow-2xl shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isDeploying ? (
                      <>
                        <Loader2 className="animate-spin" size={24} />
                        <span>配置中...</span>
                      </>
                  ) : (
                      "即刻启用模板"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 未绑定AI微卡弹窗 */}
      {showUnboundModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowUnboundModal(null)} />
          <div className="relative bg-white rounded-[32px] p-6 shadow-2xl w-full max-w-sm border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-800">未绑定AI微卡</h3>
              <button 
                onClick={() => setShowUnboundModal(null)}
                className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              该中台尚未绑定AI微卡，绑定后可以启用AI智能功能。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const platform = myPlatforms.find(p => p.id === showUnboundModal);
                  if (platform) {
                    setMyPlatforms(prev => prev.map(p => 
                      p.id === showUnboundModal ? { ...p, isBoundToAI: true } : p
                    ));
                    setToastMessage('AI微卡绑定成功');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                  }
                  setShowUnboundModal(null);
                }}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl active:scale-95 transition-all"
              >
                立即绑定
              </button>
              <button
                onClick={() => setShowUnboundModal(null)}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl active:scale-95 transition-all"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 重命名弹窗 */}
      {showRenameModal && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => {
            setShowRenameModal(null);
            setRenameValue('');
          }} />
          <div className="relative bg-white rounded-[32px] p-6 shadow-2xl w-full max-w-sm border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-800">修改模板名称</h3>
              <button 
                onClick={() => {
                  setShowRenameModal(null);
                  setRenameValue('');
                }}
                className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-400 mb-2 block uppercase">新名称</label>
              <input 
                type="text" 
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="w-full bg-[#f8fafc] border-2 border-slate-50 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all" 
                placeholder="输入新名称..."
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (showRenameModal) {
                    handleRename(showRenameModal, renameValue);
                  }
                }}
                disabled={!renameValue.trim()}
                className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认
              </button>
              <button
                onClick={() => {
                  setShowRenameModal(null);
                  setRenameValue('');
                }}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl active:scale-95 transition-all"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 点击外部关闭更多菜单 */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 z-[90]" 
          onClick={() => setShowMoreMenu(null)}
        />
      )}


      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-in { animation: in 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes in { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .skeleton-shimmer { position: relative; overflow: hidden; background: #f1f3f5; }
        .skeleton-shimmer::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 1.5s infinite linear;
        }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .break-inside-avoid { break-inside: avoid; }
      `}</style>
    </Layout>
  );
};

export default App;
