"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useWallet } from "@/hooks/use-wallet"
import { Loader2 } from "lucide-react"
import { WalletConnectionButton } from "./wallet/wallet-connection-button"

export function ConnectionForm() {
  const { connected } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionType, setConnectionType] = useState("auto")
  const [autoConnect, setAutoConnect] = useState(true)

  const handleConnect = async () => {
    if (!connected) return

    setIsConnecting(true)
    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnecting(false)

    // In a real app, this would redirect to the dashboard
    window.location.href = "/dashboard"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Settings</CardTitle>
        <CardDescription>Configure how you connect to ThePublic network</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="connection-type">Connection Type</Label>
          <Select value={connectionType} onValueChange={setConnectionType} disabled={!connected || isConnecting}>
            <SelectTrigger id="connection-type">
              <SelectValue placeholder="Select connection type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Automatic (Recommended)</SelectItem>
              <SelectItem value="manual">Manual Selection</SelectItem>
              <SelectItem value="secure">Secure Mode</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {connectionType === "manual" && (
          <div className="space-y-2">
            <Label htmlFor="node-id">Node ID (Optional)</Label>
            <Input id="node-id" placeholder="Enter specific node ID" disabled={!connected || isConnecting} />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-connect">Auto-connect</Label>
            <div className="text-xs text-muted-foreground">Automatically connect on startup</div>
          </div>
          <Switch
            id="auto-connect"
            checked={autoConnect}
            onCheckedChange={setAutoConnect}
            disabled={!connected || isConnecting}
          />
        </div>

        {!connected && (
          <div className="mt-4 p-4 bg-accent/50 rounded-lg text-center">
            <p className="text-sm mb-3">Connect your wallet to access network settings</p>
            <WalletConnectionButton size="sm" className="w-full" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleConnect} disabled={!connected || isConnecting}>
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Connect to Network"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
