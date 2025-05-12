'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface Promotion {
  id: number
  title: string
  description: string
  image_url: string
  discount_percent: number
  is_active: boolean
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/promotions')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setPromotions(data)
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить акции',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePromotion = async (id: number, isActive: boolean) => {
    try {
      const response = await fetch(`/api/promotions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: isActive }),
      })

      if (!response.ok) throw new Error('Failed to update')

      setPromotions(promotions.map(promo => 
        promo.id === id ? { ...promo, is_active: isActive } : promo
      ))
      toast({
        title: 'Успешно',
        description: 'Статус акции обновлен',
      })
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус акции',
        variant: 'destructive',
      })
    }
  }

  const deletePromotion = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту акцию?')) return

    try {
      const response = await fetch(`/api/promotions/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      setPromotions(promotions.filter(promo => promo.id !== id))
      toast({
        title: 'Успешно',
        description: 'Акция удалена',
      })
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить акцию',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Загрузка...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление акциями</h1>
        <Button onClick={() => router.push('/admin/promotions/create')}>
          Создать акцию
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Скидка</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell>{promotion.title}</TableCell>
                <TableCell>{promotion.discount_percent}%</TableCell>
                <TableCell>
                  <Switch
                    checked={promotion.is_active}
                    onCheckedChange={(checked) => togglePromotion(promotion.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/promotions/${promotion.id}`)}
                    >
                      Редактировать
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deletePromotion(promotion.id)}
                    >
                      Удалить
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}