import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import type { WalletAdapter } from "@solana/wallet-adapter-base"

// Define the Solana cluster endpoint
export const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"

// Define wallet metadata
export const walletMetadata: Record<
  string,
  {
    name: string
    icon: string
    popular?: boolean
    url?: string
  }
> = {
  Phantom: {
    name: "Phantom",
    icon: "/wallet-icons/phantom.svg",
    popular: true,
    url: "https://phantom.app/",
  },
  Solflare: {
    name: "Solflare",
    icon: "/wallet-icons/solflare.svg",
    popular: true,
    url: "https://solflare.com/",
  },
}

// Function to get wallet adapters
export function getWalletAdapters(): WalletAdapter[] {
  return [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
}
