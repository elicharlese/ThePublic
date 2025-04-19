"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { useState } from "react"
import { Loader2, Wallet } from "lucide-react"

interface WalletConnectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletConnectionModal({ isOpen, onClose }: WalletConnectionModalProps) {
  const { connect, connecting, wallets } = useWallet()
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  const handleConnect = async (walletName: string) => {
    setSelectedWallet(walletName)
    try {
      await connect(walletName)
      onClose()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setSelectedWallet(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {wallets.map((wallet) => (
            <Button
              key={wallet.adapter.name}
              variant="outline"
              className="flex flex-col items-center justify-center h-24 p-4 hover:bg-muted"
              onClick={() => handleConnect(wallet.adapter.name)}
              disabled={connecting && selectedWallet === wallet.adapter.name}
            >
              {connecting && selectedWallet === wallet.adapter.name ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <div className="h-8 w-8 flex items-center justify-center">
                  <Wallet className="h-6 w-6" />
                </div>
              )}
              <span className="mt-2 text-sm">{wallet.adapter.name}</span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
