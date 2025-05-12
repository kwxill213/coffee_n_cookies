// components/home/PromotionsCarousel.tsx
'use client'

import { useState, useEffect } from 'react'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/hooks/useAuth"
import axios from 'axios'
import ProductModal from '../Modals/ProductModal'
import { useCart } from '@/lib/hooks/useCart'
import { Product } from '@/lib/definitions'

const DEFAULT_IMAGE = '/static/images/default-promo.png'

export default function PromotionsCarousel() {
  const [promotions, setPromotions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPromo, setSelectedPromo] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productData, setProductData] = useState<any>(null)
  const { phone } = useAuth()
  const { toast } = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    async function fetchPromotionsWithProducts() {
      try {
        const res = await fetch('/api/promotions/with-products')
        if (!res.ok) throw new Error('Failed to fetch promotions')
        const data = await res.json()
        
        const promotionsWithImages = data.map((promo: any) => ({
          ...promo,
          // Используем изображение продукта, если нет изображения акции
          image_url: promo.image_url || promo.product?.image_url || DEFAULT_IMAGE
        }))
        
        setPromotions(promotionsWithImages)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPromotionsWithProducts()
  }, [])

  const handleDetailsClick = async (promo: any) => {
    setSelectedPromo(promo)
    
    if (promo.product) {
      setProductData({
        ...promo.product,
        discount: promo.discount_percent
      })
    } else {
      setProductData({
        id: promo.id,
        name: promo.title,
        description: promo.description,
        price: 0,
        image_url: promo.image_url,
        discount: promo.discount_percent,
        isPromotion: true
      })
    }
    
    setIsModalOpen(true)
  }

  const handleAddToCart = async (quantity: number) => {
    if (!phone) {
      toast({
        title: "Ошибка",
        description: "Сначала необходимо авторизоваться!",
        variant: "destructive",
      })
      return
    }
    
    if (selectedPromo?.product && productData) {
      try {
        await addToCart({
          ...productData,
          quantity
        }, phone)
        
        toast({
          title: "Успех",
          description: `Акционный товар добавлен в корзину (${quantity} шт.)`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось добавить товар в корзину",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Акция",
        description: "Это акционное предложение",
      })
    }
    
    setIsModalOpen(false)
  }

  if (loading) return <div className="text-center py-8">Загрузка акций...</div>
  if (error) return <div className="text-center py-8 text-red-500">Ошибка: {error}</div>
  if (promotions.length === 0) return <div className="text-center py-8">Нет активных акций</div>

  return (
    <>
      <section className="mb-16">
        <Carousel className="w-full">
          <CarouselContent>
            {promotions.map((promo) => (
              <CarouselItem key={promo.id}>
                <PromoCard 
                  promo={promo} 
                  onDetailsClick={() => handleDetailsClick(promo)} 
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-coffee-600" />
          <CarouselNext className="text-coffee-600" />
        </Carousel>
      </section>

      {productData && (
        <ProductModal
          product={productData}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  )
}

function PromoCard({ promo, onDetailsClick }: { promo: any, onDetailsClick: () => void }) {
  // Определяем источник изображения
  const imageSrc = promo.image_url || DEFAULT_IMAGE

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
          <Button 
            className="bg-coffee-500 hover:bg-coffee-600"
            onClick={onDetailsClick}
          >
            Подробнее
          </Button>
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