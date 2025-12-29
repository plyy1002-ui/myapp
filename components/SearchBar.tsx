
import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, X, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative mt-4 group">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center transition-all duration-300 ${isFocused ? 'scale-[1.02]' : ''}`}>
          <div className="absolute left-4 text-slate-400 group-hover:text-blue-500 transition-colors">
            {isLoading ? (
              <Sparkles className="animate-spin" size={20} />
            ) : (
              <Search size={20} />
            )}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            className={`w-full bg-white border-2 py-4 pl-12 pr-12 rounded-2xl outline-none transition-all duration-200 
              ${isFocused ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-slate-100 shadow-sm'}
              placeholder:text-slate-400 text-slate-700 font-medium`}
            placeholder="试试“创建一个儿童绘本助手”..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />

          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-12 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
          )}

          <button
            type="submit"
            disabled={!query || isLoading}
            className={`absolute right-2 p-2 rounded-xl transition-all
              ${query && !isLoading ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-50 text-slate-300'}`}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </form>
      
      {!query && !isFocused && (
        <div className="absolute -top-2 -right-2 bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
          AI 智能搜索
        </div>
      )}
    </div>
  );
};

export default SearchBar;
