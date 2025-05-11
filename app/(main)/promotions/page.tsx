// app/promotions/page.tsx
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

async function getAllPromotions() {
  const res = await fetch('/api/promotions')
  if (!res.ok) throw new Error('Failed to fetch promotions')
  return await res.json()
}

export default async function PromotionsPage() {
  const promotions = await getAllPromotions()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-coffee-800 mb-8">Акции и специальные предложения</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo: any) => (
          <Card key={promo.id} className="bg-coffee-50 border-coffee-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={promo.image_url}
                  alt={promo.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-coffee-700 mb-2">{promo.title}</h2>
                <p className="text-coffee-600 mb-4">{promo.description}</p>
                {promo.discount_percent && (
                  <span className="inline-block bg-coffee-200 text-coffee-800 px-3 py-1 rounded-full text-sm font-semibold">
                    -{promo.discount_percent}%
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}