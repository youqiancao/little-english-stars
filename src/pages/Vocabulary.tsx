import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { speak } from '../hooks/useSound'

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

const categories: Category[] = [
  {
    id: 'colors',
    name: '颜色 Colors',
    emoji: '🎨',
    color: 'from-pink-400 to-rose-500',
    words: [
      { english: 'Red', chinese: '红色', emoji: '🔴' },
      { english: 'Blue', chinese: '蓝色', emoji: '🔵' },
      { english: 'Yellow', chinese: '黄色', emoji: '🟡' },
      { english: 'Green', chinese: '绿色', emoji: '🟢' },
      { english: 'Orange', chinese: '橙色', emoji: '🟠' },
      { english: 'Purple', chinese: '紫色', emoji: '🟣' },
      { english: 'Pink', chinese: '粉色', emoji: '💗' },
      { english: 'Black', chinese: '黑色', emoji: '⚫' },
      { english: 'White', chinese: '白色', emoji: '⚪' },
      { english: 'Brown', chinese: '棕色', emoji: '🟤' },
    ],
  },
  {
    id: 'animals',
    name: '动物 Animals',
    emoji: '🦁',
    color: 'from-amber-400 to-orange-500',
    words: [
      { english: 'Cat', chinese: '猫', emoji: '🐱' },
      { english: 'Dog', chinese: '狗', emoji: '🐕' },
      { english: 'Bird', chinese: '鸟', emoji: '🐦' },
      { english: 'Fish', chinese: '鱼', emoji: '🐟' },
      { english: 'Rabbit', chinese: '兔子', emoji: '🐰' },
      { english: 'Bear', chinese: '熊', emoji: '🐻' },
      { english: 'Lion', chinese: '狮子', emoji: '🦁' },
      { english: 'Tiger', chinese: '老虎', emoji: '🐯' },
      { english: 'Elephant', chinese: '大象', emoji: '🐘' },
      { english: 'Monkey', chinese: '猴子', emoji: '🐵' },
    ],
  },
  {
    id: 'numbers',
    name: '数字 Numbers',
    emoji: '🔢',
    color: 'from-cyan-400 to-blue-500',
    words: [
      { english: 'One', chinese: '一', emoji: '1️⃣' },
      { english: 'Two', chinese: '二', emoji: '2️⃣' },
      { english: 'Three', chinese: '三', emoji: '3️⃣' },
      { english: 'Four', chinese: '四', emoji: '4️⃣' },
      { english: 'Five', chinese: '五', emoji: '5️⃣' },
      { english: 'Six', chinese: '六', emoji: '6️⃣' },
      { english: 'Seven', chinese: '七', emoji: '7️⃣' },
      { english: 'Eight', chinese: '八', emoji: '8️⃣' },
      { english: 'Nine', chinese: '九', emoji: '9️⃣' },
      { english: 'Ten', chinese: '十', emoji: '🔟' },
    ],
  },
  {
    id: 'food',
    name: '食物 Food',
    emoji: '🍎',
    color: 'from-green-400 to-emerald-500',
    words: [
      { english: 'Apple', chinese: '苹果', emoji: '🍎' },
      { english: 'Banana', chinese: '香蕉', emoji: '🍌' },
      { english: 'Orange', chinese: '橙子', emoji: '🍊' },
      { english: 'Bread', chinese: '面包', emoji: '🍞' },
      { english: 'Milk', chinese: '牛奶', emoji: '🥛' },
      { english: 'Egg', chinese: '鸡蛋', emoji: '🥚' },
      { english: 'Rice', chinese: '米饭', emoji: '🍚' },
      { english: 'Cake', chinese: '蛋糕', emoji: '🎂' },
      { english: 'Cookie', chinese: '饼干', emoji: '🍪' },
      { english: 'Ice cream', chinese: '冰淇淋', emoji: '🍦' },
    ],
  },
  {
    id: 'family',
    name: '家庭 Family',
    emoji: '👨‍👩‍👧',
    color: 'from-violet-400 to-purple-500',
    words: [
      { english: 'Mom', chinese: '妈妈', emoji: '👩' },
      { english: 'Dad', chinese: '爸爸', emoji: '👨' },
      { english: 'Sister', chinese: '姐姐/妹妹', emoji: '👧' },
      { english: 'Brother', chinese: '哥哥/弟弟', emoji: '👦' },
      { english: 'Baby', chinese: '宝宝', emoji: '👶' },
      { english: 'Grandma', chinese: '奶奶/外婆', emoji: '👵' },
      { english: 'Grandpa', chinese: '爷爷/外公', emoji: '👴' },
      { english: 'Friend', chinese: '朋友', emoji: '👫' },
    ],
  },
  {
    id: 'body',
    name: '身体 Body',
    emoji: '🧍',
    color: 'from-teal-400 to-cyan-500',
    words: [
      { english: 'Head', chinese: '头', emoji: '🗣️' },
      { english: 'Eye', chinese: '眼睛', emoji: '👁️' },
      { english: 'Ear', chinese: '耳朵', emoji: '👂' },
      { english: 'Nose', chinese: '鼻子', emoji: '👃' },
      { english: 'Mouth', chinese: '嘴巴', emoji: '👄' },
      { english: 'Hand', chinese: '手', emoji: '✋' },
      { english: 'Foot', chinese: '脚', emoji: '🦶' },
      { english: 'Heart', chinese: '心脏', emoji: '❤️' },
    ],
  },
]

