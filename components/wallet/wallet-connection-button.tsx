"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { useWallet } from "@/hooks/use-wallet"
import { Wallet, ChevronDown, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useWalletModal } from "@/contexts/wallet-modal-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { WalletConnectionModal } from "@/components/wallet/wallet-connection-modal"

interface WalletConnectionButtonProps extends ButtonProps {
  showAddress?: boolean
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  showHistory?: boolean
}

export function WalletConnectionButton({
  showAddress = false,
  variant = "default",
  size = "default",
  showHistory = false,
  className,
  ...props
}: WalletConnectionButtonProps) {
  const { connected, publicKey, disconnect, connecting, isLoading } = useWallet()
  const { openModal } = useWalletModal()
  const router = useRouter()
  const { toast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDisconnect = async () => {
    try {
      await disconnect()
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected successfully",
      })
    } catch (err) {
      toast({
        title: "Error disconnecting wallet",
        description: "There was a problem disconnecting your wallet",
        variant: "destructive",
      })
    }
  }

  const handleViewHistory = () => {
    router.push("/wallet?tab=history")
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  // Loading state
  if (connecting || isLoading) {
    return (
      <Button variant={variant} size={size} disabled className={className} {...props}>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Connecting...
      </Button>
    )
  }

  // Not connected state
  if (!connected) {
    return (
      <>
        <Button variant="outline" size="sm" className="h-9 gap-1.5" onClick={() => router.push("/wallet")}>
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">Connect Wallet</span>
        </Button>

        <WalletConnectionModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </>
    )
  }

  // Connected state
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={cn("flex items-center gap-2", className)} {...props}>
          <div className="bg-green-500 h-2 w-2 rounded-full" />
          {showAddress && publicKey ? (
            <span className="font-mono">
              {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
            </span>
          ) : (
            <span>Connected</span>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div>
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-xs text-muted-foreground">Wallet</span>
            {publicKey && (
              <span className="text-xs font-mono">
                {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
              </span>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openModal}>Switch Wallet</DropdownMenuItem>
          {showHistory && <DropdownMenuItem onClick={handleViewHistory}>View History</DropdownMenuItem>}
          <DropdownMenuItem onClick={handleDisconnect}>Disconnect</DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
