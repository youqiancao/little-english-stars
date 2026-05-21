# 儿童英语乐园 - 详细设计文档

## 1. 数据库设计

### 1.1 ER图
```
┌──────────────┐       ┌─────────────────┐       ┌──────────────────┐
│    users     │       │ user_sessions   │       │    progress       │
├──────────────┤       ├─────────────────┤       ├──────────────────┤
│ id (PK)     │──┐    │ id (PK)         │    ┌──│ user_id (FK)     │
│ username    │  │    │ user_id (FK)    │────┘  │ category         │
│ password_hash│ │    │ token           │       │ item_id          │
│ display_name │  └───│ expires_at      │       │ value            │
│ avatar       │       │ created_at      │       │ completed        │
│ created_at   │       └─────────────────┘       │ stars            │
│ last_visit   │                                └──────────────────┘
└──────────────┘       ┌──────────────────┐       ┌──────────────────┐
                       │   achievements   │       │   game_scores    │
                       ├──────────────────┤       ├──────────────────┤
                       │ id (PK)          │       │ id (PK)          │
                       │ user_id (FK)    │       │ user_id (FK)     │
                       │ achievement_id  │       │ game_type        │
                       │ earned_at       │       │ score            │
                       └──────────────────┘       │ played_at        │
                                                   └──────────────────┘

                       ┌──────────────────┐
                       │  daily_activity  │
                       ├──────────────────┤
                       │ id (PK)          │
                       │ user_id (FK)    │
                       │ activity_date   │
                       │ words_learned   │
                       │ time_spent      │
                       └──────────────────┘
```

### 1.2 数据表详细定义

#### 1.2.1 users 用户表
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希（SHA256+盐值）',
    display_name VARCHAR(100) COMMENT '显示名称',
    avatar VARCHAR(255) COMMENT '头像URL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后访问时间',
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

**字段说明：**
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 用户唯一标识 |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名（登录用）|
| password_hash | VARCHAR(255) | NOT NULL | SHA256哈希后的密码 |
| display_name | VARCHAR(100) | NULL | 用户显示名称 |
| avatar | VARCHAR(255) | NULL | 头像图片URL |
| created_at | TIMESTAMP | DEFAULT | 账户创建时间 |
| last_visit | TIMESTAMP | AUTO UPDATE | 最后活跃时间 |

#### 1.2.2 user_sessions 会话表
```sql
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '会话ID',
    user_id INT NOT NULL COMMENT '关联用户ID',
    token VARCHAR(255) NOT NULL UNIQUE COMMENT '认证令牌',
    expires_at TIMESTAMP NOT NULL COMMENT '过期时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户会话表';
```

**字段说明：**
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | INT | PK, AUTO_INCREMENT | 会话记录ID |
| user_id | INT | FK, NOT NULL | 关联用户ID |
| token | VARCHAR(255) | UNIQUE, NOT NULL | JWT令牌 |
| expires_at | TIMESTAMP | NOT NULL | 令牌过期时间（7天后）|
| created_at | TIMESTAMP | DEFAULT | 会话创建时间 |

#### 1.2.3 progress 学习进度表
```sql
CREATE TABLE progress (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    user_id INT NOT NULL COMMENT '用户ID',
    category VARCHAR(50) NOT NULL COMMENT '类别（alphabet/vocabulary/sentences/games/stars）',
    item_id VARCHAR(50) COMMENT '项目ID（如单词ID、字母等）',
    value INT DEFAULT 0 COMMENT '数值（如学习数量、得分等）',
    completed BOOLEAN DEFAULT FALSE COMMENT '是否完成',
    stars INT DEFAULT 0 COMMENT '获得的星星数量',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_category_item (user_id, category, item_id),
    INDEX idx_user_category (user_id, category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='学习进度表';
```

**category 字段值说明：**
| 值 | 说明 | item_id示例 |
|---|------|------------|
| alphabet | 字母学习 | A, B, C... |
| vocabulary | 词汇学习 | color_red, animal_cat... |
| sentences | 句子学习 | greeting_hello... |
| games | 游戏次数 | memory, quiz, spell |
| stars | 星星总数 | total |

