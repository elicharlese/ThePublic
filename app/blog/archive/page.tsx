import type { Metadata } from "next"
import Link from "next/link"
import { getAllBlogPosts } from "@/data/blog-posts"

export const metadata: Metadata = {
  title: "Blog Archive | ThePublic",
  description: "Browse all articles from ThePublic's blog.",
}

export default function BlogArchivePage() {
  const blogPosts = getAllBlogPosts()

  // Group posts by year and month
  const groupedPosts = blogPosts.reduce(
    (acc, post) => {
      const date = new Date(post.date)
      const year = date.getFullYear()
      const month = date.toLocaleString("default", { month: "long" })

      if (!acc[year]) {
        acc[year] = {}
      }

      if (!acc[year][month]) {
        acc[year][month] = []
      }

      acc[year][month].push(post)
      return acc
    },
    {} as Record<number, Record<string, typeof blogPosts>>,
  )

  // Sort years in descending order
  const sortedYears = Object.keys(groupedPosts)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="container py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Blog Archive</h1>
          <p className="text-muted-foreground md:text-xl">Browse all our articles</p>
        </div>

        <Link
          href="/blog"
          className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          ← Back to blog
        </Link>

        <div className="space-y-12">
          {sortedYears.map((year) => (
            <div key={year} className="space-y-8">
              <h2 className="text-2xl font-bold">{year}</h2>

              {Object.entries(groupedPosts[year]).map(([month, posts]) => (
                <div key={month} className="space-y-4">
                  <h3 className="text-xl font-medium">{month}</h3>

                  <ul className="space-y-2">
                    {posts.map((post) => (
                      <li key={post.id} className="border-b pb-2">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="font-medium hover:text-purple-600 dark:hover:text-purple-400"
                          >
                            {post.title}
                          </Link>
                          <span className="text-sm text-muted-foreground">{post.date}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
