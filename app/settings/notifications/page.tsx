"use client"

import { useState } from "react"
import { Bell, Mail, MessageSquare, Smartphone, Zap, Shield, Wifi, Users, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function NotificationsPage() {
  const { toast } = useToast()
  const [notificationSettings, setNotificationSettings] = useState({
    system: {
      inApp: true,
      email: true,
      push: false,
    },
    security: {
      inApp: true,
      email: true,
      push: true,
    },
    network: {
      inApp: true,
      email: false,
      push: false,
    },
    marketing: {
      inApp: false,
      email: false,
      push: false,
    },
    community: {
      inApp: true,
      email: false,
      push: false,
    },
  })

  const [frequency, setFrequency] = useState("realtime")

  const handleToggleChange = (category, method) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [method]: !prev[category][method],
      },
    }))
  }

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    })
  }

  const notificationCategories = [
    {
      id: "system",
      title: "System Notifications",
      description: "Updates about the platform and service status",
      icon: Zap,
    },
    {
      id: "security",
      title: "Security Alerts",
      description: "Important security updates and alerts",
      icon: Shield,
    },
    {
      id: "network",
      title: "Network Activity",
      description: "Updates about network status and performance",
      icon: Wifi,
    },
    {
      id: "community",
      title: "Community Updates",
      description: "News about the community and events",
      icon: Users,
    },
    {
      id: "marketing",
      title: "Marketing",
      description: "Promotions, offers, and newsletters",
      icon: Info,
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Notification Settings</h1>
      </div>
      <p className="text-muted-foreground mb-8">
        Manage how and when you receive notifications from ThePublic WiFi network
      </p>

      <Tabs defaultValue="categories" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="categories">Notification Categories</TabsTrigger>
          <TabsTrigger value="delivery">Delivery Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="space-y-6">
            {notificationCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 pb-4">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={`${category.id}-in-app`}>In-app</Label>
                      </div>
                      <Switch
                        id={`${category.id}-in-app`}
                        checked={notificationSettings[category.id].inApp}
                        onCheckedChange={() => handleToggleChange(category.id, "inApp")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={`${category.id}-email`}>Email</Label>
                      </div>
                      <Switch
                        id={`${category.id}-email`}
                        checked={notificationSettings[category.id].email}
                        onCheckedChange={() => handleToggleChange(category.id, "email")}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor={`${category.id}-push`}>Push</Label>
                      </div>
                      <Switch
                        id={`${category.id}-push`}
                        checked={notificationSettings[category.id].push}
                        onCheckedChange={() => handleToggleChange(category.id, "push")}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Notification Frequency</h3>
                <RadioGroup value={frequency} onValueChange={setFrequency} className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="realtime" id="realtime" />
                    <Label htmlFor="realtime">Real-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily digest</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly summary</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Quiet Hours</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="start-time">Start Time</Label>
                    <input
                      type="time"
                      id="start-time"
                      defaultValue="22:00"
                      className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md"
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-time">End Time</Label>
                    <input
                      type="time"
                      id="end-time"
                      defaultValue="07:00"
                      className="w-full mt-1 px-3 py-2 bg-background border border-input rounded-md"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Preferences</Button>
      </div>
    </div>
  )
}
