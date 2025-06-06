"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { en } from "@/translations/en"

export type Language = "en" | "es" | "fr" | "zh" | "ja"

type Translations = typeof en

interface LanguageOption {
  name: string
  flag: string
}

interface AvailableLanguages {
  [key: string]: LanguageOption
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  availableLanguages: AvailableLanguages
}

const defaultTranslations = en

// Define available languages with their display names and flags
const availableLanguagesData: AvailableLanguages = {
  en: { name: "English", flag: "🇺🇸" },
  es: { name: "Español", flag: "🇪🇸" },
  fr: { name: "Français", flag: "🇫🇷" },
  zh: { name: "中文", flag: "🇨🇳" },
  ja: { name: "日本語", flag: "🇯🇵" },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState<Translations>(defaultTranslations)

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        if (language === "en") {
          setTranslations(defaultTranslations)
          return
        }

        // Dynamically import translations based on language
        const module = await import(`@/translations/${language}`)
        setTranslations(module[language] || defaultTranslations)
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error)
        setTranslations(defaultTranslations)
      }
    }

    loadTranslations()
  }, [language])

  const t = (key: string): string => {
    try {
      // Split the key by dots to access nested properties
      const keys = key.split(".")
      let value: any = translations

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k]
        } else {
          // Key not found, return the key itself
          return key
        }
      }

      return typeof value === "string" ? value : key
    } catch (error) {
      console.error(`Translation error for key ${key}:`, error)
      return key
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages: availableLanguagesData }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
