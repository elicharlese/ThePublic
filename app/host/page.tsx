import type { Metadata } from "next"
import { HostIntro } from "@/components/host/host-intro"
import { SetupWizard } from "@/components/host/setup-wizard"
import { NodeRequirements } from "@/components/host/node-requirements"

export const metadata: Metadata = {
  title: "Host a Node | ThePublic",
  description: "Learn how to host your own node on ThePublic WiFi network and earn rewards",
}

export default function HostPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <HostIntro />

      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-3xl font-bold mb-8">Get Started</h2>
        <SetupWizard />
      </div>

      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-3xl font-bold mb-8">Node Requirements</h2>
        <NodeRequirements />
      </div>
    </div>
  )
}
