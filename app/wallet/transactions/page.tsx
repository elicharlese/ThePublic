import { WalletTransaction } from "@/components/wallet/wallet-transaction"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function WalletTransactionsPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-2">Wallet Transactions</h1>
      <p className="text-muted-foreground mb-8">Send and receive SOL using your connected wallet</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WalletTransaction />

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-8">Connect your wallet to view transaction history</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
