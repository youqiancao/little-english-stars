const API_BASE_URL = '/api'

interface ProgressData {
  alphabet: number
  vocabulary: { [key: string]: number }
  sentences: number
  gamesPlayed: number
  totalStars: number
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.warn('API call failed, using localStorage fallback:', error)
    throw error
  }
}

export const api = {
  async getProgress(userId: number = 1): Promise<ProgressData | null> {
    try {
      return await fetchApi<ProgressData>(`/progress/${userId}`)
    } catch {
      return null
    }
  },

  async saveProgress(
    userId: number = 1,
    data: {
      category: string
      itemId?: string
      value?: number
      completed?: boolean
      stars?: number
    }
  ): Promise<boolean> {
    try {
      await fetchApi(`/progress/${userId}`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
      return true
    } catch {
      return false
    }
  },

  async getAchievements(userId: number = 1): Promise<string[]> {
    try {
      return await fetchApi<string[]>(`/achievements/${userId}`)
    } catch {
      return []
    }
  },

  async saveAchievement(userId: number = 1, achievementId: string): Promise<boolean> {
    try {
      await fetchApi(`/achievements/${userId}`, {
        method: 'POST',
        body: JSON.stringify({ achievementId }),
      })
      return true
    } catch {
      return false
    }
  },

  async saveGameScore(userId: number = 1, gameType: string, score: number): Promise<boolean> {
    try {
      await fetchApi(`/game-scores/${userId}`, {
        method: 'POST',
        body: JSON.stringify({ gameType, score }),
      })
      return true
    } catch {
      return false
    }
  },

  async recordDailyActivity(
    userId: number = 1,
    wordsLearned: number,
    timeSpent: number
  ): Promise<boolean> {
    try {
      await fetchApi(`/daily-activity/${userId}`, {
        method: 'POST',
        body: JSON.stringify({ wordsLearned, timeSpent }),
      })
      return true
    } catch {
      return false
    }
  },

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetchApi<{ status: string }>('/health')
      return response.status === 'ok'
    } catch {
      return false
    }
  },
}

export default api
