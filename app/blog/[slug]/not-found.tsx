import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BlogNotFound() {
  return (
    <div className="container flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Blog Post Not Found</h1>
      <p className="mt-4 text-xl text-muted-foreground">Sorry, we couldn't find the blog post you're looking for.</p>
      <Button asChild className="mt-8">
        <Link href="/blog">Back to Blog</Link>
      </Button>
    </div>
  )
}
