// app/page.tsx
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Category, Product } from "@/lib/definitions"
import HeroSection from "../components/home/HeroSection"
import PromotionsCarousel from "../components/home/PromotionsCarousel"
import CategorySection from "../components/home/CategorySection"
import { useAuth } from "@/lib/hooks/useAuth"
import { useCart } from "@/lib/hooks/useCart"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import ProductCard from "../components/home/ProductCard"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()
  const { phone } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          axios.get('/api/admin/tables/Category'),
          axios.get('/api/admin/tables/Products')
        ])
        
        setCategories(categoriesResponse.data.data)
        setProducts(productsResponse.data.data)
      } catch (error) {
        console.error("Ошибка загрузки данных:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
  }

  const handleResetCategory = () => {
    setSelectedCategory(null)
  }

  const handleAddToCart = async (product: Product, quantity: number, toppings?: any[]) => {
    if (!phone) {
      toast.error("Пожалуйста, авторизуйтесь")
      return
    }

    try {
      await addToCart({
        ...product,
        quantity,
        selectedToppings: toppings || []
      }, phone)
      
      toast.success(`${product.name} добавлен в корзину`)
    } catch (error) {
      toast.error("Не удалось добавить товар в корзину")
    }
  }

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category === selectedCategory.id)
    : []

  const drinkCategories = categories.filter(category => category.isDrink)
  const foodCategories = categories.filter(category => !category.isDrink)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-coffee-50">
      <HeroSection />
      <PromotionsCarousel />

      <section id="menu-section" className="bg-coffee-100 rounded-lg shadow-md p-6 md:p-12">
        <h2 className="text-4xl font-semibold text-center mb-12 text-coffee-700">
          {selectedCategory ? (
            <div className="flex items-center justify-center">
              <button 
                onClick={handleResetCategory} 
                className="text-coffee-600 hover:underline mr-2"
              >
                Меню
              </button> 
              / {selectedCategory.name}
            </div>
          ) : "Наше меню"}
        </h2>

        {!selectedCategory ? (
          <div className="space-y-10">
            <CategorySection 
              title="Напитки" 
              categories={drinkCategories} 
              onSelect={handleCategorySelect} 
            />
            <CategorySection 
              title="Еда" 
              categories={foodCategories} 
              onSelect={handleCategorySelect} 
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <p className="text-center text-coffee-600 col-span-2">
                Нет товаров в этой категории.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}