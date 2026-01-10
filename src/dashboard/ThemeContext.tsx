import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'modern' | 'minimal' | 'compact'

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('dashboardTheme') as Theme | null
      return saved || 'modern'
    } catch {
      return 'modern'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('dashboardTheme', theme)
    } catch {}
    // Apply data-theme attribute on body for global CSS
    const root = document.documentElement
    root.setAttribute('data-dashboard-theme', theme)
  }, [theme])

  const setTheme = (t: Theme) => setThemeState(t)

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContext
