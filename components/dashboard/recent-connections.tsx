"use client"

import { useWalletHistory } from "@/hooks/use-wallet-history"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Clock, ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useWalletModal } from "@/contexts/wallet-modal-context"

export function RecentConnections() {
  const { history } = useWalletHistory()
  const { openModal } = useWalletModal()

  // Only show the 3 most recent connections
  const recentConnections = history.slice(0, 3)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Recent Wallet Connections</CardTitle>
        <CardDescription>Previously connected wallets</CardDescription>
      </CardHeader>
      <CardContent>
        {recentConnections.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No connection history yet</p>
            <Button variant="link" size="sm" onClick={openModal} className="mt-1">
              Connect a wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentConnections.map((entry) => (
              <div key={entry.publicKey} className="flex items-center justify-between p-2 rounded-lg border">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 rounded-full p-1.5">
                    <Wallet className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{entry.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(entry.lastConnected), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={openModal}>
                  Connect
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href="/wallet?tab=history" className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            View All History
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
