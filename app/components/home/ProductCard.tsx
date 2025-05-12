// components/products/ProductCard.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Product } from "@/lib/definitions"
import ProductModal from "../Modals/ProductModal"
import { useAuth } from "@/lib/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product, quantity: number, selectedToppings?: any[]) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activePromotions, setActivePromotions] = useState<any[]>([])
  const { phone } = useAuth()
  const { toast } = useToast();

  useEffect(() => {
    const fetchActivePromotions = async () => {
      try {
        const response = await axios.get('/api/promotions/active')
        setActivePromotions(response.data)
      } catch (error) {
        console.error('Ошибка при загрузке акций:', error)
      }
    }
    fetchActivePromotions()
  }, [])

  const promotion = activePromotions.find(p => p.product_id === product.id)
  const price = promotion 
    ? product.price * (1 - promotion.discount_percent / 100)
    : product.price

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!phone) {
      toast({title: "Ошибка",description: "Сначала необходимо авторизоваться!",variant: "destructive",});
      return
    }
    onAddToCart(product, 1)
  }

  return (
    <>
      <div 
        className="flex gap-4 items-start p-4 border border-coffee-200 bg-cookie-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex-shrink-0">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={120}
              height={120}
              className="w-24 h-24 rounded-lg object-cover shadow-sm"
            />
          ) : (
            <div className="w-24 h-24 rounded-lg bg-coffee-100 flex items-center justify-center shadow-sm">
              <span className="text-coffee-400 text-sm">No Image</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-coffee-800">{product.name}</h3>
            <div className="flex items-center gap-2">
              {promotion ? (
                <>
                  <span className="line-through text-gray-400">₽{product.price}</span>
                  <span className="text-xl font-bold text-coffee-600">₽{price.toFixed(2)}</span>
                  <span className="text-sm text-green-600">-{promotion.discount_percent}%</span>
                </>
              ) : (
                <span className="text-xl font-bold text-coffee-600 whitespace-nowrap">
                  ₽{product.price}
                </span>
              )}
            </div>
          </div>
          
          <p className="text-coffee-500 text-sm line-clamp-2">{product.description}</p>
          
          <div className="mt-2">
            <Button 
              size="sm" 
              onClick={handleAddToCart}
              className="bg-coffee-600 hover:bg-coffee-700"
            >
              В корзину
            </Button>
          </div>
        </div>
      </div>

      <ProductModal
        product={product}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddToCart={(quantity, toppings) => onAddToCart(product, quantity, toppings)}
      />
    </>
  )
}