import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ConnectWallet } from "@/components/connect-wallet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Lock, Wifi, Shield, Zap, Globe, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Connection Technology | ThePublic",
  description: "Learn how ThePublic's decentralized WiFi connection technology works",
}

export default function ConnectPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            Connection Technology
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ThePublic uses advanced decentralized technology to create secure, fast, and reliable WiFi connections
            through our distributed node network.
          </p>
        </div>

        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">How Our Connection Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Decentralized Network Architecture</h3>
              <p className="text-muted-foreground mb-4">
                Unlike traditional ISPs that rely on centralized infrastructure, ThePublic operates on a distributed
                network of nodes hosted by community members. This creates a resilient mesh network that can't be easily
                disrupted.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>No single point of failure</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Automatic rerouting if a node goes offline</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Scales with community growth</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900 rounded-lg p-6 flex items-center justify-center">
              <Image
                src="/purple-mesh-network.png"
                alt="Decentralized Network Architecture"
                width={400}
                height={300}
                className="rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12 md:flex-row-reverse">
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-semibold mb-4">Blockchain-Secured Connections</h3>
              <p className="text-muted-foreground mb-4">
                Every connection on ThePublic is secured and verified through blockchain technology. This ensures
                transparency, prevents unauthorized access, and enables our token-based incentive system.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Cryptographically secured connections</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Immutable connection records</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Transparent usage tracking</span>
                </li>
              </ul>
            </div>
            <div className="order-2 md:order-1 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900 rounded-lg p-6 flex items-center justify-center">
              <Image
                src="/secure-purple-blockchain.png"
                alt="Blockchain-Secured Connections"
                width={400}
                height={300}
                className="rounded-md"
              />
            </div>
          </div>
        </section>

        {/* Technical Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Technical Features</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <Wifi className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Dynamic Mesh Routing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our proprietary routing algorithm finds the fastest path through the network, automatically adjusting
                  to network conditions and node availability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <Lock className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>End-to-End Encryption</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All data transmitted through ThePublic is encrypted using military-grade protocols, ensuring your
                  information remains private and secure.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <Shield className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Zero-Knowledge Proofs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our authentication system verifies users without storing personal data, using cryptographic
                  zero-knowledge proofs for maximum privacy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <Zap className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Adaptive Bandwidth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The network automatically allocates bandwidth based on usage patterns, ensuring optimal performance
                  even during peak usage times.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <Globe className="h-8 w-8 text-purple-500 mb-2" />
                <CardTitle>Global Node Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  With nodes distributed worldwide, ThePublic provides low-latency connections regardless of your
                  location, with automatic region optimization.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
              <CardHeader className="pb-2">
                <ConnectWallet minimal={true} />
                <CardTitle className="text-white">Wallet Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-100">
                  Connect your wallet to access premium features, earn rewards for sharing bandwidth, and participate in
                  network governance.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Connection Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Connection Process</h2>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-8 top-10 bottom-10 w-1 bg-purple-200 dark:bg-purple-800 hidden sm:block"></div>

            <div className="space-y-12">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xl font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Discover Nearby Nodes</h3>
                  <p className="text-muted-foreground mb-4">
                    Our app automatically scans for ThePublic nodes in your vicinity, showing signal strength and
                    available bandwidth for each option.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xl font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Authenticate</h3>
                  <p className="text-muted-foreground mb-4">
                    Connect your wallet or use a guest pass to authenticate. Your credentials are verified on the
                    blockchain without exposing personal information.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xl font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Secure Connection Establishment</h3>
                  <p className="text-muted-foreground mb-4">
                    A secure encrypted tunnel is established between your device and the network. This process takes
                    milliseconds and protects all data transmission.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xl font-bold flex-shrink-0">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Start Browsing</h3>
                  <p className="text-muted-foreground mb-4">
                    Once connected, you can browse the internet with enhanced privacy and speed. Usage is tracked on the
                    blockchain for transparent billing and rewards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience ThePublic?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users already enjoying secure, fast, and decentralized internet access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/download">
                Download App <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent text-white hover:bg-white/10 border-white"
            >
              <Link href="/host">
                Host a Node <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
