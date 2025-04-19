import { DarkModeSettings } from "@/components/dark-mode-settings"

export const metadata = {
  title: "Dark Mode Settings | ThePublic",
  description: "Customize your dark mode experience on ThePublic WiFi network",
}

export default function DarkModePage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Dark Mode Settings</h1>
      <p className="text-muted-foreground text-center mb-8">
        Customize your dark mode experience to reduce eye strain and improve readability
      </p>
      <DarkModeSettings />
    </div>
  )
}
