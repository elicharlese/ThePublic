"use client"

import { useState } from "react"
import { PageTransition } from "@/components/page-transition"
import { AnimatedSection } from "@/components/animated-section"
import { WalletConnectionButton } from "@/components/wallet/wallet-connection-button"
import { useWallet } from "@/hooks/use-wallet"
import { motion } from "framer-motion"
import { Wallet, Coins, CheckCircle2, ShieldCheck, History } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletHistoryList } from "@/components/wallet/wallet-history-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function WalletPage() {
  const { connected, publicKey } = useWallet()
  const [showDemo, setShowDemo] = useState(false)
  const [activeTab, setActiveTab] = useState("connect")

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Wallet <span className="gradient-text">Connection</span>
          </h1>
          <p className="text-muted-foreground">Connect your Solana wallet to ThePublic network</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="connect">Connect Wallet</TabsTrigger>
            <TabsTrigger value="history">Connection History</TabsTrigger>
          </TabsList>

          <TabsContent value="connect">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatedSection delay={0.1}>
                <Card>
                  <CardHeader>
                    <CardTitle>Connect Your Wallet</CardTitle>
                    <CardDescription>Connect your Solana wallet to access ThePublic network features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center justify-center py-6">
                      <motion.div
                        className="mb-6 relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/20"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0.2, 0.5],
                          }}
                          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        />
                        <div className="relative z-10 bg-primary/10 rounded-full p-6">
                          <Wallet className="h-12 w-12 text-primary" />
                        </div>
                      </motion.div>

                      {connected ? (
                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <h3 className="text-xl font-semibold">Wallet Connected</h3>
                          </div>
                          <p className="text-muted-foreground mb-4">Your wallet is connected to ThePublic network</p>
                          <div className="bg-accent/50 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Wallet Address</span>
                              <span className="text-sm font-mono">
                                {publicKey?.slice(0, 6)}...{publicKey?.slice(-4)}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          className="text-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <h3 className="text-xl font-semibold mb-2">Connect to Continue</h3>
                          <p className="text-muted-foreground mb-6">
                            Connect your wallet to access ThePublic network features and earn rewards
                          </p>
                        </motion.div>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <WalletConnectionButton showAddress={true} />
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <Card>
                  <CardHeader>
                    <CardTitle>Why Connect Your Wallet?</CardTitle>
                    <CardDescription>Benefits of connecting your Solana wallet</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                          <Coins className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Earn Rewards</h4>
                          <p className="text-sm text-muted-foreground">
                            Earn PUB tokens for sharing your bandwidth with the network
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                          <ShieldCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Secure Authentication</h4>
                          <p className="text-sm text-muted-foreground">
                            Securely authenticate with the network using blockchain technology
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                          <History className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium">Connection History</h4>
                          <p className="text-sm text-muted-foreground">
                            Track your wallet connections and easily reconnect to previous wallets
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setShowDemo(!showDemo)}>
                      {showDemo ? "Hide Demo Options" : "Show Demo Options"}
                    </Button>
                  </CardFooter>
                </Card>
              </AnimatedSection>
            </div>

            {showDemo && (
              <AnimatedSection delay={0.3} className="mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Wallet Connection Demo</CardTitle>
                    <CardDescription>Try different button variants</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-muted-foreground">Default</span>
                        <WalletConnectionButton />
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-muted-foreground">Outline</span>
                        <WalletConnectionButton variant="outline" />
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-muted-foreground">Ghost</span>
                        <WalletConnectionButton variant="ghost" />
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-muted-foreground">Small</span>
                        <WalletConnectionButton size="sm" />
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-muted-foreground">Large</span>
                        <WalletConnectionButton size="lg" />
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-muted-foreground">With Address</span>
                        <WalletConnectionButton showAddress={true} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            )}
          </TabsContent>

          <TabsContent value="history">
            <AnimatedSection delay={0.1}>
              <WalletHistoryList />
            </AnimatedSection>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}
