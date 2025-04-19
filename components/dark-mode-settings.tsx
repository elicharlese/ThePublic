"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor, Clock } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DarkModeSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [autoSwitch, setAutoSwitch] = useState(false)
  const [contrastLevel, setContrastLevel] = useState(50)
  const [animationSpeed, setAnimationSpeed] = useState(50)
  const [scheduleStart, setScheduleStart] = useState("20:00")
  const [scheduleEnd, setScheduleEnd] = useState("07:00")

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Theme Preference</CardTitle>
          <CardDescription>Choose your preferred theme mode</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            defaultValue={theme}
            onValueChange={(value) => setTheme(value)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer">
                <Sun className="h-4 w-4" />
                Light Mode
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer">
                <Moon className="h-4 w-4" />
                Dark Mode
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="flex items-center gap-2 cursor-pointer">
                <Monitor className="h-4 w-4" />
                System Default
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Auto Dark Mode</CardTitle>
          <CardDescription>Automatically switch between light and dark mode based on time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-switch" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Schedule dark mode
            </Label>
            <Switch id="auto-switch" checked={autoSwitch} onCheckedChange={setAutoSwitch} />
          </div>

          {autoSwitch && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <input
                    id="start-time"
                    type="time"
                    value={scheduleStart}
                    onChange={(e) => setScheduleStart(e.target.value)}
                    className="w-full p-2 rounded-md border border-input bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <input
                    id="end-time"
                    type="time"
                    value={scheduleEnd}
                    onChange={(e) => setScheduleEnd(e.target.value)}
                    className="w-full p-2 rounded-md border border-input bg-background"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Dark mode will be active from {scheduleStart} to {scheduleEnd}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Settings</CardTitle>
          <CardDescription>Fine-tune your dark mode experience</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="contrast">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contrast">Contrast</TabsTrigger>
              <TabsTrigger value="animation">Animation</TabsTrigger>
            </TabsList>
            <TabsContent value="contrast" className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="contrast">Contrast Level</Label>
                  <span className="text-sm text-muted-foreground">{contrastLevel}%</span>
                </div>
                <Slider
                  id="contrast"
                  min={0}
                  max={100}
                  step={1}
                  value={[contrastLevel]}
                  onValueChange={(value) => setContrastLevel(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Adjust the contrast level for dark mode to improve readability
                </p>
              </div>
            </TabsContent>
            <TabsContent value="animation" className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="animation">Transition Speed</Label>
                  <span className="text-sm text-muted-foreground">
                    {animationSpeed < 33 ? "Slow" : animationSpeed < 66 ? "Medium" : "Fast"}
                  </span>
                </div>
                <Slider
                  id="animation"
                  min={0}
                  max={100}
                  step={1}
                  value={[animationSpeed]}
                  onValueChange={(value) => setAnimationSpeed(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Control how quickly the theme transitions between light and dark mode
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Preferences</Button>
      </div>
    </div>
  )
}
