"use client"

import { useState } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { useConnection } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

export function WalletTransaction() {
  const { publicKey, connected } = useWallet()
  const { connection } = useConnection()
  const { toast } = useToast()

  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txSignature, setTxSignature] = useState<string | null>(null)

  const handleSendTransaction = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to send a transaction",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setTxSignature(null)

      // Validate recipient address
      let recipientPubkey: PublicKey
      try {
        recipientPubkey = new PublicKey(recipient)
      } catch (err) {
        throw new Error("Invalid recipient address")
      }

      // Validate amount
      const lamports = Number.parseFloat(amount) * LAMPORTS_PER_SOL
      if (isNaN(lamports) || lamports <= 0) {
        throw new Error("Invalid amount")
      }

      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(publicKey),
          toPubkey: recipientPubkey,
          lamports,
        }),
      )

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = new PublicKey(publicKey)

      // Send transaction
      const signature = await window.solana.signAndSendTransaction(transaction)

      // Confirm transaction
      await connection.confirmTransaction(signature, "confirmed")

      setTxSignature(signature)
      toast({
        title: "Transaction successful",
        description: "Your transaction has been confirmed",
        variant: "default",
      })

      // Reset form
      setRecipient("")
      setAmount("")
    } catch (err: any) {
      console.error("Transaction error:", err)
      setError(err.message || "Failed to send transaction")
      toast({
        title: "Transaction failed",
        description: err.message || "Failed to send transaction",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send SOL</CardTitle>
        <CardDescription>Send SOL to another wallet address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connected ? (
          <div className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">Connect your wallet to send transactions</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="Enter Solana address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (SOL)</Label>
              <Input
                id="amount"
                type="number"
                step="0.001"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {error && (
              <motion.div
                className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {txSignature && (
              <motion.div
                className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle2 className="h-4 w-4" />
                <div className="text-sm">
                  <p>Transaction successful!</p>
                  <a
                    href={`https://explorer.solana.com/tx/${txSignature}?cluster=${process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-xs"
                  >
                    View on Solana Explorer
                  </a>
                </div>
              </motion.div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSendTransaction}
          disabled={!connected || isLoading || !recipient || !amount}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            "Send SOL"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
