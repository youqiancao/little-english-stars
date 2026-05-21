import { useState } from 'react'
import { motion } from 'framer-motion'
import { speak } from '../hooks/useSound'
import { useProgressSync } from '../hooks/useProgressSync'

interface Sentence {
  english: string
  chinese: string
  emoji: string
  category: string
}

const sentences: Sentence[] = [
  { english: 'Hello!', chinese: '你好！', emoji: '👋', category: 'greetings' },
  { english: 'Good morning!', chinese: '早上好！', emoji: '🌅', category: 'greetings' },
  { english: 'Good night!', chinese: '晚安！', emoji: '🌙', category: 'greetings' },
  { english: 'Thank you!', chinese: '谢谢你！', emoji: '🙏', category: 'greetings' },
  { english: 'You are welcome!', chinese: '不客气！', emoji: '😊', category: 'greetings' },
  { english: 'How are you?', chinese: '你好吗？', emoji: '🤔', category: 'greetings' },
  { english: "I'm good, thank you!", chinese: '我很好，谢谢！', emoji: '😄', category: 'greetings' },
  { english: 'Nice to meet you!', chinese: '很高兴认识你！', emoji: '🤝', category: 'greetings' },
  
  { english: 'My name is...', chinese: '我的名字是...', emoji: '📛', category: 'introduction' },
  { english: 'I am a boy.', chinese: '我是一个男孩。', emoji: '👦', category: 'introduction' },
  { english: 'I am a girl.', chinese: '我是一个女孩。', emoji: '👧', category: 'introduction' },
  { english: 'I am 6 years old.', chinese: '我6岁了。', emoji: '🎂', category: 'introduction' },
  { english: 'I like apples.', chinese: '我喜欢苹果。', emoji: '🍎', category: 'introduction' },
  { english: 'This is my mom.', chinese: '这是我的妈妈。', emoji: '👩', category: 'introduction' },
  { english: 'This is my dad.', chinese: '这是我的爸爸。', emoji: '👨', category: 'introduction' },
  
  { english: 'I want some water.', chinese: '我想喝水。', emoji: '💧', category: 'daily' },
  { english: 'May I go to the bathroom?', chinese: '我可以去洗手间吗？', emoji: '🚻', category: 'daily' },
  { english: 'I am hungry.', chinese: '我饿了。', emoji: '🍽️', category: 'daily' },
  { english: 'I am thirsty.', chinese: '我渴了。', emoji: '🥤', category: 'daily' },
  { english: 'I am tired.', chinese: '我累了。', emoji: '😴', category: 'daily' },
  { english: 'I am happy.', chinese: '我很开心。', emoji: '😊', category: 'daily' },
  { english: 'I am sad.', chinese: '我很难过。', emoji: '😢', category: 'daily' },
  
  { english: 'What is this?', chinese: '这是什么？', emoji: '❓', category: 'questions' },
  { english: 'Where is the book?', chinese: '书在哪里？', emoji: '📖', category: 'questions' },
  { english: 'How do you say that?', chinese: '那个怎么说？', emoji: '🗣️', category: 'questions' },
  { english: 'Can you help me?', chinese: '你能帮我吗？', emoji: '🆘', category: 'questions' },
  { english: 'Do you like milk?', chinese: '你喜欢牛奶吗？', emoji: '🥛', category: 'questions' },
  { english: 'What color is it?', chinese: '它是什么颜色？', emoji: '🎨', category: 'questions' },
  { english: 'How many?', chinese: '有多少？', emoji: '🔢', category: 'questions' },
]

const categories = [
  { id: 'all', name: '全部 All', emoji: '🌟' },
  { id: 'greetings', name: '问候语', emoji: '👋' },
  { id: 'introduction', name: '自我介绍', emoji: '👤' },
  { id: 'daily', name: '日常表达', emoji: '🏠' },
  { id: 'questions', name: '提问', emoji: '❓' },
]

export default function Sentences() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const { recordSentence } = useProgressSync()

  const filteredSentences = selectedCategory === 'all' 
    ? sentences 
    : sentences.filter(s => s.category === selectedCategory)

  const speakSentence = (sentence: string, index: number) => {
    setPlayingIndex(index)
    recordSentence()
    speak(sentence, 'en-US', 0.75)
      .then(() => setPlayingIndex(null))
      .catch(error => {
        console.warn('Speech synthesis failed:', error)
        setPlayingIndex(null)
      })
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
            💬 简单句子 - Simple Sentences 💬
          </h1>
          <p className="text-white text-opacity-90">学习常用英语句子</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-bold text-white transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg scale-105'
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <span className="mr-1">{cat.emoji}</span>
              {cat.name}
            </motion.button>
          ))}
        </div>

        <div className="grid gap-4">
          {filteredSentences.map((sentence, index) => (
            <motion.div
              key={`${sentence.category}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-4 card-shadow cursor-pointer group"
                whileHover={{ scale: 1.02, x: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => speakSentence(sentence.english, index)}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className={`text-4xl ${
                      playingIndex === index ? 'animate-bounce' : ''
                    }`}
                    animate={playingIndex === index ? {
                      scale: [1, 1.2, 1],
                    } : {}}
                  >
                    {sentence.emoji}
                  </motion.div>
                  
                  <div className="flex-1">
                    <motion.p 
                      className={`text-xl font-bold text-gray-800 ${
                        playingIndex === index ? 'text-green-600' : ''
                      }`}
                    >
                      {sentence.english}
                    </motion.p>
                    <p className="text-gray-500">{sentence.chinese}</p>
                  </div>

                  <motion.div
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white text-xl shadow-md"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: playingIndex === index ? Infinity : 0 }}
                  >
                    {playingIndex === index ? '🔊' : '▶️'}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-xl font-bold text-white mb-2">💡 小贴士</h3>
          <p className="text-white text-opacity-90">
            点击每个句子听发音，试着跟读！你可以每天练习3-5个句子。
          </p>
        </motion.div>
      </div>
    </div>
  )
}