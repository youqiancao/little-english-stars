import { Routes, Route, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Alphabet from './pages/Alphabet'
import Vocabulary from './pages/Vocabulary'
import Sentences from './pages/Sentences'
import Games from './pages/Games'
import Progress from './pages/Progress'
import LoginPage from './pages/Login'
import { motion } from 'framer-motion'

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          🌟
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage onSuccess={() => navigate('/')} />
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="alphabet" element={<Alphabet />} />
        <Route path="vocabulary" element={<Vocabulary />} />
        <Route path="sentences" element={<Sentences />} />
        <Route path="games" element={<Games />} />
        <Route path="progress" element={<Progress />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
