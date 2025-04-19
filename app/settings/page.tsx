import Link from "next/link"
import { Settings, Moon, Globe, Bell, Shield, User } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Settings | ThePublic",
  description: "Manage your settings and preferences for ThePublic WiFi network",
}

export default function SettingsPage() {
  const settingsCategories = [
    {
      title: "Dark Mode",
      description: "Customize your dark mode experience",
      icon: <Moon className="h-6 w-6" />,
      href: "/settings/dark-mode",
    },
    {
      title: "Language",
      description: "Change your preferred language",
      icon: <Globe className="h-6 w-6" />,
      href: "/settings/language",
    },
    {
      title: "Notifications",
      description: "Manage your notification preferences",
      icon: <Bell className="h-6 w-6" />,
      href: "/settings/notifications",
    },
    {
      title: "Privacy",
      description: "Control your privacy settings",
      icon: <Shield className="h-6 w-6" />,
      href: "/settings/privacy",
    },
    {
      title: "Account",
      description: "Manage your account details",
      icon: <User className="h-6 w-6" />,
      href: "/settings/account",
    },
  ]

  return (
    <div className="container py-10">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      <p className="text-muted-foreground mb-8">Manage your settings and preferences for ThePublic WiFi network</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {settingsCategories.map((category) => (
          <Link key={category.title} href={category.href}>
            <Card className="h-full transition-all hover:shadow-md dark:hover:shadow-purple-900/20">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2 dark:bg-primary/20">{category.icon}</div>
                <div>
                  <CardTitle>{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
