"use client"

import { type FC, type ReactNode, useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import type { WalletError } from "@solana/wallet-adapter-base"
import { useToast } from "@/components/ui/use-toast"
import { endpoint, getWalletAdapters } from "@/lib/solana-wallet-config"

interface SolanaWalletProviderProps {
  children: ReactNode
}

export const SolanaWalletProvider: FC<SolanaWalletProviderProps> = ({ children }) => {
  const { toast } = useToast()

  // Generate the wallet adapters
  const wallets = useMemo(() => {
    try {
      return getWalletAdapters()
    } catch (error) {
      console.error("Failed to get wallet adapters:", error)
      return []
    }
  }, [])

  // Handle wallet errors
  const onError = (error: WalletError) => {
    toast({
      title: "Wallet Error",
      description: error.message || "An unknown error occurred with your wallet",
      variant: "destructive",
    })
    console.error(error)
  }

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