#### 1.2.4 achievements 成就表
```sql
CREATE TABLE achievements (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    user_id INT NOT NULL COMMENT '用户ID',
    achievement_id VARCHAR(50) NOT NULL COMMENT '成就ID',
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '获得时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_achievement (user_id, achievement_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户成就表';
```

**achievement_id 成就ID说明：**
| ID | 名称 | 解锁条件 |
|----|------|---------|
| first_step | 第一步 | 完成第一次学习 |
| alphabet_master | 字母大师 | 学习完所有26个字母 |
| vocab_explorer | 词汇探险家 | 学习100个单词 |
| sentence_builder | 句子建筑师 | 学习50个句子 |
| game_master | 游戏大师 | 玩10次游戏 |
| star_collector | 星星收藏家 | 获得50颗星星 |
| week_warrior | 坚持一周 | 连续学习7天 |
| perfect_score | 满分达人 | Quiz中获得满分 |

#### 1.2.5 game_scores 游戏得分表
```sql
CREATE TABLE game_scores (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    user_id INT NOT NULL COMMENT '用户ID',
    game_type VARCHAR(50) NOT NULL COMMENT '游戏类型',
    score INT NOT NULL COMMENT '得分',
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '游戏时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_game (user_id, game_type),
    INDEX idx_played_at (played_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='游戏得分记录表';
```

**game_type 字段值：**
| 值 | 说明 |
|---|------|
| memory | 记忆翻翻乐 |
| quiz | Quiz答题 |
| spell | 拼写练习 |

#### 1.2.6 daily_activity 每日活动表
```sql
CREATE TABLE daily_activity (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    user_id INT NOT NULL COMMENT '用户ID',
    activity_date DATE NOT NULL COMMENT '活动日期',
    words_learned INT DEFAULT 0 COMMENT '当日学习单词数',
    time_spent INT DEFAULT 0 COMMENT '当日学习时长（秒）',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_date (user_id, activity_date),
    INDEX idx_activity_date (activity_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='每日学习活动表';
```

## 2. API接口设计

### 2.1 API基础信息
- **Base URL**: `http://localhost:3001/api`
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON
- **字符编码**: UTF-8

### 2.2 认证相关接口

#### 2.2.1 用户注册
```
POST /api/auth/register
Content-Type: application/json

Request:
{
  "username": "string",      // 用户名（必填，2-50字符）
  "password": "string",      // 密码（必填，最少4字符）
  "displayName": "string"    // 显示名称（可选，默认=username）
}

Response (201 Created):
{
  "success": true,
  "user": {
    "id": 1,
    "username": "testuser",
    "displayName": "测试用户"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (400 Bad Request):
{
  "error": "Username and password required"
}

Response (409 Conflict):
{
  "error": "Username already exists"
}
```

#### 2.2.2 用户登录
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "username": "string",      // 用户名
  "password": "string"       // 密码
}

