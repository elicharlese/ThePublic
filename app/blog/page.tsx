import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllBlogPosts } from "@/data/blog-posts"

export const metadata: Metadata = {
  title: "Blog | ThePublic",
  description: "Latest news, updates, and insights from ThePublic's decentralized WiFi network.",
}

export default function BlogPage() {
  const blogPosts = getAllBlogPosts()

  return (
    <div className="container py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Blog</h1>
          <p className="text-muted-foreground md:text-xl">News, updates, and insights from ThePublic</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="text-sm text-muted-foreground">
                  {post.category} • {post.date}
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription>{post.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground">By {post.author}</div>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Read more →
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/blog/archive"
            className="inline-flex items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
          >
            View all posts
          </Link>
        </div>
      </div>
    </div>
  )
}
