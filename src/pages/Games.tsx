import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgressSync } from '../hooks/useProgressSync'

const games = [
  {
    id: 'memory',
    name: '记忆翻翻乐',
    emoji: '🧠',
    description: 'Memory Match Game',
    color: 'from-purple-400 to-pink-500',
  },
  {
    id: 'quiz',
    name: 'Quiz答题',
    emoji: '❓',
    description: 'Quiz Game',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: 'spell',
    name: '拼写练习',
    emoji: '✏️',
    description: 'Spelling Practice',
    color: 'from-green-400 to-emerald-500',
  },
]

const quizQuestions = [
  { emoji: '🍎', options: ['Apple', 'Banana', 'Orange', 'Grape'], correct: 'Apple' },
  { emoji: '🐱', options: ['Dog', 'Cat', 'Bird', 'Fish'], correct: 'Cat' },
  { emoji: '☀️', options: ['Moon', 'Star', 'Sun', 'Cloud'], correct: 'Sun' },
  { emoji: '🚗', options: ['Car', 'Bus', 'Train', 'Plane'], correct: 'Car' },
  { emoji: '🏠', options: ['House', 'Tree', 'Flower', 'Grass'], correct: 'House' },
  { emoji: '👋', options: ['Hand', 'Foot', 'Head', 'Eye'], correct: 'Hand' },
  { emoji: '🔵', options: ['Red', 'Blue', 'Green', 'Yellow'], correct: 'Blue' },
  { emoji: '🎂', options: ['Cake', 'Cookie', 'Ice cream', 'Candy'], correct: 'Cake' },
]

