import { H1, H2, H3, Stack, Grid, Card, CardHeader, CardBody, Text, Stat, Table, Progress, Tag, Divider, Callout } from 'qoder/canvas'

export default function LittleEnglishStarsPresentation() {
  return (
    <Stack gap={24}>
      {/* Title Slide */}
      <Card>
        <CardBody>
          <Stack gap={16} align="center">
            <H1>🌟 少儿英语学习平台</H1>
            <Text size="body" tone="secondary">Little English Stars - Interactive Learning Platform</Text>
            <Text size="small" tone="tertiary">项目演示与技术分析</Text>
          </Stack>
        </CardBody>
      </Card>

      {/* Project Overview */}
      <Card>
        <CardHeader title={<H2>项目概述</H2>} />
        <CardBody>
          <Stack gap={12}>
            <Text><strong>项目定位：</strong>专为儿童设计的互动式英语学习平台</Text>
            <Text><strong>技术架构：</strong>React SPA + TypeScript + Vite + TailwindCSS</Text>
            <Text><strong>核心特色：</strong>游戏化学习、进度追踪、语音合成、动画交互</Text>
            <Text><strong>目标用户：</strong>3-8岁儿童英语学习者</Text>
          </Stack>
        </CardBody>
      </Card>

      {/* Technology Stack */}
      <Card>
        <CardHeader title={<H2>技术栈</H2>} />
        <CardBody>
          <Grid columns={3} gap={16}>
            <Stat label="前端框架" value="React 18" />
            <Stat label="开发语言" value="TypeScript 5" />
            <Stat label="构建工具" value="Vite 5" />
            <Stat label="UI样式" value="TailwindCSS" />
            <Stat label="动画库" value="Framer Motion" />
            <Stat label="路由管理" value="React Router" />
          </Grid>
          <Divider />
          <Stack gap={8}>
            <Text><strong>后端服务：</strong>Node.js + Express + MySQL</Text>
            <Text><strong>认证方式：</strong>JWT Token + Session管理</Text>
            <Text><strong>语音功能：</strong>Web Speech API (TTS)</Text>
          </Stack>
        </CardBody>
      </Card>

      {/* Core Features */}
      <Card>
        <CardHeader title={<H2>核心功能模块</H2>} />
        <CardBody>
          <Grid columns={2} gap={16}>
            <Card variant="borderless">
              <CardHeader title={<H3>🔤 字母学习</H3>} />
              <CardBody>
                <Stack gap={8}>
                  <Text>• 26个英文字母交互式学习</Text>
                  <Text>• 每个字母配对应单词和emoji</Text>
                  <Text>• 点击发音功能（字母+单词）</Text>
                  <Text>• 学习进度自动记录</Text>
                </Stack>
              </CardBody>
            </Card>
            
            <Card variant="borderless">
              <CardHeader title={<H3>📚 词汇乐园</H3>} />
              <CardBody>
                <Stack gap={8}>
                  <Text>• 分类词汇学习（动物、颜色、数字等）</Text>
                  <Text>• 图文结合记忆法</Text>
                  <Text>• 发音练习与重复听读</Text>
                  <Text>• 词汇掌握度追踪</Text>
                </Stack>
              </CardBody>
            </Card>
            
            <Card variant="borderless">
              <CardHeader title={<H3>💬 简单句子</H3>} />
              <CardBody>
                <Stack gap={8}>
                  <Text>• 日常英语句型学习</Text>
                  <Text>• 情景对话练习</Text>
                  <Text>• 句子结构理解</Text>
                  <Text>• 口语表达训练</Text>
                </Stack>
              </CardBody>
            </Card>
            
            <Card variant="borderless">
              <CardHeader title={<H3>🎮 趣味游戏</H3>} />
              <CardBody>
                <Stack gap={8}>
                  <Text>• 记忆翻翻乐（配对游戏）</Text>
                  <Text>• Quiz答题挑战</Text>
                  <Text>• 拼写练习游戏</Text>
                  <Text>• 游戏成绩记录与排名</Text>
                </Stack>
              </CardBody>
            </Card>
          </Grid>
        </CardBody>
      </Card>

      {/* User System */}
      <Card>
        <CardHeader title={<H2>用户系统</H2>} />
        <CardBody>
          <Stack gap={12}>
            <Text><strong>注册登录：</strong>用户名密码认证，支持新用户注册</Text>
            <Text><strong>会话管理：</strong>JWT Token认证，7天有效期</Text>
            <Text><strong>数据持久化：</strong>localStorage保存登录状态</Text>
            <Text><strong>权限控制：</strong>未登录用户自动跳转登录页</Text>
            <Text><strong>用户资料：</strong>显示名称、头像、注册时间等</Text>
          </Stack>
        </CardBody>
      </Card>

      {/* Progress Tracking */}
      <Card>
        <CardHeader title={<H2>学习进度追踪</H2>} />
        <CardBody>
          <Grid columns={3} gap={16}>
            <Stat label="字母掌握" value="26/26" />
            <Stat label="词汇学习" value="50+" />
            <Stat label="游戏完成" value="实时记录" />
          </Grid>
          <Divider />
          <Stack gap={8}>
            <Text><strong>进度同步：</strong>实时同步到后端数据库</Text>
            <Text><strong>成就系统：</strong>学习里程碑奖励</Text>
            <Text><strong>每日活动：</strong>记录学习时长和词汇量</Text>
            <Text><strong>数据统计：</strong>可视化学习报告</Text>
          </Stack>
        </CardBody>
      </Card>

      {/* Database Schema */}
      <Card>
        <CardHeader title={<H2>数据库设计</H2>} />
        <CardBody>
          <Table
            headers={['表名', '用途', '关键字段']}
            rows={[
              ['users', '用户信息', 'id, username, password_hash, display_name'],
              ['user_sessions', '会话管理', 'user_id, token, expires_at'],
              ['progress', '学习进度', 'user_id, category, item_id, value'],
              ['achievements', '成就记录', 'user_id, achievement_id, earned_at'],
              ['game_scores', '游戏成绩', 'user_id, game_type, score, played_at'],
              ['daily_activity', '每日活动', 'user_id, activity_date, words_learned']
            ]}
          />
        </CardBody>
      </Card>

      {/* UI/UX Design */}
      <Card>
        <CardHeader title={<H2>界面设计特色</H2>} />
        <CardBody>
          <Stack gap={12}>
            <Text><strong>色彩方案：</strong>明亮渐变色系，符合儿童审美</Text>
            <Text><strong>动画效果：</strong>Framer Motion实现流畅交互动画</Text>
            <Text><strong>响应式设计：</strong>TailwindCSS适配不同屏幕尺寸</Text>
            <Text><strong>图标系统：</strong>Emoji表情增强视觉趣味性</Text>
            <Text><strong>卡片布局：</strong>圆角卡片设计，友好亲和</Text>
            <Text><strong>加载状态：</strong>旋转星星动画提升体验</Text>
          </Stack>
        </CardBody>
      </Card>

      {/* API Architecture */}
      <Card>
        <CardHeader title={<H2>API架构</H2>} />
        <CardBody>
          <Table
            headers={['端点', '方法', '功能描述']}
            rows={[
              ['/api/auth/register', 'POST', '用户注册'],
              ['/api/auth/login', 'POST', '用户登录'],
              ['/api/auth/logout', 'POST', '用户登出'],
              ['/api/auth/me', 'GET', '获取当前用户信息'],
              ['/api/progress/:userId', 'GET/POST', '学习进度查询/更新'],
              ['/api/achievements/:userId', 'GET/POST', '成就管理'],
              ['/api/game-scores/:userId', 'GET/POST', '游戏成绩管理'],
              ['/api/daily-activity/:userId', 'POST', '每日活动记录']
            ]}
          />
        </CardBody>
      </Card>

      {/* Development Environment */}
      <Card>
        <CardHeader title={<H2>开发环境配置</H2>} />
        <CardBody>
          <Stack gap={12}>
            <Text><strong>前端端口：</strong>5173 (Vite开发服务器)</Text>
            <Text><strong>后端端口：</strong>3001 (Express服务器)</Text>
            <Text><strong>API代理：</strong>/api → http://localhost:3001</Text>
            <Text><strong>主机绑定：</strong>0.0.0.0 (支持局域网访问)</Text>
            <Text><strong>日志系统：</strong>按日期分割的JSON格式日志</Text>
            <Text><strong>热重载：</strong>Vite HMR实时更新</Text>
          </Stack>
        </CardBody>
      </Card>

      {/* Key Features Highlight */}
      <Card>
        <CardHeader title={<H2>技术亮点</H2>} />
        <CardBody>
          <Grid columns={2} gap={16}>
            <Callout type="success" title="语音合成">
              <Text>集成Web Speech API，实现字母和单词的标准发音</Text>
            </Callout>
            <Callout type="info" title="动画交互">
              <Text>Framer Motion提供丰富的页面过渡和元素动画效果</Text>
            </Callout>
            <Callout type="warning" title="进度同步">
              <Text>实时学习进度追踪，支持多设备数据同步</Text>
            </Callout>
            <Callout type="danger" title="安全认证">
              <Text>JWT Token + Session双重验证，保障用户数据安全</Text>
            </Callout>
          </Grid>
        </CardBody>
      </Card>

      {/* Future Enhancements */}
      <Card>
        <CardHeader title={<H2>未来扩展方向</H2>} />
        <CardBody>
          <Stack gap={12}>
            <Text><strong>内容扩展：</strong>增加更多词汇分类和句型模板</Text>
            <Text><strong>社交功能：</strong>好友系统、学习排行榜</Text>
            <Text><strong>AI辅助：</strong>智能推荐学习内容，个性化学习路径</Text>
            <Text><strong>移动端：</strong>React Native跨平台移动应用</Text>
            <Text><strong>多媒体：</strong>视频教学内容、儿歌音频</Text>
            <Text><strong>家长端：</strong>学习报告推送、学习时间管理</Text>
          </Stack>
        </CardBody>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader title={<H2>项目总结</H2>} />
        <CardBody>
          <Stack gap={12}>
            <Text><strong>✅ 完整的前后端分离架构</strong></Text>
            <Text><strong>✅ 丰富的互动学习功能</strong></Text>
            <Text><strong>✅ 现代化的技术栈选型</strong></Text>
            <Text><strong>✅ 良好的用户体验设计</strong></Text>
            <Text><strong>✅ 可扩展的系统架构</strong></Text>
            <Divider />
            <Text tone="primary"><strong>这是一个功能完整、技术先进的少儿英语学习平台，为儿童提供了有趣、有效的英语学习体验。</strong></Text>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  )
}