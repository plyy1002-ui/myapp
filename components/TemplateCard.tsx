
import React from 'react';
import { AITemplate } from '../types';
import { ExternalLink, Star, Users } from 'lucide-react';

interface TemplateCardProps {
  template: AITemplate;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
      <div className="relative h-32 overflow-hidden bg-slate-100">
        <img 
          src={template.imageUrl} 
          alt={template.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/placeholder/400/300';
          }}
        />
        <div className="absolute top-2 left-2 flex gap-1">
          <span className="bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-700 shadow-sm">
            {template.category}
          </span>
          {template.isNew && (
            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              新品
            </span>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
            <span className="text-white text-xs font-medium flex items-center gap-1">
                <Users size={12} /> {template.usageCount?.toLocaleString() || '0'} 人已使用
            </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">
            {template.name}
          </h3>
          <button className="text-slate-300 hover:text-yellow-400 transition-colors">
            <Star size={14} />
          </button>
        </div>
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {template.description}
        </p>
        
        <div className="flex items-center justify-between border-t border-slate-50 pt-3">
           <span className="text-[10px] text-slate-400">版本 v1.2.4</span>
           <button className="flex items-center gap-1.5 text-blue-600 text-xs font-semibold hover:gap-2 transition-all">
             立即使用 <ExternalLink size={12} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
