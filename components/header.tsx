"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { AnimatedModeToggle } from "@/components/animated-mode-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { WalletConnectionButton } from "@/components/wallet/wallet-connection-button"

const routes = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    href: "/network",
    label: "Network",
  },
  {
    href: "/host",
    label: "Host",
  },
  {
    href: "/connect",
    label: "Connect",
  },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">ThePublic</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === route.href ? "text-foreground" : "text-foreground/60",
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex md:items-center md:gap-2">
            <LanguageSelector />
            <AnimatedModeToggle />
            <WalletConnectionButton />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 py-6">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === route.href ? "text-foreground" : "text-foreground/60",
                    )}
                  >
                    {route.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-4">
                  <LanguageSelector />
                  <AnimatedModeToggle />
                  <WalletConnectionButton />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
