"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function JoinNetwork() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Join <span className="gradient-text">ThePublic</span> Network Today
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Be part of the decentralized internet revolution. Connect, host, and earn rewards.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-2">
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
          </div>
        </motion.div>
      </div>
    </section>
  )
}
