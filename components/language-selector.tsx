"use client"

import { useState } from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage, type Language } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface LanguageSelectorProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  showLabel?: boolean
  className?: string
}

export function LanguageSelector({
  variant = "outline",
  size = "default",
  showLabel = false,
  className,
}: LanguageSelectorProps) {
  const { language, setLanguage, t, availableLanguages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  // Default language options in case availableLanguages is undefined
  const defaultLanguages = {
    en: { name: "English", flag: "🇺🇸" },
    es: { name: "Español", flag: "🇪🇸" },
    fr: { name: "Français", flag: "🇫🇷" },
    zh: { name: "中文", flag: "🇨🇳" },
    ja: { name: "日本語", flag: "🇯🇵" },
  }

  // Use availableLanguages if defined, otherwise use defaultLanguages
  const languages = availableLanguages || defaultLanguages

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  // Get current language display name safely
  const currentLanguageName = languages[language]?.name || "English"

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={cn("gap-2", className)} aria-label={t("settings.language")}>
          <Globe className="h-4 w-4" />
          {showLabel && <span className="hidden sm:inline-block">{currentLanguageName}</span>}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(languages).map(([code, { name, flag }]) => (
          <DropdownMenuItem
            key={code}
            className={cn("flex items-center gap-2 cursor-pointer", language === code && "font-medium")}
            onClick={() => handleSelectLanguage(code as Language)}
          >
            <span className="text-base">{flag}</span>
            <span>{name}</span>
            {language === code && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                <Check className="h-4 w-4" />
              </motion.div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
