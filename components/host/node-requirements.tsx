import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Cpu, Wifi, HardDrive, Globe } from "lucide-react"

export function NodeRequirements() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Node Requirements</CardTitle>
        <CardDescription>Hardware and network requirements to host a node on ThePublic network</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hardware">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="software">Software</TabsTrigger>
          </TabsList>

          <TabsContent value="hardware" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <RequirementItem
                icon={<Cpu className="h-5 w-5 text-primary" />}
                title="Processing Power"
                description="Minimum: Dual-core processor, 2.0 GHz or faster"
                recommended="Quad-core processor, 2.5 GHz or faster"
              />

              <RequirementItem
                icon={<HardDrive className="h-5 w-5 text-primary" />}
                title="Memory & Storage"
                description="Minimum: 4GB RAM, 64GB storage"
                recommended="8GB RAM, 128GB SSD storage"
              />
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p className="mb-2">Compatible devices include:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Raspberry Pi 4 (8GB model recommended)</li>
                <li>Mini PCs with WiFi capabilities</li>
                <li>Dedicated routers with custom firmware support</li>
                <li>Desktop computers with WiFi adapter</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <RequirementItem
                icon={<Wifi className="h-5 w-5 text-primary" />}
                title="Internet Connection"
                description="Minimum: 25 Mbps download, 10 Mbps upload"
                recommended="50+ Mbps download, 20+ Mbps upload"
              />

              <RequirementItem
                icon={<Globe className="h-5 w-5 text-primary" />}
                title="Network Stability"
                description="Stable connection with 99% uptime"
                recommended="Static IP address or DDNS configuration"
              />
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p className="mb-2">Network considerations:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Unlimited data plan recommended</li>
                <li>Check ISP terms of service regarding bandwidth sharing</li>
                <li>WiFi 5 (802.11ac) or WiFi 6 (802.11ax) capability</li>
                <li>Open ports 8080 and 9090 for node communication</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="software" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <RequirementItem
                icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                title="Operating System"
                description="Linux (Ubuntu 20.04+, Debian 11+)"
                recommended="Dedicated ThePublic Node OS (available for download)"
              />

              <RequirementItem
                icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
                title="Wallet Requirements"
                description="Solana wallet for receiving rewards"
                recommended="Hardware wallet for enhanced security"
              />
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p className="mb-2">Software will be installed during setup:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>ThePublic Node Software (open source)</li>
                <li>Solana validator client (lightweight version)</li>
                <li>Network monitoring tools</li>
                <li>Automatic updates and security patches</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function RequirementItem({
  icon,
  title,
  description,
  recommended,
}: {
  icon: React.ReactNode
  title: string
  description: string
  recommended: string
}) {
  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <div className="mt-0.5">{icon}</div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <p className="text-sm mt-2">
          <span className="font-medium text-primary">Recommended:</span> {recommended}
        </p>
      </div>
    </div>
  )
}
