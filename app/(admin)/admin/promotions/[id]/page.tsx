'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import axios from 'axios'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PromotionForm {
  title: string
  description: string
  image_url: string
  discount_percent: number
  is_active: boolean
  product_id: number | null
  category_id: number | null
  conditions: string
}

interface Product {
  id: number
  name: string
}

interface Category {
  id: number
  name: string
}

export default function PromotionEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = id !== 'create'
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const [form, setForm] = useState<PromotionForm>({
    title: '',
    description: '',
    image_url: '',
    discount_percent: 0,
    is_active: true,
    product_id: null,
    category_id: null,
    conditions: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загружаем продукты
        const productsRes = await fetch('/api/admin/tables/Products')
        const productsData = await productsRes.json()
        setProducts(productsData.data)

        // Загружаем категории
        const categoriesRes = await fetch('/api/admin/tables/Category')
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData.data)

        if (isEdit) {
          await fetchPromotion()
        }
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить данные',
          variant: 'destructive',
        })
      }
    }

    fetchData()
  }, [id])

  const fetchPromotion = async () => {
    try {
      const response = await fetch(`/api/promotions/${id}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      
      setForm({
        title: data.title || '',
        description: data.description || '',
        image_url: data.image_url || '',
        discount_percent: data.discount_percent || 0,
        is_active: data.is_active ?? true,
        product_id: data.product_id || null,
        category_id: data.category_id || null,
        conditions: data.conditions || ''
      })
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить акцию',
        variant: 'destructive',
      })
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')
      
      const { imageUrl } = await response.json()
      return imageUrl
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить изображение",
        variant: "destructive",
      })
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = await uploadImage(file)
      if (imageUrl) {
        setForm(prev => ({
          ...prev,
          image_url: imageUrl
        }))
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: Number(value)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = isEdit ? `/api/promotions/${id}` : '/api/admin/tables/Promotions'
      const method = isEdit ? 'put' : 'post'

      const response = await axios[method](url, form, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      toast({
        title: 'Успех',
        description: isEdit ? 'Акция обновлена' : 'Акция создана',
      })
      router.push('/admin/promotions')
    } catch (error) {
      let errorMessage = 'Не удалось сохранить акцию'
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || error.message
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {isEdit ? 'Редактирование акции' : 'Создание акции'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Название</label>
            <Input
              name="title"
              value={form.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Описание</label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Изображение</label>
            <div className="flex items-center gap-4">
              {form.image_url && (
                <div className="relative w-24 h-24">
                  <Image
                    src={form.image_url}
                    alt="Preview"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isUploading}
                className={isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Процент скидки</label>
            <Input
              type="number"
              name="discount_percent"
              min="0"
              max="100"
              value={form.discount_percent}
              onChange={handleNumberChange}
              required
            />
          </div>

          <div>
  <label className="block text-sm font-medium mb-2">Продукт</label>
  <Select
    value={form.product_id ? form.product_id.toString() : undefined}
    onValueChange={(value) => setForm(prev => ({
      ...prev,
      product_id: value ? Number(value) : null
    }))}
  >
    <SelectTrigger>
      <SelectValue placeholder="Выберите продукт" />
    </SelectTrigger>
    <SelectContent>
      {products.map((product) => (
        <SelectItem key={product.id} value={product.id.toString()}>
          {product.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

<div>
  <label className="block text-sm font-medium mb-2">Категория</label>
  <Select
    value={form.category_id ? form.category_id.toString() : undefined}
    onValueChange={(value) => setForm(prev => ({
      ...prev,
      category_id: value ? Number(value) : null
    }))}
  >
    <SelectTrigger>
      <SelectValue placeholder="Выберите категорию" />
    </SelectTrigger>
    <SelectContent>
      {categories.map((category) => (
        <SelectItem key={category.id} value={category.id.toString()}>
          {category.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

          <div>
            <label className="block text-sm font-medium mb-2">Условия</label>
            <Textarea
              name="conditions"
              value={form.conditions}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={form.is_active}
              onCheckedChange={(checked) => setForm(prev => ({
                ...prev,
                is_active: checked
              }))}
            />
            <label className="text-sm font-medium">Активна</label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/promotions')}
            >
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || isSubmitting}
            >
              {isSubmitting ? 'Обработка...' : isEdit ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}