export default function Vocabulary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('colors')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const category = categories.find(c => c.id === selectedCategory)!
  const currentWord = category.words[currentWordIndex]

  const speakWord = (word: string) => {
    speak(word, 'en-US', 0.7).catch(error => {
      console.warn('Speech synthesis failed:', error)
    })
  }

  const nextWord = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentWordIndex((prev) => 
        prev === category.words.length - 1 ? 0 : prev + 1
      )
    }, 150)
  }

  const prevWord = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentWordIndex((prev) => 
        prev === 0 ? category.words.length - 1 : prev - 1
      )
    }, 150)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            📚 词汇乐园 - Vocabulary Paradise 📚
          </h1>
          <p className="text-white text-opacity-90">选择一个类别开始学习！</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id)
                setCurrentWordIndex(0)
                setIsFlipped(false)
              }}
              className={`px-4 py-2 rounded-full font-bold text-white transition-all ${
                selectedCategory === cat.id
                  ? `bg-gradient-to-r ${cat.color} scale-105 shadow-lg`
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="mr-1">{cat.emoji}</span>
              <span className="hidden sm:inline">{cat.name}</span>
            </motion.button>
          ))}
        </div>

        <div className="mb-6 text-center">
          <div className="inline-block bg-white bg-opacity-20 rounded-full px-4 py-2 text-white">
            <span className="font-bold">{currentWordIndex + 1}</span> / {category.words.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${currentWordIndex}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="max-w-md mx-auto"
          >
            <motion.div
              className="bg-white rounded-3xl p-8 card-shadow cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <motion.div
                  className="text-8xl mb-4"
                  animate={isFlipped ? {} : { 
                    y: [0, -10, 0],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {currentWord.emoji}
                </motion.div>

                <AnimatePresence mode="wait">
                  {!isFlipped ? (
                    <motion.div
                      key="english"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h2 className="text-4xl font-bold text-gray-800 mb-2">
                        {currentWord.english}
                      </h2>
                      <p className="text-gray-500 text-lg">点击查看中文</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="chinese"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h2 className="text-4xl font-bold text-purple-600 mb-2">
                        {currentWord.chinese}
                      </h2>
                      <p className="text-gray-500 text-lg">点击返回英文</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            onClick={prevWord}
            className="bg-white bg-opacity-90 text-gray-800 px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>⬅️</span> 上一个
          </motion.button>

          <motion.button
            onClick={() => speakWord(currentWord.english)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔊 发音
          </motion.button>

          <motion.button
            onClick={nextWord}
            className="bg-white bg-opacity-90 text-gray-800 px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            下一个 <span>➡️</span>
          </motion.button>
        </div>

        <motion.div
          className="mt-8 bg-white bg-opacity-10 rounded-2xl p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {category.words.map((word, index) => (
              <motion.button
                key={word.english}
                onClick={() => {
                  setCurrentWordIndex(index)
                  setIsFlipped(false)
                }}
                className={`aspect-square rounded-xl flex items-center justify-center text-2xl transition-all ${
                  currentWordIndex === index
                    ? 'bg-white shadow-lg scale-110'
                    : 'bg-white bg-opacity-20 hover:bg-opacity-40'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {word.emoji}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}