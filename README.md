# Agentsyun 智能 OPC 工作台

一个现代化的 AI 智能中台管理界面，提供简洁优雅的用户体验，帮助您轻松创建和管理 AI 智能伙伴。

## 功能特性

- 🎯 **智能中台管理** - 创建、配置和管理您的 AI 智能中台
- 📊 **多视图模式** - 支持列表和网格两种视图模式
- 🔍 **智能搜索** - 快速搜索和筛选中台
- 👤 **用户中心** - 个人资料和设置管理
- 👑 **会员系统** - 多层级会员功能
- 🎨 **现代化 UI** - 精美的界面设计，流畅的交互体验

## 技术栈

- **React 19** - 前端框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

## 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd 智能体中台页
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   
   打开浏览器访问 `http://localhost:3000`

## 可用命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建

## 项目结构

```
智能体中台页/
├── App.tsx              # 主应用组件
├── components/          # 组件目录
│   └── Layout.tsx       # 布局组件
├── types.ts             # TypeScript 类型定义
├── index.tsx            # 应用入口
├── vite.config.ts       # Vite 配置
└── package.json         # 项目配置
```

## 构建和部署

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 部署

构建完成后，可以将 `dist` 目录部署到任何静态文件服务器，如：
- Vercel
- Netlify
- GitHub Pages
- 或其他静态托管服务

## 开发说明

- 项目使用 TypeScript 编写，确保类型安全
- 使用 Tailwind CSS 进行样式开发
- 遵循 React Hooks 最佳实践
- 组件采用函数式组件编写

## 许可证

本项目为私有项目。

---

**Agentsyun OPC** - 让 AI 智能伙伴触手可及
