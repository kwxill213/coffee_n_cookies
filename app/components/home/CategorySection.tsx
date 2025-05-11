// components/home/CategorySection.tsx
"use client"

import Image from "next/image"
import { Category } from "@/lib/definitions"

interface CategorySectionProps {
  title: string
  categories: Category[]
  onSelect: (category: Category) => void
}

export default function CategorySection({ title, categories, onSelect }: CategorySectionProps) {
  return (
    <div>
      <h2 className="text-4xl font-semibold mb-12 text-coffee-700">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="bg-coffee-50 p-8 rounded-lg text-center cursor-pointer hover:bg-coffee-200 transition-colors flex items-center gap-3" 
            onClick={() => onSelect(category)}
          >
            {category.image_url ? (
              <Image
                src={category.image_url}
                alt={category.name}
                width={112}
                height={112}
                className="w-28 h-28 rounded-full shadow-md object-cover"
              />
            ) : (
              <div className="w-28 h-28 rounded-full shadow-md bg-coffee-200 flex items-center justify-center">
                <span className="text-coffee-500 text-lg">No Image</span>
              </div>
            )}
            <h3 className="text-3xl font-medium text-coffee-700">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}