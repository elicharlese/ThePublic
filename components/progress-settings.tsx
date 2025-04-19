"use client"

import type React from "react"

import { useState } from "react"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProgress } from "@/contexts/progress-context"
import { AnimatedCard } from "@/components/ui/animated-card"
import { Save, Download, Upload } from "lucide-react"
import { useNotification } from "@/contexts/notification-context"

export function ProgressSettings() {
  const { progress, saveProgress } = useProgress()
  const { showNotification } = useNotification()

  // Local state for settings
  const [autoSave, setAutoSave] = useState(true)
  const [saveInterval, setSaveInterval] = useState("5")
  const [syncToCloud, setSyncToCloud] = useState(false)

  const handleExportProgress = () => {
    try {
      // Create a JSON blob
      const progressData = JSON.stringify(progress, null, 2)
      const blob = new Blob([progressData], { type: "application/json" })

      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `thepublic-progress-${new Date().toISOString().split("T")[0]}.json`

      // Trigger download
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      showNotification("Progress exported", "Your progress data has been exported successfully.", "success")
    } catch (error) {
      console.error("Failed to export progress:", error)
      showNotification("Export failed", "Could not export your progress data.", "error")
    }
  }

  const handleImportProgress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedProgress = JSON.parse(e.target?.result as string)

        // Validate imported data (basic check)
        if (!importedProgress.lastSaved) {
          throw new Error("Invalid progress data")
        }

        // Store in localStorage
        localStorage.setItem("userProgress", JSON.stringify(importedProgress))

        // Reload the page to apply imported progress
        showNotification("Progress imported", "Reloading to apply your imported progress...", "success")
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } catch (error) {
        console.error("Failed to import progress:", error)
        showNotification("Import failed", "The file contains invalid progress data.", "error")
      }
    }

    reader.readAsText(file)
  }

  return (
    <AnimatedCard>
      <CardHeader>
        <CardTitle>Progress Settings</CardTitle>
        <CardDescription>Configure how your progress is saved and managed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-save">Auto-save progress</Label>
              <p className="text-xs text-muted-foreground">Automatically save your progress at regular intervals</p>
            </div>
            <Switch id="auto-save" checked={autoSave} onCheckedChange={setAutoSave} />
          </div>

          {autoSave && (
            <div className="space-y-2">
              <Label htmlFor="save-interval">Save interval</Label>
              <Select value={saveInterval} onValueChange={setSaveInterval}>
                <SelectTrigger id="save-interval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Every 1 minute</SelectItem>
                  <SelectItem value="5">Every 5 minutes</SelectItem>
                  <SelectItem value="15">Every 15 minutes</SelectItem>
                  <SelectItem value="30">Every 30 minutes</SelectItem>
                  <SelectItem value="60">Every hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sync-cloud">Sync to cloud</Label>
              <p className="text-xs text-muted-foreground">Sync your progress with your Solana wallet (coming soon)</p>
            </div>
            <Switch id="sync-cloud" checked={syncToCloud} onCheckedChange={setSyncToCloud} disabled={true} />
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <h3 className="text-sm font-medium">Import & Export</h3>
          <p className="text-xs text-muted-foreground">Export your progress data or import from a backup file</p>

          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={handleExportProgress}>
              <Download className="h-4 w-4 mr-2" />
              Export Progress
            </Button>

            <div className="relative">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Upload className="h-4 w-4 mr-2" />
                Import Progress
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImportProgress}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => {
            saveProgress()
            showNotification("Settings saved", "Your progress settings have been updated.", "success")
          }}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </CardFooter>
    </AnimatedCard>
  )
}
