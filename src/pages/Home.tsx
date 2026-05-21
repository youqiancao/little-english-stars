import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const learningModules = [
  {
    path: '/alphabet',
    title: '字母学习',
    subtitle: 'Learn ABC',
    description: '认识26个英文字母',
    emoji: '🔤',
    color: 'from-red-400 to-pink-500',
    hoverColor: 'hover:from-red-500 hover:to-pink-600',
  },
  {
    path: '/vocabulary',
    title: '词汇乐园',
    subtitle: 'Vocabulary',
    description: '学习常用英语单词',
    emoji: '📚',
    color: 'from-blue-400 to-cyan-500',
    hoverColor: 'hover:from-blue-500 hover:to-cyan-600',
  },
  {
    path: '/sentences',
    title: '简单句子',
    subtitle: 'Sentences',
    description: '学说日常英语',
    emoji: '💬',
    color: 'from-green-400 to-emerald-500',
    hoverColor: 'hover:from-green-500 hover:to-emerald-600',
  },
  {
    path: '/games',
    title: '趣味游戏',
    subtitle: 'Games',
    description: '在游戏中学习',
    emoji: '🎮',
    color: 'from-yellow-400 to-orange-500',
    hoverColor: 'hover:from-yellow-500 hover:to-orange-600',
  },
]

const characters = [
  { emoji: '🦁', name: 'Leo', delay: 0 },
  { emoji: '🐰', name: 'Bella', delay: 0.2 },
  { emoji: '🐻', name: 'Teddy', delay: 0.4 },
  { emoji: '🦊', name: 'Felix', delay: 0.6 },
]

export default function Home() {
  return (
    <div className="min-h-screen py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
            animate={{ 
              textShadow: [
                '0 0 20px rgba(255,255,255,0.5)',
                '0 0 40px rgba(255,255,255,0.8)',
                '0 0 20px rgba(255,255,255,0.5)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🌈 欢迎来到儿童英语乐园 🌈
          </motion.h1>
          <p className="text-xl text-white text-opacity-90">
            Welcome to Kids English Paradise!
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-12">
          {characters.map((char, index) => (
            <motion.div
              key={char.name}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: char.delay }}
            >
              <motion.div
                className="text-6xl mb-2"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [-5, 5, -5],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              >
                {char.emoji}
              </motion.div>
              <p className="text-white font-bold text-sm">{char.name}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {learningModules.map((module, index) => (
            <motion.div
              key={module.path}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={module.path}>
                <motion.div
                  className={`bg-gradient-to-br ${module.color} ${module.hoverColor} rounded-3xl p-6 card-shadow hover-lift cursor-pointer h-full`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className="text-6xl mb-4"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    {module.emoji}
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-1">{module.title}</h2>
                  <p className="text-white text-opacity-80 text-sm mb-2">{module.subtitle}</p>
                  <p className="text-white text-opacity-70 text-xs">{module.description}</p>
                  
                  <motion.div 
                    className="mt-4 flex items-center gap-2 text-white"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <span className="text-sm font-medium">开始学习</span>
                    <span>→</span>
                  </motion.div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white mb-4">✨ 今日提示 ✨</h2>
          <p className="text-white text-lg">
            {getDailyTip()}
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

function getDailyTip() {
  const tips = [
    '🎯 每天学习10分钟，比一周学一次更有效哦！',
    '🌟 尝试用英语数一数你身边的物品吧！',
    '🎵 唱英文儿歌是很好的学习方法呢！',
    '📺 可以看一些简单的英文动画片！',
    '🗣️ 勇敢开口说，你会越来越棒的！',
    '⭐ 完成了学习模块别忘了来看进度哦！',
  ]
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return tips[dayOfYear % tips.length]
}