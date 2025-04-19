"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi, Users, Coins, Shield } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <Wifi className="h-10 w-10 text-purple-600" />,
      title: "Host a Node",
      description: "Set up a node on your existing WiFi network and share your excess bandwidth with the community.",
    },
    {
      icon: <Users className="h-10 w-10 text-purple-600" />,
      title: "Connect to the Network",
      description: "Access the internet securely through ThePublic's decentralized network of nodes.",
    },
    {
      icon: <Coins className="h-10 w-10 text-purple-600" />,
      title: "Earn Rewards",
      description: "Node hosts earn cryptocurrency rewards based on bandwidth shared and uptime.",
    },
    {
      icon: <Shield className="h-10 w-10 text-purple-600" />,
      title: "Secure & Private",
      description: "All connections are encrypted and your data remains private and secure.",
    },
  ]

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">Simple steps to join ThePublic network</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-none shadow-sm">
                <CardContent className="pt-6 text-center">
                  <div className="mb-4 flex justify-center">{step.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
