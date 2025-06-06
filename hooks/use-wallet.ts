"use client"

import { useState, useCallback } from "react"
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react"
import type { WalletName } from "@solana/wallet-adapter-base"

export function useWallet() {
  const { wallets, select, connect, disconnect, connecting, connected, publicKey, wallet } = useSolanaWallet()

  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = useCallback(
    async (walletName: string) => {
      try {
        setIsLoading(true)
        setError(null)

        // Select the wallet
        select(walletName as WalletName)

        // Connect to the selected wallet
        await connect()

        return true
      } catch (err: any) {
        console.error("Failed to connect wallet:", err)
        setError(err.message || "Failed to connect wallet")
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [select, connect],
  )

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect()
      return true
    } catch (err: any) {
      console.error("Failed to disconnect wallet:", err)
      setError(err.message || "Failed to disconnect wallet")
      return false
    }
  }, [disconnect])

  // Return the wallet name if connected
  const walletName = wallet?.adapter?.name || null

  return {
    wallets,
    connect: handleConnect,
    disconnect: handleDisconnect,
    connecting,
    connected,
    publicKey: publicKey?.toBase58() || null,
    walletName,
    isLoading,
    error,
    balance,
    wallet,
  }
}
