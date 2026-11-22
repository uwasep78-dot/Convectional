import { createContext, useContext, useState } from 'react'
import { DEFAULT_LANGUAGE } from '../config/languages.js'

const LangContext = createContext(null)

export function LanguageProvider({ children, defaultLanguage = DEFAULT_LANGUAGE }) {
  const [lang, setLang] = useState(defaultLanguage)
  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
