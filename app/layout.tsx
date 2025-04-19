import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { SolanaWalletProvider } from "@/contexts/solana-wallet-provider"
import { WalletModalProvider } from "@/contexts/wallet-modal-context"
import { LanguageProvider } from "@/contexts/language-context"
import { NotificationProvider } from "@/contexts/notification-context"
import { ProgressProvider } from "@/contexts/progress-context"
import { ThemeTransition } from "@/components/theme-transition"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ThePublic WiFi Network",
  description: "Decentralized WiFi network powered by the community",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeTransition>
            <LanguageProvider>
              <NotificationProvider>
                <ProgressProvider>
                  <SolanaWalletProvider>
                    <WalletModalProvider>
                      <div className="flex min-h-screen flex-col">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                      </div>
                      <Toaster />
                    </WalletModalProvider>
                  </SolanaWalletProvider>
                </ProgressProvider>
              </NotificationProvider>
            </LanguageProvider>
          </ThemeTransition>
        </ThemeProvider>
      </body>
    </html>
  )
}
