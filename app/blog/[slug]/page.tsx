import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBlogPostBySlug, getAllBlogPosts } from "@/data/blog-posts"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found | ThePublic Blog",
      description: "The requested blog post could not be found.",
    }
  }

  return {
    title: `${post.title} | ThePublic Blog`,
    description: post.description,
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container py-12 md:py-16 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all posts
        </Link>

        {post.coverImage && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <img
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              className="w-full object-cover"
              style={{ height: "400px" }}
            />
          </div>
        )}

        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
              {post.category}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
            {post.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            )}
          </div>
        </div>

        <div className="prose prose-purple max-w-none dark:prose-invert">
          {post.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.startsWith("# ")) {
              return (
                <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
                  {paragraph.substring(2)}
                </h1>
              )
            } else if (paragraph.startsWith("## ")) {
              return (
                <h2 key={index} className="text-2xl font-bold mt-6 mb-3">
                  {paragraph.substring(3)}
                </h2>
              )
            } else if (paragraph.startsWith("### ")) {
              return (
                <h3 key={index} className="text-xl font-bold mt-5 mb-2">
                  {paragraph.substring(4)}
                </h3>
              )
            } else if (paragraph.startsWith("> ")) {
              return (
                <blockquote key={index} className="border-l-4 border-purple-500 pl-4 italic my-4">
                  {paragraph.substring(2)}
                </blockquote>
              )
            } else if (paragraph.startsWith("- ")) {
              return (
                <ul key={index} className="list-disc pl-5 my-4">
                  {paragraph.split("\n- ").map((item, i) => (
                    <li key={i} className="mb-1">
                      {i === 0 ? item.substring(2) : item}
                    </li>
                  ))}
                </ul>
              )
            } else if (paragraph.startsWith("1. ")) {
              return (
                <ol key={index} className="list-decimal pl-5 my-4">
                  {paragraph.split("\n1. ").map((item, i) => (
                    <li key={i} className="mb-1">
                      {i === 0 ? item.substring(3) : item}
                    </li>
                  ))}
                </ol>
              )
            } else {
              return (
                <p key={index} className="my-4">
                  {paragraph}
                </p>
              )
            }
          })}
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex items-center gap-4">
            {post.authorImage && (
              <img
                src={post.authorImage || "/placeholder.svg"}
                alt={post.author}
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-medium">Written by {post.author}</p>
              <p className="text-sm text-muted-foreground">Published on {post.date}</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="mb-4 text-lg font-medium">Continue Reading</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {getAllBlogPosts()
              .filter((relatedPost) => relatedPost.id !== post.id)
              .slice(0, 2)
              .map((relatedPost) => (
                <Card key={relatedPost.id}>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{relatedPost.title}</CardTitle>
                  </CardHeader>
                  <CardFooter className="p-4 pt-0">
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      Read more →
                    </Link>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
