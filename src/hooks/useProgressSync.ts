import { useCallback } from 'react'
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

const STORAGE_PREFIX = 'kidsEnglishProgress_'

function getStorageKey(userId: number): string {
  return `${STORAGE_PREFIX}${userId}`
}

function loadFromStorage(userId: number): ProgressData {
  try {
    const saved = localStorage.getItem(getStorageKey(userId))
    if (saved) return JSON.parse(saved)
  } catch { /* ignore */ }
  return {
    alphabet: 0,
    vocabulary: {},
    sentences: 0,
    gamesPlayed: 0,
    totalStars: 0,
    lastVisit: new Date().toISOString(),
    streak: 1,
  }
}

function saveToStorage(userId: number, data: ProgressData) {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(data))
  } catch { /* ignore */ }
}

export function useProgressSync() {
  const { user } = useAuth()

  const recordAlphabet = useCallback((letter: string) => {
    if (!user) return
    const data = loadFromStorage(user.id)
    const learned = new Set<string>(
      (localStorage.getItem(`kidsEnglishAlphabet_${user.id}`) || '').split(',').filter(Boolean)
    )
    learned.add(letter)
    localStorage.setItem(`kidsEnglishAlphabet_${user.id}`, Array.from(learned).join(','))
    data.alphabet = learned.size
    data.totalStars += 1
    data.lastVisit = new Date().toISOString()
    saveToStorage(user.id, data)
    api.saveProgress(user.id, { category: 'alphabet', itemId: 'learned', value: data.alphabet, stars: data.totalStars })
  }, [user])

  const recordVocabulary = useCallback((categoryId: string) => {
    if (!user) return
    const data = loadFromStorage(user.id)
    data.vocabulary[categoryId] = (data.vocabulary[categoryId] || 0) + 1
    data.totalStars += 1
    data.lastVisit = new Date().toISOString()
    saveToStorage(user.id, data)
    api.saveProgress(user.id, { category: 'vocabulary', itemId: categoryId, value: data.vocabulary[categoryId], stars: data.totalStars })
  }, [user])

  const recordSentence = useCallback(() => {
    if (!user) return
    const data = loadFromStorage(user.id)
    data.sentences += 1
    data.totalStars += 1
    data.lastVisit = new Date().toISOString()
    saveToStorage(user.id, data)
    api.saveProgress(user.id, { category: 'sentences', itemId: 'total', value: data.sentences, stars: data.totalStars })
  }, [user])

  const recordGame = useCallback((gameType: string, score: number) => {
    if (!user) return
    const data = loadFromStorage(user.id)
    data.gamesPlayed += 1
    data.totalStars += score
    data.lastVisit = new Date().toISOString()
    saveToStorage(user.id, data)
    api.saveProgress(user.id, { category: 'games', itemId: gameType, value: data.gamesPlayed, stars: data.totalStars })
    api.saveGameScore(user.id, gameType, score)
  }, [user])

  return { recordAlphabet, recordVocabulary, recordSentence, recordGame }
}
