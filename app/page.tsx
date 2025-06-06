import { HeroSection } from "@/components/hero-section"
import { NetworkStats } from "@/components/network-stats"
import { HowItWorks } from "@/components/how-it-works"
import { JoinNetwork } from "@/components/join-network"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <NetworkStats />
      <HowItWorks />
      <JoinNetwork />
    </div>
  )
}
