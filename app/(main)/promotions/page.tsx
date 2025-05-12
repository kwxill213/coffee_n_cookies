'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/hooks/useAuth"
import { useCart } from '@/lib/hooks/useCart'
import ProductModal from '@/app/components/Modals/ProductModal'

const DEFAULT_IMAGE = '/static/images/default-promo.png'

export default function PromotionsPage() {
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
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/promotions/with-products`)
        if (!res.ok) throw new Error('Failed to fetch promotions')
        const data = await res.json()
        
        const promotionsWithImages = data.map((promo: any) => ({
          ...promo,
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-coffee-800 mb-8">Акции и специальные предложения</h1>
      
      {promotions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <Card key={promo.id} className="bg-coffee-50 border-coffee-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 flex flex-col h-full">
                <div className="relative h-48 w-full">
                  <Image
                    src={promo.image_url}
                    alt={promo.title}
                    fill
                    className="object-cover rounded-t-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = DEFAULT_IMAGE
                    }}
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h2 className="text-2xl font-bold text-coffee-700 mb-2">{promo.title}</h2>
                  <p className="text-coffee-600 mb-4">{promo.description}</p>
                  {promo.discount_percent > 0 && (
                    <span className="inline-block bg-coffee-200 text-coffee-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                      -{promo.discount_percent}%
                    </span>
                  )}
                </div>
                <div className="p-6 pt-0">
                  <Button 
                    className="w-full bg-coffee-500 hover:bg-coffee-600"
                    onClick={() => handleDetailsClick(promo)}
                  >
                    Подробнее
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-coffee-600 py-12">Нет активных акций</p>
      )}

      {productData && (
        <ProductModal
          product={productData}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  )
}