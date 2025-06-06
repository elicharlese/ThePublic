"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWalletHistory } from "@/hooks/use-wallet-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Clock, Trash2, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useWalletModal } from "@/contexts/wallet-modal-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function WalletHistoryList() {
  const { history, removeFromHistory, clearHistory } = useWalletHistory()
  const { openModal } = useWalletModal()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleClearHistory = () => {
    clearHistory()
    setShowClearConfirm(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection History</CardTitle>
        <CardDescription>Previously connected wallets</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No connection history yet</p>
            <p className="text-sm mt-1">Connect a wallet to start building your history</p>
            <Button className="mt-4" onClick={openModal}>
              Connect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {history.map((entry) => (
                <motion.div
                  key={entry.publicKey}
                  className="flex items-center justify-between p-3 rounded-lg border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 rounded-full p-2">
                      <Wallet className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="font-mono">
                          {entry.publicKey.slice(0, 6)}...{entry.publicKey.slice(-4)}
                        </span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(entry.lastConnected), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Connected {entry.connectionCount}x
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeFromHistory(entry.publicKey)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove from history</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              {!showClearConfirm ? (
                <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(true)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear History
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Are you sure?</span>
                  <Button variant="destructive" size="sm" onClick={handleClearHistory}>
                    Yes, Clear
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowClearConfirm(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
