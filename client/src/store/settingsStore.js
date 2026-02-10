import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Font size classes mapping
const fontSizeClasses = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg'
}

// Font size root scaling
const fontSizeScale = {
  small: '14px',
  medium: '16px',
  large: '18px'
}

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      // Appearance settings
      theme: 'light',
      fontSize: 'medium',
      reducedMotion: false,
      
      // Notification settings
      emailNotifications: true,
      pushNotifications: true,
      interviewReminders: true,
      weeklyReport: true,
      marketingEmails: false,
      
      // Privacy settings
      profileVisibility: 'public',
      showOnLeaderboard: true,
      shareProgress: true,
      
      // Interview preferences
      defaultDifficulty: 'medium',
      defaultDuration: 30,
      autoSaveAnswers: true,
      showHints: true,
      soundEnabled: true,
      preferredCategories: ['dsa', 'web', 'behavioral'],
      
      // Language & Region
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      
      // Actions
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      
      setFontSize: (fontSize) => {
        set({ fontSize })
        applyFontSize(fontSize)
      },
      
      setReducedMotion: (reducedMotion) => {
        set({ reducedMotion })
        applyReducedMotion(reducedMotion)
      },
      
      updateSetting: (key, value) => {
        set({ [key]: value })
        
        // Apply specific settings immediately
        if (key === 'theme') applyTheme(value)
        if (key === 'fontSize') applyFontSize(value)
        if (key === 'reducedMotion') applyReducedMotion(value)
      },
      
      updateSettings: (settings) => {
        set(settings)
        
        // Apply appearance settings
        if (settings.theme) applyTheme(settings.theme)
        if (settings.fontSize) applyFontSize(settings.fontSize)
        if (settings.reducedMotion !== undefined) applyReducedMotion(settings.reducedMotion)
      },
      
      // Initialize settings on app load
      initializeSettings: () => {
        const state = get()
        applyTheme(state.theme)
        applyFontSize(state.fontSize)
        applyReducedMotion(state.reducedMotion)
      },

      // Reset all settings to defaults
      resetToDefaults: () => {
        const defaults = {
          theme: 'light',
          fontSize: 'medium',
          reducedMotion: false,
          emailNotifications: true,
          pushNotifications: true,
          interviewReminders: true,
          weeklyReport: true,
          marketingEmails: false,
          profileVisibility: 'public',
          showOnLeaderboard: true,
          shareProgress: true,
          defaultDifficulty: 'medium',
          defaultDuration: 30,
          autoSaveAnswers: true,
          showHints: true,
          soundEnabled: true,
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
        set(defaults)
        applyTheme(defaults.theme)
        applyFontSize(defaults.fontSize)
        applyReducedMotion(defaults.reducedMotion)
      }
    }),
    {
      name: 'user-settings',
      partialize: (state) => ({
        theme: state.theme,
        fontSize: state.fontSize,
        reducedMotion: state.reducedMotion,
        emailNotifications: state.emailNotifications,
        pushNotifications: state.pushNotifications,
        interviewReminders: state.interviewReminders,
        weeklyReport: state.weeklyReport,
        marketingEmails: state.marketingEmails,
        profileVisibility: state.profileVisibility,
        showOnLeaderboard: state.showOnLeaderboard,
        shareProgress: state.shareProgress,
        defaultDifficulty: state.defaultDifficulty,
        defaultDuration: state.defaultDuration,
        autoSaveAnswers: state.autoSaveAnswers,
        showHints: state.showHints,
        soundEnabled: state.soundEnabled,
        preferredCategories: state.preferredCategories,
        language: state.language,
        timezone: state.timezone,
      })
    }
  )
)

// Track the system theme listener so we can clean it up
let systemThemeHandler = null
let systemThemeMediaQuery = null

// Helper functions to apply settings to the DOM
function applyTheme(theme) {
  const root = document.documentElement
  
  // Clean up previous system theme listener to prevent memory leaks
  if (systemThemeHandler && systemThemeMediaQuery) {
    systemThemeMediaQuery.removeEventListener('change', systemThemeHandler)
    systemThemeHandler = null
    systemThemeMediaQuery = null
  }
  
  // Remove existing theme classes
  root.classList.remove('light', 'dark')
  
  if (theme === 'system') {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.add(prefersDark ? 'dark' : 'light')
    
    // Listen for system theme changes
    systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemThemeHandler = (e) => {
      root.classList.remove('light', 'dark')
      root.classList.add(e.matches ? 'dark' : 'light')
    }
    systemThemeMediaQuery.addEventListener('change', systemThemeHandler)
  } else {
    root.classList.add(theme)
  }
  
  // Also set a data attribute for CSS custom properties
  root.setAttribute('data-theme', theme)
}

function applyFontSize(fontSize) {
  const root = document.documentElement
  
  // Remove existing font size classes
  root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large')
  
  // Add new font size class
  root.classList.add(`font-size-${fontSize}`)
  
  // Set root font size for rem scaling
  root.style.fontSize = fontSizeScale[fontSize] || '16px'
  
  // Set data attribute
  root.setAttribute('data-font-size', fontSize)
}

function applyReducedMotion(reducedMotion) {
  const root = document.documentElement
  
  if (reducedMotion) {
    root.classList.add('reduce-motion')
    root.setAttribute('data-reduce-motion', 'true')
  } else {
    root.classList.remove('reduce-motion')
    root.setAttribute('data-reduce-motion', 'false')
  }
}

export default useSettingsStore
