# 儿童英语乐园 - 项目概要设计

## 1. 项目概述

### 1.1 项目背景
Little English Stars（儿童英语乐园）是一款面向 4-10 岁儿童的英语学习 web 应用。通过游戏化、互动化的设计理念，将枯燥的英语学习转变为有趣的探索之旅。

### 1.2 核心价值
- 🎮 **游戏化学习** - 通过记忆翻翻乐、Quiz答题、拼写练习等游戏激发学习兴趣
- 🔊 **语音支持** - 内置语音合成技术，支持单词、字母、句子的标准发音
- 📊 **进度追踪** - 完整的学习进度记录和成就系统
- 🎨 **儿童友好** - 采用鲜艳的渐变配色和大字体设计，适合儿童操作

### 1.3 目标用户
- **主要用户**：4-10 岁儿童
- **辅助用户**：家长、老师

## 2. 技术架构

### 2.1 前端技术栈
```
React 18 + TypeScript + Vite
├── UI框架: Tailwind CSS
├── 动画库: Framer Motion
├── 路由: React Router DOM v6
└── 语音合成: Web Speech API
```

### 2.2 后端技术栈
```
Node.js + Express.js
├── 数据库: MySQL
├── 认证: JWT Token
└── 日志: JSON格式文件日志
```

### 2.3 系统架构图
```
┌─────────────────┐
│   浏览器客户端   │
│  (React SPA)    │
└────────┬────────┘
         │ HTTP/HTTPS
         ▼
┌─────────────────┐
│  Vite Dev Server│
│   Port: 5173    │
└────────┬────────┘
         │ Proxy API
         ▼
┌─────────────────┐
│  Express API    │
│   Port: 3001    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     MySQL       │
│   localhost     │
└─────────────────┘
```

## 3. 功能模块

### 3.1 模块总览
| 模块 | 功能描述 | 核心页面 |
|------|---------|---------|
| 用户认证 | 注册/登录/登出 | Login.tsx |
| 首页 | 功能入口/每日提示 | Home.tsx |
| 字母学习 | 26个字母+配套单词 | Alphabet.tsx |
| 词汇学习 | 6大类别100+单词 | Vocabulary.tsx |
| 句子学习 | 日常英语句子 | Sentences.tsx |
| 游戏中心 | 记忆/Quiz/拼写游戏 | Games.tsx |
| 进度中心 | 学习统计/成就 | Progress.tsx |

### 3.2 字母学习模块
- **功能**：26个英文字母的认读学习
- **特点**：
  - 点击字母播放发音
  - 显示配套单词和emoji
  - 动画反馈增强互动感
- **数据结构**：
  ```typescript
  { letter: string, word: string, emoji: string, color: string }
  ```

### 3.3 词汇学习模块
- **功能**：分类词汇学习
- **分类**：颜色、动物、数字、食物、家庭、身体
- **特点**：
  - 翻转卡片设计（正面英文/背面中文）
  - 点击发音功能
  - 快速导航按钮

### 3.4 句子学习模块
- **功能**：日常英语句子学习
- **分类**：问候语、自我介绍、日常表达、提问
- **特点**：
  - 点击句子播放完整发音
  - 播放状态动画指示
  - 分类筛选功能

### 3.5 游戏中心模块
#### 3.5.1 记忆翻翻乐
- 8对emoji卡片配对游戏
- 记录配对成功次数
- 支持重新开始

#### 3.5.2 Quiz答题
- 8道看图识词选择题
- 即时反馈正确/错误
- 显示最终得分

#### 3.5.3 拼写练习
- 打乱字母重组单词
- 5个基础单词练习
- 实时显示得分

### 3.6 进度中心模块
- **数据统计**：
  - 字母学习数量
  - 词汇学习数量
  - 句子学习数量
  - 游戏次数
  - 连续学习天数
  - 星星总数
- **成就系统**：8种成就徽章

## 4. 用户认证系统

### 4.1 认证流程
```
用户注册 → 创建账号 → 生成Token → 保存本地 → 认证成功
用户登录 → 验证密码 → 生成Token → 保存本地 → 认证成功
```

### 4.2 数据安全
- 密码使用SHA256+盐值哈希存储
- Token有效期7天
- 支持登出操作清除认证信息

## 5. 数据存储

