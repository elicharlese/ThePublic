import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact | ThePublic",
  description: "Get in touch with ThePublic team for questions, support, or partnership inquiries.",
}

export default function ContactPage() {
  return <ContactPageClient />
}
