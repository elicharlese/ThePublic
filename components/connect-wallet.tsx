"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/hooks/use-wallet"
import { Wallet } from "lucide-react"

interface ConnectWalletProps {
  minimal?: boolean
}

export function ConnectWallet({ minimal = false }: ConnectWalletProps) {
  const { connect, disconnect, isConnected, address, balance } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  if (minimal) {
    return <Wallet className="h-8 w-8 text-white mb-2" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Connection</CardTitle>
        <CardDescription>Connect your wallet to access ThePublic network features</CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Connected Address</p>
              <p className="font-mono text-xs bg-muted p-2 rounded-md mt-1 break-all">{address}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Balance</p>
              <p className="font-mono text-sm mt-1">{balance} SOL</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">
              Connect your wallet to access premium features and earn rewards
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {isConnected ? (
          <Button variant="outline" className="w-full" onClick={disconnect}>
            Disconnect Wallet
          </Button>
        ) : (
          <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