export default function Games() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            🎮 游戏时间 - Game Time! 🎮
          </h1>
          <p className="text-white text-opacity-90">在游戏中学习，让学习变得更有趣！</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="gameSelection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {games.map((game, index) => (
                <motion.button
                  key={game.id}
                  onClick={() => setSelectedGame(game.id)}
                  className={`bg-gradient-to-br ${game.color} rounded-3xl p-6 card-shadow cursor-pointer h-48`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-6xl mb-4">{game.emoji}</div>
                  <h2 className="text-2xl font-bold text-white mb-1">{game.name}</h2>
                  <p className="text-white text-opacity-80">{game.description}</p>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="gameContent"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              {selectedGame === 'memory' && <MemoryGame onBack={() => setSelectedGame(null)} />}
              {selectedGame === 'quiz' && <QuizGame onBack={() => setSelectedGame(null)} />}
              {selectedGame === 'spell' && <SpellGame onBack={() => setSelectedGame(null)} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function MemoryGame({ onBack }: { onBack: () => void }) {
  const emojis = ['🍎', '🐱', '☀️', '🚗', '🏠', '👋', '🔵', '🎂']
  const [cards, setCards] = useState<string[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const { recordGame } = useProgressSync()
  const [gameRecorded, setGameRecorded] = useState(false)

  useEffect(() => {
    initGame()
  }, [])

  const initGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setFlipped([])
    setMatched([])
    setScore(0)
    setGameRecorded(false)
  }

  const handleClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return
    
    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped
      if (cards[first] === cards[second]) {
        setMatched([...matched, first, second])
        setScore(prev => prev + 1)
        setFlipped([])
        
        if (matched.length === cards.length - 2) {
          setTimeout(() => {
            if (!gameRecorded) {
              recordGame('memory', score + 1)
              setGameRecorded(true)
            }
            alert('🎉 恭喜你赢了！太棒了！')
          }, 500)
        }
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.button
          onClick={onBack}
          className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← 返回
        </motion.button>
        <div className="text-white text-xl font-bold">
          配对成功: {score} / {emojis.length}
        </div>
        <motion.button
          onClick={initGame}
          className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          重新开始 🔄
        </motion.button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((emoji, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index)
          const isMatched = matched.includes(index)
          
          return (
            <motion.div
              key={index}
              onClick={() => handleClick(index)}
              className={`aspect-square rounded-xl flex items-center justify-center text-4xl cursor-pointer ${
                isFlipped
                  ? isMatched
                    ? 'bg-green-400 shadow-lg'
                    : 'bg-white shadow-lg'
                  : 'bg-gradient-to-br from-purple-500 to-pink-500'
              }`}
              whileHover={!isFlipped ? { scale: 1.05 } : {}}
              whileTap={{ scale: 0.95 }}
              animate={isFlipped ? { rotateY: 180 } : {}}
            >
              {isFlipped ? emoji : '❓'}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function QuizGame({ onBack }: { onBack: () => void }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const { recordGame } = useProgressSync()

  const question = quizQuestions[currentQ]

  const handleAnswer = (answer: string) => {
    setSelected(answer)
    if (answer === question.correct) {
      setScore(prev => prev + 1)
    }
    setTimeout(() => {
      if (currentQ < quizQuestions.length - 1) {
        setCurrentQ(prev => prev + 1)
        setSelected(null)
      } else {
        recordGame('quiz', answer === question.correct ? score + 1 : score)
        setShowResult(true)
      }
    }, 1500)
  }

  const resetGame = () => {
    setCurrentQ(0)
    setScore(0)
    setShowResult(false)
    setSelected(null)
  }

  if (showResult) {
    return (
      <motion.div
        className="bg-white rounded-3xl p-8 card-shadow text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-8xl mb-4">
          {score === quizQuestions.length ? '🏆' : score >= 5 ? '🎉' : '💪'}
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          你的得分: {score} / {quizQuestions.length}
        </h2>
        <p className="text-gray-600 mb-6">
          {score === quizQuestions.length ? '太厉害了！你是个小天才！🌟' :
           score >= 5 ? '做得很好！继续加油！👍' :
           '再接再厉，你一定会越来越棒的！💪'}
        </p>
        <div className="flex gap-4 justify-center">
          <motion.button
            onClick={resetGame}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            再玩一次 🔄
          </motion.button>
          <motion.button
            onClick={onBack}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            返回 ←
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.button
          onClick={onBack}
          className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← 返回
        </motion.button>
        <div className="text-white text-xl font-bold">
          第 {currentQ + 1} / {quizQuestions.length} 题
        </div>
        <div className="text-white text-xl font-bold">
          得分: {score}
        </div>
      </div>

      <motion.div
        className="bg-white rounded-3xl p-8 card-shadow text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-8xl mb-6">{question.emoji}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          这个是什么？
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option) => {
            const isCorrect = option === question.correct
            const isSelected = option === selected
            
            return (
              <motion.button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={selected !== null}
                className={`p-4 rounded-xl font-bold text-xl transition-all ${
                  selected === null
                    ? 'bg-gradient-to-r from-blue-400 to-cyan-400 text-white hover:shadow-lg'
                    : isCorrect
                      ? 'bg-green-500 text-white'
                      : isSelected
                        ? 'bg-red-400 text-white'
                        : 'bg-gray-200 text-gray-500'
                }`}
                whileHover={selected === null ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.95 }}
              >
                {option}
              </motion.button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

function SpellGame({ onBack }: { onBack: () => void }) {
  const words = [
    { word: 'CAT', hint: '🐱', chinese: '猫' },
    { word: 'DOG', hint: '🐕', chinese: '狗' },
    { word: 'SUN', hint: '☀️', chinese: '太阳' },
    { word: 'APPLE', hint: '🍎', chinese: '苹果' },
    { word: 'BOOK', hint: '📖', chinese: '书' },
  ]
  
  const [currentWord, setCurrentWord] = useState(0)
  const [scrambled, setScrambled] = useState('')
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const { recordGame } = useProgressSync()

  useEffect(() => {
    scrambleWord(words[currentWord].word)
  }, [currentWord])

  const scrambleWord = (word: string) => {
    const scrambled = word.split('').sort(() => Math.random() - 0.5).join('')
    if (scrambled === word && word.length > 1) {
      scrambleWord(word)
    } else {
      setScrambled(scrambled)
    }
    setAnswer('')
    setShowSuccess(false)
  }

  const handleLetterClick = (letter: string) => {
    if (showSuccess) return
    const newAnswer = answer + letter
    setAnswer(newAnswer)

    if (newAnswer.length === words[currentWord].word.length) {
      if (newAnswer === words[currentWord].word) {
        setScore(prev => prev + 1)
        setShowSuccess(true)
        setTimeout(() => {
          if (currentWord < words.length - 1) {
            setCurrentWord(prev => prev + 1)
          } else {
            recordGame('spell', score + 1)
            alert(`🎉 恭喜你完成了所有单词！得分: ${score + 1}/${words.length}`)
          }
        }, 1500)
      } else {
        setTimeout(() => setAnswer(''), 500)
      }
    }
  }

  const resetGame = () => {
    setCurrentWord(0)
    setScore(0)
    setAnswer('')
    setShowSuccess(false)
    scrambleWord(words[0].word)
  }

  const word = words[currentWord]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <motion.button
          onClick={onBack}
          className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← 返回
        </motion.button>
        <div className="text-white text-xl font-bold">
          第 {currentWord + 1} / {words.length} 题
        </div>
        <motion.button
          onClick={resetGame}
          className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          重新开始 🔄
        </motion.button>
      </div>

      <motion.div
        className="bg-white rounded-3xl p-8 card-shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-2">{word.hint}</div>
          <p className="text-xl text-gray-600">提示: {word.chinese}</p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {word.word.split('').map((_, index) => (
            <div
              key={index}
              className={`w-12 h-14 rounded-lg flex items-center justify-center text-2xl font-bold border-2 ${
                showSuccess
                  ? 'bg-green-100 border-green-500 text-green-600'
                  : answer[index]
                    ? 'bg-blue-100 border-blue-500 text-blue-600'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}
            >
              {answer[index] || ''}
            </div>
          ))}
        </div>

        {showSuccess && (
          <motion.div
            className="text-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <span className="text-4xl">🎉</span>
            <p className="text-green-600 font-bold text-xl">正确！</p>
          </motion.div>
        )}

        <div className="flex justify-center gap-2 flex-wrap">
          {scrambled.split('').map((letter, index) => (
            <motion.button
              key={index}
              onClick={() => handleLetterClick(letter)}
              disabled={showSuccess}
              className="w-14 h-14 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {letter}
            </motion.button>
          ))}
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm">得分: {score}</p>
        </div>
      </motion.div>
    </div>
  )
}