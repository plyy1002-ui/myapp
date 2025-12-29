
import React, { useState, useEffect } from 'react';
import { Home, User, Layers, X, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [showAbout, setShowAbout] = useState(false);
  const [countdown, setCountdown] = useState(7);

  // 倒计时逻辑
  useEffect(() => {
    if (!showAbout) {
      setCountdown(7);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowAbout(false);
          return 7;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showAbout]);

  return (
    <div className="flex flex-col h-[844px] max-w-md mx-auto bg-slate-50 relative shadow-2xl overflow-hidden rounded-[40px] border-[12px] border-slate-900 mt-4 mb-4 transform transition-all">
      {/* 顶部状态栏 (模拟) */}
      <div className="h-10 w-full flex items-center justify-between px-8 py-2 bg-transparent text-slate-800 z-50">
        <span className="text-sm font-semibold">9:41</span>
        <div className="flex gap-1.5 items-center">
          <div className="flex gap-0.5 items-end">
            <div className="w-[3px] h-1.5 bg-slate-800 rounded-full" />
            <div className="w-[3px] h-2.5 bg-slate-800 rounded-full" />
            <div className="w-[3px] h-3.5 bg-slate-800 rounded-full" />
            <div className="w-[3px] h-4 bg-slate-800/30 rounded-full" />
          </div>
          <div className="w-5 h-3 border-2 border-slate-800/30 rounded-[3px] relative">
            <div className="absolute left-0.5 top-0.5 bottom-0.5 right-1 bg-slate-800 rounded-[1px]" />
          </div>
        </div>
      </div>

      <header className="px-6 py-4 flex items-center relative h-16 shrink-0 z-40">
        {/* 左侧品牌 - Agentsyun OPC - Clickable for About Modal */}
        <div 
          onClick={() => setShowAbout(true)}
          className="relative z-10 pr-4 select-none cursor-pointer active:opacity-60 transition-opacity"
        >
          {/* 
            调整:
            leading-normal & py-1: 防止 y 的下行部被切断
            pr-1: 防止斜体 n 的尾部被切断
            颜色调整: 改为高级灰色 (Slate Gradient)
          */}
          <span className="text-lg font-black italic text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-500 leading-normal py-1 pr-1">
            Agentsyun
          </span>
          {/* OPC 斜挂在右上角 - 可点击样式，不遮挡文字 */}
          <span className="absolute -top-1 -right-2 text-[10px] font-bold text-slate-500 italic transform rotate-12 origin-top-right bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-slate-200/60 shadow-sm hover:bg-white hover:shadow-md hover:scale-110 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 cursor-pointer">OPC</span>
        </div>
        
        {/* 中间标题 - 绝对居中 */}
        <h1 className="text-[15px] font-bold text-slate-800 absolute left-1/2 -translate-x-1/2 whitespace-nowrap tracking-tight">
          {activeTab === 'home' ? '工作台' : activeTab === 'membership' ? '会员升级' : '工作台'}
        </h1>
      </header>

      {/* 主内容区域 - 包含所有页面内容和绝对定位的弹窗 */}
      <main className="flex-1 overflow-y-auto pb-28 px-6 no-scrollbar relative">
        {children}
      </main>

      {/* 底部导航栏 */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-6 pointer-events-none z-50">
        <nav className="h-20 bg-white/95 backdrop-blur-xl rounded-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.06)] flex items-center justify-between px-10 relative pointer-events-auto border border-slate-50">
          
          {/* 首页 */}
          <button 
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center gap-1.5 w-16 transition-all duration-300 ${activeTab === 'home' ? 'text-blue-600 scale-105' : 'text-slate-400'}`}
          >
            <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className={`text-[11px] font-bold ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400 opacity-80'}`}>首页</span>
          </button>

          {/* 工作台页签 */}
          <button 
            onClick={() => onTabChange('home')}
            className={`absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-300 ${activeTab === 'home' ? 'scale-105' : ''}`}
          >
            <div className={`w-[72px] h-[72px] rounded-full flex items-center justify-center shadow-[0_12px_24px_rgba(37,99,235,0.3)] border-[6px] border-white cursor-pointer active:scale-90 transition-all group ${activeTab === 'home' ? 'bg-blue-600' : 'bg-slate-400'}`}>
              <Layers size={36} strokeWidth={3} className="text-white" />
            </div>
            <span className={`text-[11px] font-bold mt-1 ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400 opacity-80'}`}>工作台</span>
          </button>

          {/* 我的 */}
          <button 
            onClick={() => onTabChange('me')}
            className={`flex flex-col items-center gap-1.5 w-16 transition-all duration-300 ${activeTab === 'me' ? 'text-blue-600 scale-105' : 'text-slate-400'}`}
          >
            <User size={22} strokeWidth={activeTab === 'me' ? 2.5 : 2} />
            <span className={`text-[11px] font-bold ${activeTab === 'me' ? 'text-blue-600' : 'text-slate-400 opacity-80'}`}>我的</span>
          </button>
        </nav>
      </div>

      {/* About Description Modal */}
      {showAbout && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowAbout(false)} />
           <div className="relative bg-white rounded-[32px] p-8 shadow-2xl w-full max-w-xs border border-white/50 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
              {/* 顶部关闭区域 - 包含倒计时和关闭按钮 */}
              <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">
                  {countdown}秒后自动关闭
                </span>
                <button 
                  onClick={() => setShowAbout(false)}
                  className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4 mt-12">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner shrink-0">
                  <Sparkles size={28} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-slate-800 leading-tight">
                  关于 Agentsyun
                </h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-slate-500 text-[14px] leading-relaxed font-medium text-justify">
                  Agentsyun平台提供覆盖全场景的多智能体协作的中台AI模板，让您成为 <span className="text-slate-800 font-bold">OPC（一人公司+智能体）</span> 一键拥有属于自己的AI平台。
                </p>
                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-50">
                  <p className="text-blue-700 text-[13px] leading-relaxed font-bold text-center">
                    "对内改造团队，提升效率；<br/>对外开拓业务，领先同行。"
                  </p>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