Response (200 OK):
{
  "success": true,
  "user": {
    "id": 1,
    "username": "testuser",
    "displayName": "测试用户",
    "avatar": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (401 Unauthorized):
{
  "error": "Invalid username or password"
}
```

#### 2.2.3 登出
```
POST /api/auth/logout
Authorization: Bearer {token}

Response (200 OK):
{
  "success": true
}
```

#### 2.2.4 获取当前用户
```
GET /api/auth/me
Authorization: Bearer {token}

Response (200 OK):
{
  "user": {
    "id": 1,
    "username": "testuser",
    "display_name": "测试用户",
    "avatar": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "last_visit": "2024-01-01T00:00:00.000Z"
  }
}

Response (401 Unauthorized):
{
  "error": "Access token required"
}

Response (403 Forbidden):
{
  "error": "Invalid or expired token"
}
```

### 2.3 进度相关接口

#### 2.3.1 获取学习进度
```
GET /api/progress/:userId

Response (200 OK):
{
  "alphabet": 26,           // 学习的字母数量
  "vocabulary": {            // 词汇分类进度
    "colors": 10,
    "animals": 5
  },
  "sentences": 15,           // 学习的句子数量
  "gamesPlayed": 8,         // 玩的游戏次数
  "totalStars": 42          // 获得的星星总数
}

Response (500 Internal Server Error):
{
  "error": "Failed to fetch progress"
}
```

#### 2.3.2 保存学习进度
```
POST /api/progress/:userId
Content-Type: application/json

Request:
{
  "category": "alphabet",    // 类别
  "itemId": "A",             // 项目ID（可选）
  "value": 1,                // 数值
  "completed": false,       // 是否完成
  "stars": 1                // 星星数量
}

Response (200 OK):
{
  "success": true
}

Response (500 Internal Server Error):
{
  "error": "Failed to save progress"
}
```

### 2.4 成就相关接口

#### 2.4.1 获取用户成就
```
GET /api/achievements/:userId

Response (200 OK):
[
  "first_step",
  "alphabet_master"
]
```

#### 2.4.2 解锁成就
```
POST /api/achievements/:userId
Content-Type: application/json

Request:
{
  "achievementId": "alphabet_master"
}

Response (200 OK):
{
  "success": true
}
```

### 2.5 游戏相关接口

#### 2.5.1 获取游戏得分历史
```
GET /api/game-scores/:userId

Query Parameters:
- limit: number (可选，默认50)

Response (200 OK):
[
  {
    "game_type": "quiz",
    "score": 8,
    "played_at": "2024-01-01T12:00:00.000Z"
  },
  {
    "game_type": "memory",
    "score": 5,
    "played_at": "2024-01-01T11:00:00.000Z"
  }
]
```

#### 2.5.2 保存游戏得分
```
POST /api/game-scores/:userId
Content-Type: application/json

Request:
{
  "gameType": "quiz",
  "score": 8
}

Response (200 OK):
{
  "success": true
}
```

### 2.6 活动统计接口

#### 2.6.1 记录每日活动
```
POST /api/daily-activity/:userId
Content-Type: application/json

Request:
{
  "wordsLearned": 5,
  "timeSpent": 600
}

Response (200 OK):
{
  "success": true
}
```

### 2.7 系统接口

#### 2.7.1 健康检查
```
GET /api/health

Response (200 OK):
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 3. 前端组件设计

### 3.1 组件架构
```
App
├── AuthProvider (Context)
│   └── AppContent
│       ├── LoginPage (未认证时)
│       └── Layout (认证后)
│           ├── Navigation
│           └── Outlet
│               ├── Home
│               ├── Alphabet
│               ├── Vocabulary
│               ├── Sentences
│               ├── Games
│               │   ├── MemoryGame
│               │   ├── QuizGame
│               │   └── SpellGame
│               └── Progress
```

### 3.2 核心组件详细设计

#### 3.2.1 Layout 布局组件
```typescript
// 文件: src/components/Layout.tsx
interface LayoutProps {}  // 无props

// 状态:
- location: Location  // 当前路由
- user: User | null   // 当前用户
- logout: () => void  // 登出函数

// 功能:
1. 渲染顶部导航栏
2. 渲染页面内容区域
3. 渲染底部Footer
4. 处理用户登出

// 导航项:
const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/alphabet', label: '学字母', icon: '🔤' },
  { path: '/vocabulary', label: '学单词', icon: '📚' },
  { path: '/sentences', label: '学句子', icon: '💬' },
  { path: '/games', label: '玩游戏', icon: '🎮' },
  { path: '/progress', label: '我的进度', icon: '⭐' },
]
```

#### 3.2.2 AuthContext 认证上下文
```typescript
// 文件: src/contexts/AuthContext.tsx

interface User {
  id: number
  username: string
  displayName: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (username: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

// 生命周期:
1. 初始化时检查 localStorage 中的 token
2. 验证 token 有效性
3. 提供 login/register/logout 方法
4. 自动处理 token 过期
```

#### 3.2.3 Home 首页
```typescript
// 文件: src/pages/Home.tsx

interface LearningModule {
  path: string
  title: string
  subtitle: string
  description: string
  emoji: string
  color: string
  hoverColor: string
}

// 功能:
1. 展示4个学习模块卡片
2. 显示动画吉祥物角色
3. 根据日期展示学习提示
4. 动画过渡效果

// 每日提示逻辑:
function getDailyTip() {
  const tips = [/* 6个提示语 */]
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return tips[dayOfYear % tips.length]
}
```

#### 3.2.4 Alphabet 字母学习
```typescript
// 文件: src/pages/Alphabet.tsx

interface AlphabetData {
  letter: string      // 字母 A-Z
  word: string        // 配套单词
  emoji: string        // 对应emoji
  color: string        // 背景颜色类
}

// 状态:
- selectedLetter: string | null
- isPlaying: boolean

// 功能:
1. 网格展示26个字母
2. 点击字母播放发音
3. 显示选中字母的详细信息
4. 支持字母和单词发音切换

// 发音函数:
const speakLetter = (letter: string) => {
  speak(letter, 'en-US', 0.8)
}

const speakWord = (word: string) => {
  speak(word, 'en-US', 0.7)
}
```

#### 3.2.5 Vocabulary 词汇学习
```typescript
// 文件: src/pages/Vocabulary.tsx

interface Word {
  english: string
  chinese: string
  emoji: string
}

interface Category {
  id: string
  name: string
  emoji: string
  color: string
  words: Word[]
}

// 状态:
- selectedCategory: string
- currentWordIndex: number
- isFlipped: boolean

// 功能:
1. 6个词汇分类（颜色、动物、数字、食物、家庭、身体）
2. 翻转卡片展示（正面英文/背面中文）
3. 上一首/下一首导航
4. 快速跳转按钮

// 数据结构:
const categories: Category[] = [
  { id: 'colors', name: '颜色 Colors', emoji: '🎨', color: 'from-pink-400 to-rose-500', words: [...] },
  { id: 'animals', name: '动物 Animals', emoji: '🦁', color: 'from-amber-400 to-orange-500', words: [...] },
  // ...
]
```

#### 3.2.6 Sentences 句子学习
```typescript
// 文件: src/pages/Sentences.tsx

interface Sentence {
  english: string
  chinese: string
  emoji: string
  category: string
}

// 状态:
- selectedCategory: string  // 'all' | 'greetings' | 'introduction' | 'daily' | 'questions'
- playingIndex: number | null

// 功能:
1. 分类筛选句子
2. 点击句子播放发音
3. 播放状态动画指示
4. 显示英文和中文翻译

// 句子分类:
const categories = [
  { id: 'all', name: '全部 All', emoji: '🌟' },
  { id: 'greetings', name: '问候语', emoji: '👋' },
  { id: 'introduction', name: '自我介绍', emoji: '👤' },
  { id: 'daily', name: '日常表达', emoji: '🏠' },
  { id: 'questions', name: '提问', emoji: '❓' },
]
```

#### 3.2.7 Games 游戏中心
```typescript
// 文件: src/pages/Games.tsx

interface Game {
  id: 'memory' | 'quiz' | 'spell'
  name: string
  emoji: string
  description: string
  color: string
}

// 状态:
- selectedGame: string | null

// 子组件:
1. MemoryGame - 记忆翻翻乐
2. QuizGame - Quiz答题
3. SpellGame - 拼写练习
```

##### 3.2.7.1 MemoryGame 记忆翻翻乐
```typescript
// 状态:
- cards: string[]           // 16张卡片（8对emoji）
- flipped: number[]        // 当前翻开的卡片索引
- matched: number[]        // 已配对的卡片索引
- score: number            // 配对成功次数

// 游戏逻辑:
1. 初始化：16张卡片随机排列
2. 点击：翻开卡片（最多2张）
3. 匹配：2张相同则配对成功，否则翻回
4. 完成：所有卡片配对后显示胜利消息
```

##### 3.2.7.2 QuizGame Quiz答题
```typescript
// 状态:
- currentQ: number         // 当前题目索引
- score: number           // 得分
- selected: string | null // 用户选择的答案
- showResult: boolean     // 是否显示结果

// 游戏逻辑:
1. 显示emoji图片
2. 4个选项按钮
3. 选择后1.5秒自动下一题
4. 全部答完后显示结果
```

##### 3.2.7.3 SpellGame 拼写练习
```typescript
// 状态:
- currentWord: number      // 当前单词索引
- scrambled: string       // 打乱后的字母
- answer: string           // 用户输入的答案
- score: number            // 得分
- showSuccess: boolean     // 是否显示成功

// 游戏逻辑:
1. 显示提示emoji和中文
2. 点击打乱的字母组成单词
3. 正确自动下一题
4. 错误清空答案重试
```

#### 3.2.8 Progress 进度中心
```typescript
// 文件: src/pages/Progress.tsx

interface ProgressData {
  alphabet: number
  vocabulary: { [key: string]: number }
  sentences: number
  gamesPlayed: number
  totalStars: number
  lastVisit?: string
  streak?: number
}

interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  requirement: number
}

// 状态:
- progress: ProgressData
- earnedAchievements: string[]
- isLoading: boolean
- isDbConnected: boolean

// 功能:
1. 显示学习统计（字母/词汇/句子数量）
2. 显示游戏统计（游戏次数/连续天数）
3. 成就徽章展示（8种成就）
4. 数据存储状态指示
```

#### 3.2.9 Login 登录注册
```typescript
// 文件: src/pages/Login.tsx

interface LoginPageProps {
  onSuccess: () => void
}

// 状态:
- isLogin: boolean         // true=登录，false=注册
- username: string
- password: string
- displayName: string     // 仅注册时
- error: string
- isLoading: boolean

// 功能:
1. 登录/注册表单切换
2. 输入验证（用户名2-50字符，密码4字符以上）
3. 调用 AuthContext 的 login/register
4. 成功后调用 onSuccess 跳转
```

### 3.3 Hooks 设计

#### 3.3.1 useSound 语音Hook
```typescript
// 文件: src/hooks/useSound.ts

// 导出函数:
function useSound(): {
  playSound: (type: 'click' | 'success' | 'error' | 'complete') => void
  initAudio: () => void
}

function speak(text: string, lang?: string, rate?: number): Promise<void>

function isSpeechSupported(): boolean

function getAvailableVoices(): SpeechSynthesisVoice[]

function getVoiceForLang(lang: string): SpeechSynthesisVoice | null

function useProgress(): {
  saveProgress: (key: string, data: unknown) => void
  loadProgress: <T>(key: string, defaultValue: T) => T
}
```

## 4. 服务层设计

### 4.1 API 服务
```typescript
// 文件: src/services/api.ts

const API_BASE_URL = '/api'

// 导出方法:
const api = {
  // 进度
  getProgress: (userId: number) => Promise<ProgressData>
  saveProgress: (userId: number, data: ProgressData) => Promise<void>

  // 成就
  getAchievements: (userId: number) => Promise<string[]>
  unlockAchievement: (userId: number, achievementId: string) => Promise<void>

  // 游戏
  getGameScores: (userId: number, limit?: number) => Promise<GameScore[]>
  saveGameScore: (userId: number, gameType: string, score: number) => Promise<void>

  // 活动
  recordDailyActivity: (userId: number, wordsLearned: number, timeSpent: number) => Promise<void>
}
```

## 5. 数据模型

### 5.1 前端数据模型

#### User 模型
```typescript
interface User {
  id: number
  username: string
  displayName: string
  avatar?: string
}
```

#### ProgressData 模型
```typescript
interface ProgressData {
  alphabet: number           // 0-26
  vocabulary: {
    [category: string]: number  // 各分类学习的单词数
  }
  sentences: number          // 学习的句子总数
  gamesPlayed: number       // 游戏次数
  totalStars: number         // 星星总数
  lastVisit?: string        // ISO时间字符串
  streak?: number            // 连续学习天数
}
```

### 5.2 状态管理策略
- **用户认证状态**: AuthContext (React Context)
- **学习进度**: localStorage + API
- **游戏状态**: 组件内部 useState
- **UI状态**: 组件内部 useState + useRef

## 6. 业务流程

### 6.1 用户注册流程
```
1. 用户输入用户名、密码、显示名称
2. 前端验证输入（用户名2-50字符，密码4字符以上）
3. 调用 POST /api/auth/register
4. 后端验证：
   - 检查用户名是否已存在
   - 密码使用 SHA256 + 盐值哈希
   - 创建用户记录
   - 生成 Token (32字节随机字符串)
   - 创建会话记录（7天有效期）
5. 返回成功响应和 Token
6. 前端保存 Token 到 localStorage
7. 跳转到首页
```

### 6.2 用户登录流程
```
1. 用户输入用户名、密码
2. 前端验证输入
3. 调用 POST /api/auth/login
4. 后端验证：
   - 查询用户
   - 验证密码哈希
   - 生成新 Token
   - 创建会话记录
   - 更新用户最后访问时间
5. 返回成功响应和 Token
6. 前端保存 Token 和用户信息
7. 跳转到首页
```

### 6.3 进度保存流程
```
1. 用户完成学习（如学习一个单词）
2. 前端更新本地状态
3. 调用 POST /api/progress/:userId 保存到数据库
4. 同时保存到 localStorage 作为备份
5. 检查成就解锁条件
6. 如有新成就，调用 POST /api/achievements/:userId
```

### 6.4 语音播放流程
```
1. 用户点击发音按钮
2. 调用 speak(text, lang, rate) 函数
3. 检查浏览器是否支持 speechSynthesis
4. 取消之前的语音（speechSynthesis.cancel()）
5. 创建 SpeechSynthesisUtterance 对象
6. 选择合适的语音（优先英文语音）
7. 设置完成回调（onend）和错误回调（onerror）
8. 调用 speechSynthesis.speak() 播放
9. 播放完成或出错时执行回调
```

## 7. 错误处理

### 7.1 前端错误处理策略

#### 网络错误
```typescript
// API 调用错误处理
try {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return await response.json()
} catch (error) {
  console.warn('Network error:', error)
  // 使用本地缓存作为fallback
  return loadFromLocalStorage()
}
```

#### 语音错误
```typescript
const speak = (text: string, lang: string = 'en-US', rate: number = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      return reject(new Error('Speech synthesis not supported'))
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onend = () => resolve()
    utterance.onerror = (event) => {
      console.warn('Speech error:', event.error)
      reject(event)
    }
    speechSynthesis.speak(utterance)
  })
}
```

### 7.2 后端错误处理

#### 错误响应格式
```json
{
  "error": "错误描述信息"
}
```

#### HTTP 状态码
| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | Token无效或过期 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如用户名已存在）|
| 500 | 服务器内部错误 |

## 8. 安全考虑

### 8.1 密码安全
- 使用 SHA256 + 盐值哈希存储密码
- 盐值: `kids_english_salt`
- 公式: `hash = SHA256(password + salt)`

### 8.2 认证安全
- Token 长度: 64字符（32字节十六进制）
- Token 有效期: 7天
- Token 存储: localStorage（前端）+ 数据库（后端）

### 8.3 API安全
- 所有认证接口需要 Bearer Token
- 使用 CORS 中间件
- JSON 请求体解析

### 8.4 输入验证
```javascript
// 用户名验证
if (username.length < 2 || username.length > 50) {
  return res.status(400).json({ error: 'Username must be 2-50 characters' })
}

// 密码验证
if (password.length < 4) {
  return res.status(400).json({ error: 'Password must be at least 4 characters' })
}
```

## 9. 性能优化

### 9.1 前端优化
- 使用 Vite 进行构建优化
- React 组件懒加载
- Tailwind CSS 按需编译
- 动画使用 CSS transform 和 opacity

### 9.2 后端优化
- MySQL 连接池（10个连接）
- 索引优化（username, token, expires_at）
- 数据库操作使用 prepared statements

## 10. 测试要点

### 10.1 功能测试
- [ ] 用户注册/登录/登出
- [ ] 字母学习发音
- [ ] 词汇翻转和发音
- [ ] 句子学习发音
- [ ] 游戏交互和得分
- [ ] 进度保存和加载
- [ ] 成就解锁

### 10.2 兼容性测试
- [ ] Chrome 浏览器
- [ ] Firefox 浏览器
- [ ] Safari 浏览器
- [ ] Edge 浏览器
- [ ] 移动端浏览器

### 10.3 语音功能测试
- [ ] 英文发音
- [ ] 不同语速
- [ ] 错误处理
- [ ] 连续点击处理
