import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | ThePublic",
  description: "Learn about ThePublic's mission to create a decentralized WiFi network powered by the community.",
}

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About ThePublic</h1>
          <p className="text-muted-foreground md:text-xl">Building the future of decentralized connectivity</p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="leading-7">
            ThePublic is on a mission to create a truly decentralized WiFi network that is owned and operated by the
            community. We believe that internet access is a fundamental right, and by leveraging blockchain technology
            and community participation, we can build a more equitable, resilient, and accessible network for everyone.
          </p>

          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="leading-7">
            Founded in 2023, ThePublic began as a small experiment among a group of technologists and community
            organizers who were frustrated with the limitations and inequities of traditional internet service
            providers. What started as a local mesh network in a single neighborhood has grown into a global movement,
            with thousands of nodes operated by community members across dozens of countries.
          </p>

          <h2 className="text-2xl font-bold">How It Works</h2>
          <p className="leading-7">
            ThePublic network is powered by community-hosted nodes that provide WiFi access to nearby users. Node
            operators are rewarded with cryptocurrency tokens for their contribution to the network, creating an
            economic incentive that aligns with the public good. Users can connect to the network using our mobile app
            or compatible devices, and can choose to become node operators themselves.
          </p>

          <h2 className="text-2xl font-bold">Our Values</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-bold">Decentralization</h3>
              <p className="text-sm text-muted-foreground">
                We believe in distributing power and control across the network.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-bold">Accessibility</h3>
              <p className="text-sm text-muted-foreground">
                Internet access should be available to everyone, regardless of location or income.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-bold">Transparency</h3>
              <p className="text-sm text-muted-foreground">
                Our code is open source and our operations are transparent to the community.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-bold">Sustainability</h3>
              <p className="text-sm text-muted-foreground">
                We design our systems to be economically and environmentally sustainable.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold">Join Us</h2>
          <p className="leading-7">
            Whether you're a developer, community organizer, or simply someone who believes in our mission, there are
            many ways to get involved with ThePublic. Host a node, contribute to our codebase, or spread the word about
            our project. Together, we can build a more connected world.
          </p>
        </div>
      </div>
    </div>
  )
}
