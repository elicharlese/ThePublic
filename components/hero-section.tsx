"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wifi } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <motion.h1
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Decentralized WiFi Network for <span className="gradient-text">Everyone</span>
              </motion.h1>
              <motion.p
                className="max-w-[600px] text-muted-foreground md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Join ThePublic network and be part of the decentralized internet revolution. Connect, host, and earn
                rewards.
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/connect">
                <Button size="lg" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                  Connect Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/host">
                <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
                  Host a Node
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-32 w-32 rounded-full bg-purple-500/20 animate-pulse" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="h-48 w-48 rounded-full border-2 border-purple-500/30 animate-ping"
                  style={{ animationDuration: "3s" }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="h-64 w-64 rounded-full border border-purple-500/20 animate-ping"
                  style={{ animationDuration: "4s" }}
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Wifi className="h-16 w-16 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
