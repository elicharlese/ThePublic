"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ColorShowcase() {
  const colorCategories = [
    {
      name: "Purple",
      colors: [
        { name: "purple-50", class: "bg-purple-50 text-gray-900" },
        { name: "purple-100", class: "bg-purple-100 text-gray-900" },
        { name: "purple-200", class: "bg-purple-200 text-gray-900" },
        { name: "purple-300", class: "bg-purple-300 text-gray-900" },
        { name: "purple-400", class: "bg-purple-400 text-white" },
        { name: "purple-500", class: "bg-purple-500 text-white" },
        { name: "purple-600", class: "bg-purple-600 text-white" },
        { name: "purple-700", class: "bg-purple-700 text-white" },
        { name: "purple-800", class: "bg-purple-800 text-white" },
        { name: "purple-900", class: "bg-purple-900 text-white" },
        { name: "purple-950", class: "bg-purple-950 text-white" },
      ],
    },
    {
      name: "Grayscale",
      colors: [
        { name: "white", class: "bg-white text-gray-900 border" },
        { name: "gray-50", class: "bg-gray-50 text-gray-900" },
        { name: "gray-100", class: "bg-gray-100 text-gray-900" },
        { name: "gray-200", class: "bg-gray-200 text-gray-900" },
        { name: "gray-300", class: "bg-gray-300 text-gray-900" },
        { name: "gray-400", class: "bg-gray-400 text-gray-900" },
        { name: "gray-500", class: "bg-gray-500 text-white" },
        { name: "gray-600", class: "bg-gray-600 text-white" },
        { name: "gray-700", class: "bg-gray-700 text-white" },
        { name: "gray-800", class: "bg-gray-800 text-white" },
        { name: "gray-900", class: "bg-gray-900 text-white" },
        { name: "black", class: "bg-black text-white" },
      ],
    },
    {
      name: "UI Colors",
      colors: [
        { name: "background", class: "bg-background text-foreground border" },
        { name: "foreground", class: "bg-foreground text-background" },
        { name: "card", class: "bg-card text-card-foreground border" },
        { name: "card-foreground", class: "bg-card-foreground text-card" },
        { name: "muted", class: "bg-muted text-muted-foreground" },
        { name: "muted-foreground", class: "bg-muted-foreground text-muted" },
        { name: "accent", class: "bg-accent text-accent-foreground" },
        { name: "accent-foreground", class: "bg-accent-foreground text-accent" },
      ],
    },
  ]

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">Color Palette</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {colorCategories.map((category) => (
          <Card key={category.name} className="overflow-hidden">
            <CardHeader className="bg-muted">
              <CardTitle>{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 divide-y">
                {category.colors.map((color) => (
                  <div key={color.name} className={`p-4 ${color.class} flex justify-between`}>
                    <span>{color.name}</span>
                    <span className="font-mono text-xs">{color.class}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
