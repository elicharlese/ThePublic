"use client"

import { useState } from "react"
import { useLanguage, type Language } from "@/contexts/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Check, Globe } from "lucide-react"
import { motion } from "framer-motion"

export default function LanguageSettingsPage() {
  const { language, setLanguage, t, availableLanguages } = useLanguage()
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language)

  const handleLanguageChange = (value: Language) => {
    setSelectedLanguage(value)
  }

  const handleSave = () => {
    setLanguage(selectedLanguage)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">{t("settings.language")}</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t("settings.language")}
          </CardTitle>
          <CardDescription>{t("settings.language")} - Choose your preferred language</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedLanguage}
            onValueChange={(value) => handleLanguageChange(value as Language)}
            className="grid gap-4"
          >
            {Object.entries(availableLanguages).map(([code, { name, flag }]) => (
              <div key={code} className="flex items-center space-x-2">
                <RadioGroupItem value={code} id={`language-${code}`} />
                <Label
                  htmlFor={`language-${code}`}
                  className="flex items-center gap-3 cursor-pointer py-2 px-3 rounded-md hover:bg-muted flex-1"
                >
                  <span className="text-xl">{flag}</span>
                  <span className="font-medium">{name}</span>
                  {language === code && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                      <Check className="h-4 w-4 text-primary" />
                    </motion.div>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave} disabled={selectedLanguage === language}>
              {t("common.save")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
