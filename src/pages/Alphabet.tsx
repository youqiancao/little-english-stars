import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { speak } from '../hooks/useSound'

const alphabetData = [
  { letter: 'A', word: 'Apple', emoji: '🍎', color: 'bg-red-400' },
  { letter: 'B', word: 'Ball', emoji: '⚽', color: 'bg-blue-400' },
  { letter: 'C', word: 'Cat', emoji: '🐱', color: 'bg-orange-400' },
  { letter: 'D', word: 'Dog', emoji: '🐕', color: 'bg-brown-400' },
  { letter: 'E', word: 'Elephant', emoji: '🐘', color: 'bg-gray-400' },
  { letter: 'F', word: 'Fish', emoji: '🐟', color: 'bg-cyan-400' },
  { letter: 'G', word: 'Grape', emoji: '🍇', color: 'bg-purple-400' },
  { letter: 'H', word: 'House', emoji: '🏠', color: 'bg-yellow-400' },
  { letter: 'I', word: 'Ice cream', emoji: '🍦', color: 'bg-pink-400' },
  { letter: 'J', word: 'Jellyfish', emoji: '🪼', color: 'bg-teal-400' },
  { letter: 'K', word: 'Kite', emoji: '🪁', color: 'bg-indigo-400' },
  { letter: 'L', word: 'Lion', emoji: '🦁', color: 'bg-amber-400' },
  { letter: 'M', word: 'Moon', emoji: '🌙', color: 'bg-slate-400' },
  { letter: 'N', word: 'Nest', emoji: '🪺', color: 'bg-green-400' },
  { letter: 'O', word: 'Orange', emoji: '🍊', color: 'bg-orange-500' },
  { letter: 'P', word: 'Penguin', emoji: '🐧', color: 'bg-black' },
  { letter: 'Q', word: 'Queen', emoji: '👑', color: 'bg-violet-400' },
  { letter: 'R', word: 'Rainbow', emoji: '🌈', color: 'bg-pink-300' },
  { letter: 'S', word: 'Sun', emoji: '☀️', color: 'bg-yellow-500' },
  { letter: 'T', word: 'Tiger', emoji: '🐯', color: 'bg-orange-600' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️', color: 'bg-red-500' },
  { letter: 'V', word: 'Violin', emoji: '🎻', color: 'bg-amber-600' },
  { letter: 'W', word: 'Whale', emoji: '🐋', color: 'bg-blue-500' },
  { letter: 'X', word: 'Xylophone', emoji: '🎵', color: 'bg-purple-500' },
  { letter: 'Y', word: 'Yarn', emoji: '🧶', color: 'bg-rose-400' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓', color: 'bg-white' },
]

export default function Alphabet() {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const selectedData = alphabetData.find(a => a.letter === selectedLetter)

  const speakLetter = (letter: string) => {
    speak(letter, 'en-US', 0.8).catch(error => {
      console.warn('Speech synthesis failed:', error)
    })
  }

  const speakWord = (word: string) => {
    speak(word, 'en-US', 0.7).catch(error => {
      console.warn('Speech synthesis failed:', error)
    })
  }

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter)
    speakLetter(letter)
    setIsPlaying(true)
    setTimeout(() => setIsPlaying(false), 500)
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
            🔤 字母学习 - Learn the Alphabet 🔤
          </h1>
          <p className="text-white text-opacity-90">点击字母听听怎么发音！</p>
        </motion.div>

        <div className="grid grid-cols-7 md:grid-cols-13 gap-2 md:gap-3 mb-8">
          {alphabetData.map((item, index) => (
            <motion.button
              key={item.letter}
              onClick={() => handleLetterClick(item.letter)}
              className={`aspect-square rounded-xl md:rounded-2xl flex flex-col items-center justify-center font-bold text-xl md:text-2xl transition-all ${
                selectedLetter === item.letter
                  ? `${item.color} text-white scale-110 shadow-lg ring-4 ring-yellow-300`
                  : `${item.color} text-white hover:scale-105 shadow-md`
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
            >
              <span className="text-2xl md:text-3xl">{item.letter}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedData && (
            <motion.div
              key={selectedData.letter}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              className="bg-white rounded-3xl p-8 card-shadow text-center"
            >
              <motion.div
                className={`w-32 h-32 mx-auto rounded-full ${selectedData.color} flex items-center justify-center mb-6 ${
                  isPlaying ? 'animate-bounce' : ''
                }`}
                animate={isPlaying ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <span className="text-6xl">{selectedData.emoji}</span>
              </motion.div>

              <motion.h2
                className="text-5xl font-bold text-gray-800 mb-2"
                animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
              >
                {selectedData.letter}
              </motion.h2>

              <motion.p
                className="text-2xl text-gray-600 mb-4"
                onClick={() => speakWord(selectedData.word)}
                whileHover={{ scale: 1.05, color: '#6366f1' }}
                whileTap={{ scale: 0.95 }}
              >
                {selectedData.word} 👉 点击听发音
              </motion.p>

              <div className="flex gap-4 justify-center mt-6">
                <motion.button
                  onClick={() => speakLetter(selectedData.letter)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🔤 听字母
                </motion.button>
                <motion.button
                  onClick={() => speakWord(selectedData.word)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📖 听单词
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-8 text-center"
          >
            <p className="text-white text-xl">
              👆 点击上面的字母开始学习吧！
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}