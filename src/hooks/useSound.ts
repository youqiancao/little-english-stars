import { useCallback, useRef, useEffect } from 'react'

let audioContextInstance: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContextInstance) {
    audioContextInstance = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return audioContextInstance
}

export function useSound() {
  const isInitialized = useRef(false)

  const initAudio = useCallback(() => {
    if (!isInitialized.current) {
      const ctx = getAudioContext()
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
      isInitialized.current = true
    }
  }, [])

  const playSound = useCallback((type: 'click' | 'success' | 'error' | 'complete') => {
    try {
      const audioContext = getAudioContext()

      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      switch (type) {
        case 'click':
          oscillator.frequency.value = 800
          oscillator.type = 'sine'
          gainNode.gain.value = 0.15
          break
        case 'success':
          oscillator.frequency.value = 523.25
          oscillator.type = 'sine'
          gainNode.gain.value = 0.2
          break
        case 'error':
          oscillator.frequency.value = 200
          oscillator.type = 'square'
          gainNode.gain.value = 0.1
          break
        case 'complete':
          oscillator.frequency.value = 659.25
          oscillator.type = 'sine'
          gainNode.gain.value = 0.2
          break
      }

      oscillator.start()
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn('Audio playback failed:', error)
    }
  }, [])

  useEffect(() => {
    const handleUserInteraction = () => {
      initAudio()
    }

    document.addEventListener('click', handleUserInteraction, { once: true })
    document.addEventListener('keydown', handleUserInteraction, { once: true })

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
    }
  }, [initAudio])

  return { playSound, initAudio }
}

export function isSpeechSupported(): boolean {
  return 'speechSynthesis' in window
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) {
    return []
  }
  return window.speechSynthesis.getVoices()
}

export function getVoiceForLang(lang: string): SpeechSynthesisVoice | null {
  const voices = getAvailableVoices()
  
  const exactMatch = voices.find(v => v.lang === lang && v.lang.startsWith('en'))
  if (exactMatch) return exactMatch
  
  const partialMatch = voices.find(v => v.lang.startsWith(lang.split('-')[0]))
  if (partialMatch) return partialMatch
  
  const englishVoice = voices.find(v => v.lang.startsWith('en'))
  if (englishVoice) return englishVoice
  
  return voices.find(v => v.default) || null
}

export function speak(text: string, lang: string = 'en-US', rate: number = 0.8): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      return reject(new Error('Speech synthesis not supported in this browser'))
    }

    try {
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = Math.min(1.5, Math.max(0.1, rate))
      utterance.pitch = 1.0
      utterance.volume = 1.0

      const voice = getVoiceForLang(lang)
      if (voice) {
        utterance.voice = voice
      }

      utterance.onend = () => {
        resolve()
      }

      utterance.onerror = (event) => {
        const errorMessages: Record<string, string> = {
          'not-allowed': '语音合成被阻止，请检查浏览器权限设置',
          'synthesis-unavailable': '语音合成服务不可用',
          'synthesis-failed': '语音合成失败',
          'language-not-supported': '不支持该语言',
          'voice-unavailable': '语音不可用'
        }
        const message = errorMessages[event.error] || `语音合成错误: ${event.error}`
        reject(new Error(message))
      }

      speechSynthesis.speak(utterance)
    } catch (error) {
      reject(new Error(`语音合成发生异常: ${error instanceof Error ? error.message : 'Unknown error'}`))
    }
  })
}

export function useProgress() {
  const saveProgress = useCallback((key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save progress:', error)
    }
  }, [])

  const loadProgress = useCallback(<T>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : defaultValue
    } catch {
      return defaultValue
    }
  }, [])

  return { saveProgress, loadProgress }
}