### 5.1 前端存储
- `localStorage` 存储：
  - `auth_token`: JWT认证令牌
  - `auth_user`: 用户信息JSON
  - `kidsEnglishProgress_{userId}`: 学习进度数据

### 5.2 后端数据库表
#### users表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| username | VARCHAR(50) | 用户名（唯一）|
| password_hash | VARCHAR(255) | 密码哈希 |
| display_name | VARCHAR(100) | 显示名称 |
| avatar | VARCHAR(255) | 头像URL |
| created_at | TIMESTAMP | 创建时间 |
| last_visit | TIMESTAMP | 最后访问 |

#### user_sessions表
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| user_id | INT | 用户ID |
| token | VARCHAR(255) | 会话令牌 |
| expires_at | TIMESTAMP | 过期时间 |

#### progress表
| 字段 | 类型 | 说明 |
|------|------|------|
| user_id | INT | 用户ID |
| category | VARCHAR(50) | 类别 |
| item_id | VARCHAR(50) | 项目ID |
| value | INT | 数值 |
| completed | BOOLEAN | 是否完成 |
| stars | INT | 星星数 |

## 6. 语音功能

### 6.1 技术实现
使用 Web Speech API (speechSynthesis) 实现发音功能：
- `speak(text, lang, rate)`: 标准发音函数
- `isSpeechSupported()`: 浏览器兼容性检测
- `getVoiceForLang(lang)`: 智能语音选择

### 6.2 配置参数
| 参数 | 值 | 说明 |
|------|-----|------|
| lang | en-US | 英语发音 |
| rate | 0.7-0.8 | 语速（儿童友好慢速）|
| pitch | 1.0 | 音调 |
| volume | 1.0 | 音量 |

## 7. 项目结构
```
little-english-stars/
├── src/
│   ├── components/
│   │   └── Layout.tsx          # 页面布局组件
│   ├── contexts/
│   │   └── AuthContext.tsx      # 认证上下文
│   ├── hooks/
│   │   └── useSound.ts          # 语音功能钩子
│   ├── pages/
│   │   ├── Home.tsx             # 首页
│   │   ├── Alphabet.tsx         # 字母学习
│   │   ├── Vocabulary.tsx      # 词汇学习
│   │   ├── Sentences.tsx        # 句子学习
│   │   ├── Games.tsx            # 游戏中心
│   │   ├── Progress.tsx        # 进度中心
│   │   └── Login.tsx            # 登录注册
│   ├── services/
│   │   └── api.ts               # API服务
│   ├── App.tsx                  # 应用入口
│   └── main.tsx                 # React挂载
├── server/
│   ├── server.js               # Express服务器
│   └── package.json            # 后端依赖
├── dist/                        # 构建输出
├── vite.config.ts              # Vite配置
└── package.json                # 前端依赖
```

## 8. 部署说明

### 8.1 开发环境启动
```bash
# 1. 启动后端服务
cd server
npm install
node server.js

# 2. 启动前端服务（新终端）
npm install
npm run dev
```

### 8.2 生产环境构建
```bash
npm run build
# 输出到 dist/ 目录
```

### 8.3 环境要求
- Node.js >= 18
- MySQL >= 8.0
- 现代浏览器（Chrome/Firefox/Safari/Edge）

## 9. 设计规范

### 9.1 配色方案
| 用途 | 颜色 | CSS类 |
|------|------|-------|
| 主色 | 紫色渐变 | from-purple-500 to-pink-500 |
| 强调色 | 绿色渐变 | from-green-500 to-emerald-500 |
| 背景 | 粉紫蓝渐变 | from-purple-100 via-pink-100 to-blue-100 |

### 9.2 动画效果
- **Framer Motion** 用于页面切换和元素动画
- 标准过渡时长：300ms
- 动画缓动：spring类型

### 9.3 响应式断点
| 设备 | 断点 | 说明 |
|------|------|------|
| 手机 | < 640px | sm |
| 平板 | 640-768px | md |
| 桌面 | > 768px | lg |

## 10. 未来扩展方向

- [ ] 添加更多游戏类型
- [ ] 实现语音识别（跟读评分）
- [ ] 添加学习报告邮件
- [ ] 支持多语言界面
- [ ] 实现家长控制面板
- [ ] 添加离线支持（PWA）
