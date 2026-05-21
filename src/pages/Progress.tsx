import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'

interface ProgressData {
  alphabet: number
  vocabulary: { [key: string]: number }
  sentences: number
  gamesPlayed: number
  totalStars: number
  lastVisit?: string
  streak?: number
}

const initialProgress: ProgressData = {
  alphabet: 0,
  vocabulary: {},
  sentences: 0,
  gamesPlayed: 0,
  totalStars: 0,
  lastVisit: new Date().toISOString(),
  streak: 1,
}

const achievements = [
  { id: 'first_step', name: '第一步', description: '完成第一次学习', emoji: '👶', requirement: 1 },
  { id: 'alphabet_master', name: '字母大师', description: '学习完所有26个字母', emoji: '🔤', requirement: 26 },
  { id: 'vocab_explorer', name: '词汇探险家', description: '学习100个单词', emoji: '📚', requirement: 100 },
  { id: 'sentence_builder', name: '句子建筑师', description: '学习50个句子', emoji: '🏗️', requirement: 50 },
  { id: 'game_master', name: '游戏大师', description: '玩10次游戏', emoji: '🎮', requirement: 10 },
  { id: 'star_collector', name: '星星收藏家', description: '获得50颗星星', emoji: '⭐', requirement: 50 },
  { id: 'week_warrior', name: '坚持一周', description: '连续学习7天', emoji: '🔥', requirement: 7 },
  { id: 'perfect_score', name: '满分达人', description: '在Quiz中获得满分', emoji: '🏆', requirement: 1 },
]

export default function Progress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<ProgressData>(initialProgress)
  const [earnedAchievements, setEarnedAchievements] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDbConnected, setIsDbConnected] = useState(false)

  useEffect(() => {
    if (user) {
      loadProgress()
    }

    // 监听 storage 事件，当其他页面更新进度时自动刷新
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('kidsEnglishProgress_')) {
        loadProgress()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    // 每次页面获得焦点时刷新进度
    const handleFocus = () => {
      if (user) loadProgress()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [user])

  const loadProgress = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const dbProgress = await api.getProgress(user.id)
      if (dbProgress) {
        setProgress({ ...initialProgress, ...dbProgress })
        setIsDbConnected(true)
      } else {
        const saved = localStorage.getItem(`kidsEnglishProgress_${user.id}`)
        if (saved) {
          const parsed = JSON.parse(saved)
          setProgress(parsed)
        } else {
          const demoProgress: ProgressData = {
            alphabet: 0,
            vocabulary: {},
            sentences: 0,
            gamesPlayed: 0,
            totalStars: 0,
            lastVisit: new Date().toISOString(),
            streak: 1,
          }
          setProgress(demoProgress)
        }
      }

      const dbAchievements = await api.getAchievements(user.id)
      if (dbAchievements.length > 0) {
        setEarnedAchievements(dbAchievements)
      } else {
        checkAchievements(progress)
      }
    } catch {
      const saved = localStorage.getItem(`kidsEnglishProgress_${user.id}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        setProgress(parsed)
        checkAchievements(parsed)
      } else {
        const demoProgress: ProgressData = {
          alphabet: 0,
          vocabulary: {},
          sentences: 0,
          gamesPlayed: 0,
          totalStars: 0,
          lastVisit: new Date().toISOString(),
          streak: 1,
        }
        setProgress(demoProgress)
        checkAchievements(demoProgress)
      }
    }
    setIsLoading(false)
  }

  const checkAchievements = (data: ProgressData) => {
    const earned: string[] = []
    const totalVocab = Object.values(data.vocabulary).reduce((a, b) => a + b, 0)

    if (data.alphabet > 0 || data.sentences > 0 || totalVocab > 0) earned.push('first_step')
    if (data.alphabet >= 26) earned.push('alphabet_master')
    if (totalVocab >= 100) earned.push('vocab_explorer')
    if (data.sentences >= 50) earned.push('sentence_builder')
    if (data.gamesPlayed >= 10) earned.push('game_master')
    if (data.totalStars >= 50) earned.push('star_collector')
    if (data.streak && data.streak >= 7) earned.push('week_warrior')

    setEarnedAchievements(earned)
  }

  const totalVocab = Object.values(progress.vocabulary).reduce((a, b) => a + b, 0)
  const totalWords = progress.alphabet + totalVocab + progress.sentences

  const totalAchievements = achievements.length
  const earnedCount = earnedAchievements.length

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            ⭐ 我的进度 - My Progress ⭐
          </h1>
          <p className="text-white text-opacity-90">看看你有多厉害！</p>
          {isDbConnected && (
            <div className="mt-2 inline-flex items-center gap-2 bg-green-500 bg-opacity-20 text-green-300 px-4 py-2 rounded-full text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              数据库已连接
            </div>
          )}
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl p-6 card-shadow mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-center gap-8 mb-6">
            <motion.div
              className="text-center"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-8xl mb-2">🎉</div>
            </motion.div>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                {totalWords}
              </h2>
              <p className="text-gray-600">总共学习内容</p>
            </div>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-yellow-500 mb-2">
                {progress.totalStars}
              </h2>
              <p className="text-gray-600">星星数量</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl p-4 text-center text-white">
              <div className="text-3xl mb-1">🔤</div>
              <div className="text-2xl font-bold">{progress.alphabet}</div>
              <div className="text-sm opacity-80">字母</div>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-4 text-center text-white">
              <div className="text-3xl mb-1">📚</div>
              <div className="text-2xl font-bold">{totalVocab}</div>
              <div className="text-sm opacity-80">词汇</div>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-4 text-center text-white">
              <div className="text-3xl mb-1">💬</div>
              <div className="text-2xl font-bold">{progress.sentences}</div>
              <div className="text-sm opacity-80">句子</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl p-6 card-shadow mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🎮 游戏统计
          </h3>
          <div className="flex gap-4">
            <div className="flex-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-4 text-center text-white">
              <div className="text-3xl font-bold">{progress.gamesPlayed}</div>
              <div className="text-sm opacity-80">游戏次数</div>
            </div>
            <div className="flex-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl p-4 text-center text-white">
              <div className="text-3xl font-bold">{progress.streak || 1}</div>
              <div className="text-sm opacity-80">连续学习天数</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-3xl p-6 card-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🏆 成就奖励 ({earnedCount}/{totalAchievements})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => {
              const isEarned = earnedAchievements.includes(achievement.id)
              return (
                <motion.div
                  key={achievement.id}
                  className={`rounded-2xl p-4 text-center transition-all ${
                    isEarned
                      ? 'bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-lg'
                      : 'bg-gray-100 opacity-60'
                  }`}
                  whileHover={isEarned ? { scale: 1.05 } : {}}
                >
                  <motion.div
                    className={`text-4xl mb-2 ${isEarned ? '' : 'grayscale'}`}
                    animate={isEarned ? {
                      rotate: [0, 10, -10, 0],
                    } : {}}
                    transition={{ duration: 0.5, repeat: isEarned ? Infinity : 0 }}
                  >
                    {achievement.emoji}
                  </motion.div>
                  <h4 className={`font-bold text-sm ${isEarned ? 'text-yellow-700' : 'text-gray-500'}`}>
                    {achievement.name}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {achievement.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          className="mt-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl p-6 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-2">📊 数据存储</h3>
          <p className="text-sm opacity-90">
            {isDbConnected ? '您的学习进度已保存到 MySQL 数据库' : '您的学习进度保存在本地（离线可用）'}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
