"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, Coins, Shield, Globe } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

export function HostIntro() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={container}>
      <Card className="glass-card overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 animated-gradient"></div>
        <CardHeader>
          <CardTitle>Become a Node Host</CardTitle>
          <CardDescription>
            Share your internet connection and earn rewards while helping to build a decentralized WiFi network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <motion.div variants={item} className="flex flex-col items-center text-center p-4 card-hover rounded-lg">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Host a Node</h3>
              <p className="text-sm text-muted-foreground">
                Turn your device into a secure access point for ThePublic network
              </p>
            </motion.div>

            <motion.div variants={item} className="flex flex-col items-center text-center p-4 card-hover rounded-lg">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Get paid in PUB tokens for sharing your bandwidth with the network
              </p>
            </motion.div>

            <motion.div variants={item} className="flex flex-col items-center text-center p-4 card-hover rounded-lg">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                Blockchain technology ensures secure connections and protects your privacy
              </p>
            </motion.div>

            <motion.div variants={item} className="flex flex-col items-center text-center p-4 card-hover rounded-lg">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Global Impact</h3>
              <p className="text-sm text-muted-foreground">
                Help build a decentralized internet infrastructure accessible to everyone
              </p>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
