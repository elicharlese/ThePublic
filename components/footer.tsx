"use client"
import Link from "next/link"
import { AnimatedModeToggle } from "./animated-mode-toggle"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="text-xl font-bold">
              ThePublic
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">Decentralized WiFi network powered by the community</p>
            <div className="mt-4 flex items-center space-x-2">
              <AnimatedModeToggle />
              <span className="text-sm text-muted-foreground">Toggle theme</span>
              <Link href="/settings/dark-mode" className="text-sm text-purple-500 hover:underline ml-2">
                Customize
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium">Product</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/network" className="text-muted-foreground hover:text-foreground">
                  Network
                </Link>
              </li>
              <li>
                <Link href="/nodes" className="text-muted-foreground hover:text-foreground">
                  Nodes
                </Link>
              </li>
              <li>
                <Link href="/host" className="text-muted-foreground hover:text-foreground">
                  Host a Node
                </Link>
              </li>
              <li>
                <Link href="/connect" className="text-muted-foreground hover:text-foreground">
                  Connection Technology
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium">Settings</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/settings/dark-mode" className="text-muted-foreground hover:text-foreground">
                  Dark Mode
                </Link>
              </li>
              <li>
                <Link href="/settings/language" className="text-muted-foreground hover:text-foreground">
                  Language
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-muted-foreground hover:text-foreground">
                  All Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ThePublic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
