import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Careers | ThePublic",
  description: "Join our team and help build the future of decentralized WiFi networks.",
}

// Mock job listings - in a real app, this would come from a CMS or API
const jobListings = [
  {
    id: 1,
    title: "Senior Blockchain Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Design and implement smart contracts and blockchain infrastructure for our decentralized WiFi network.",
    slug: "senior-blockchain-engineer",
  },
  {
    id: 2,
    title: "Community Manager",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    description: "Build and nurture our global community of node operators and network users.",
    slug: "community-manager",
  },
  {
    id: 3,
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Create intuitive and responsive user interfaces for our web and mobile applications.",
    slug: "frontend-developer",
  },
  {
    id: 4,
    title: "Network Operations Specialist",
    department: "Operations",
    location: "Remote",
    type: "Full-time",
    description: "Monitor and optimize the performance of our decentralized WiFi network.",
    slug: "network-operations-specialist",
  },
]

export default function CareersPage() {
  return (
    <div className="container py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Careers</h1>
          <p className="text-muted-foreground md:text-xl">
            Join us in building the future of decentralized connectivity
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Why Work With Us</h2>
          <p className="leading-7">
            At ThePublic, we're not just building a product—we're building a movement. Our team is passionate about
            creating technology that empowers communities and increases access to the internet. We value creativity,
            autonomy, and impact, and we're looking for people who share our vision of a more connected and equitable
            world.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4">
              <h3 className="font-bold">Remote-First</h3>
              <p className="text-sm text-muted-foreground">Work from anywhere in the world with flexible hours.</p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-bold">Competitive Compensation</h3>
              <p className="text-sm text-muted-foreground">
                Salary, equity, and token incentives aligned with your contribution.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-bold">Growth Opportunities</h3>
              <p className="text-sm text-muted-foreground">
                Continuous learning and career development in a rapidly growing field.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Open Positions</h2>
          <div className="space-y-4">
            {jobListings.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>
                    {job.department} • {job.location} • {job.type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{job.description}</p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/careers/${job.slug}`}
                    className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                  >
                    View details →
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="rounded-lg border p-6 text-center">
          <h2 className="text-xl font-bold">Don't see a position that fits your skills?</h2>
          <p className="mt-2 text-muted-foreground">We're always looking for talented individuals to join our team.</p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  )
}
