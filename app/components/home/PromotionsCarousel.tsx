// components/home/PromotionsCarousel.tsx
'use client'

import { useState, useEffect } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"

// Функция для проверки валидности URL
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Заглушка для изображения
const DEFAULT_IMAGE = '/static/images/default-promo.png'

export default function PromotionsCarousel() {
  const [promotions, setPromotions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPromotions() {
      try {
        const res = await fetch('/api/promotions/active')
        if (!res.ok) throw new Error('Failed to fetch promotions')
        const data = await res.json()
        
        // Добавляем проверку URL для каждого промо
        const validatedPromotions = data.map((promo: any) => ({
          ...promo,
          image_url: isValidUrl(promo.image_url) ? promo.image_url : DEFAULT_IMAGE
        }))
        
        setPromotions(validatedPromotions)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPromotions()
  }, [])

  if (loading) return <div className="text-center py-8">Загрузка акций...</div>
  if (error) return <div className="text-center py-8 text-red-500">Ошибка: {error}</div>
  if (promotions.length === 0) return <div className="text-center py-8">Нет активных акций</div>

  return (
    <section className="mb-16">
      <Carousel className="w-full">
        <CarouselContent>
          {promotions.map((promo) => (
            <CarouselItem key={promo.id}>
              <PromoCard promo={promo} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="text-coffee-600" />
        <CarouselNext className="text-coffee-600" />
      </Carousel>
    </section>
  )
}

function PromoCard({ promo }: { promo: any }) {
  // Дополнительная проверка перед рендерингом изображения
  const imageSrc = promo.image_url.startsWith('/') || isValidUrl(promo.image_url) 
    ? promo.image_url 
    : DEFAULT_IMAGE

  return (
    <Card className="bg-coffee-100 border-coffee-200 shadow-lg">
      <CardContent className="flex items-center justify-between p-6">
        <div className="w-1/2 pr-6">
          <h2 className="text-3xl font-bold mb-4 text-coffee-700">{promo.title}</h2>
          <p className="text-xl mb-6 text-coffee-600">{promo.description}</p>
          {promo.discount_percent && (
            <p className="text-2xl font-bold text-coffee-800 mb-4">
              Скидка: {promo.discount_percent}%
            </p>
          )}
          <Button className="bg-coffee-500 hover:bg-coffee-600">Подробнее</Button>
        </div>
        <div className="w-1/2">
          <Image
            src={imageSrc}
            alt={promo.title}
            width={500}
            height={300}
            className="rounded-lg object-cover shadow-md"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = DEFAULT_IMAGE
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}