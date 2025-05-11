// components/products/ProductModal.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/lib/hooks/useAuth"
import Image from "next/image"
import { useState } from "react"
import { Product } from "@/lib/definitions"
import { useToast } from "@/hooks/use-toast"

interface ProductModalProps {
  product: Product
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddToCart: (quantity: number, selectedToppings?: any[]) => void
}

export default function ProductModal({ 
  product, 
  isOpen, 
  onOpenChange, 
  onAddToCart 
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedToppings, setSelectedToppings] = useState<any[]>([])
  const { phone } = useAuth()
  const { toast } = useToast();


  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  const toggleTopping = (topping: any) => {
    setSelectedToppings(prev => 
      prev.some(t => t.id === topping.id)
        ? prev.filter(t => t.id !== topping.id)
        : [...prev, topping]
    )
  }

  const handleAddToCart = () => {
if (!phone) {
      toast({title: "Ошибка",description: "Сначала необходимо авторизоваться!",variant: "destructive",});
      return
    }
  
    onAddToCart(quantity, selectedToppings)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="fixed z-[1000] max-w-[900px] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 aspect-square relative">
            {product.image_url ? (
              <Image 
                src={product.image_url} 
                alt={product.name} 
                fill
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span>No Image</span>
              </div>
            )}
          </div>
          
          <div className="w-full md:w-1/2">
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold">₽ {product.price}</span>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decrementQuantity}
                >
                  -
                </Button>
                <span>{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={incrementQuantity}
                >
                  +
                </Button>
              </div>
            </div>


            <Button 
              className="w-full" 
              onClick={handleAddToCart}
            >
              Добавить в корзину
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}