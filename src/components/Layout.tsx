import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/alphabet', label: '学字母', icon: '🔤' },
  { path: '/vocabulary', label: '学单词', icon: '📚' },
  { path: '/sentences', label: '学句子', icon: '💬' },
  { path: '/games', label: '玩游戏', icon: '🎮' },
  { path: '/progress', label: '我的进度', icon: '⭐' },
]

export default function Layout() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white bg-opacity-95 backdrop-blur-sm shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-3xl">🌈</span>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                儿童英语乐园
              </span>
            </motion.div>
            
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`relative px-3 py-2 rounded-xl flex items-center gap-1 transition-all ${
                        isActive 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium hidden sm:inline">{item.label}</span>
                      {isActive && (
                        <motion.div 
                          layoutId="activeNav"
                          className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl -z-10"
                          transition={{ type: 'spring', duration: 0.5 }}
                        />
                      )}
                    </Link>
                  )
                })}
              </div>
              
              {user && (
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-200">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span className="text-lg">👤</span>
                    <span className="font-medium hidden md:inline">{user.displayName}</span>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    退出
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white bg-opacity-90 backdrop-blur-sm py-4 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            🌟 儿童英语乐园 - 让学习变得有趣又好玩！ 🌟
          </p>
        </div>
      </footer>
    </div>
  )
}
