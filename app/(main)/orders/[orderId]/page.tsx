'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useAuth } from '@/lib/hooks/useAuth'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import Link from 'next/link'

interface OrderItem {
  id: number
  product_id: number
  product_name: string
  product_price: number
  quantity: number
}

interface Order {
  id: number
  user_id: number
  restaurant_id: number | null
  restaurant_name: string | null
  address: string | null
  status_id: number
  status_name: string
  total_amount: number
  created_at: string
  delivery_time: string
  items: OrderItem[]
}

const statusColors: Record<number, string> = {
  1: 'bg-blue-100 text-blue-800', // В обработке
  2: 'bg-yellow-100 text-yellow-800', // Готовится
  3: 'bg-green-100 text-green-800', // В пути
  4: 'bg-purple-100 text-purple-800', // Доставлен
  5: 'bg-red-100 text-red-800' // Отменен
}

export default function OrderPage() {
  const { orderId } = useParams()
  const { phone } = useAuth()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setOrder(response.data)
      } catch (error) {
        toast.error('Не удалось загрузить заказ')
        console.error('Ошибка загрузки заказа:', error)
      } finally {
        setLoading(false)
      }
    }

    if (phone) {
      fetchOrder()
    }
  }, [orderId, phone])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-500"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Заказ не найден</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Не удалось найти заказ с ID {orderId}</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/profile">Вернуться в профиль</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Заказ #{order.id}</CardTitle>
              <Badge className={statusColors[order.status_id]}>
                {order.status_name}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Информация о заказе</h3>
                <p>Дата: {format(new Date(order.created_at), 'dd MMMM yyyy HH:mm', { locale: ru })}</p>
                <p>Сумма: {order.total_amount} ₽</p>
                <p>
                  Способ получения: {order.restaurant_id ? 'Самовывоз' : 'Доставка'}
                </p>
                {order.restaurant_name && (
                  <p>Ресторан: {order.restaurant_name}</p>
                )}
                {order.address && (
                  <p>Адрес доставки: {order.address}</p>
                )}
                <p>
                  Примерное время: {format(new Date(order.delivery_time), 'HH:mm', { locale: ru })}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Статус заказа</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${order.status_id >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <span className={order.status_id >= 1 ? 'font-medium' : 'text-gray-500'}>В обработке</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${order.status_id >= 2 ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                    <span className={order.status_id >= 2 ? 'font-medium' : 'text-gray-500'}>Готовится</span>
                  </div>
                  {!order.restaurant_id && (
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${order.status_id >= 3 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span className={order.status_id >= 3 ? 'font-medium' : 'text-gray-500'}>В пути</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${order.status_id >= 4 ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                    <span className={order.status_id >= 4 ? 'font-medium' : 'text-gray-500'}>
                      {order.restaurant_id ? 'Готов к выдаче' : 'Доставлен'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Состав заказа</h3>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.product_name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span>{item.product_price * item.quantity} ₽</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/profile">К истории заказов</Link>
            </Button>
            {order.status_id == 1 && (
              <Button 
  variant="destructive"
  onClick={async () => {
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statusId: 5 // ID статуса "Отменен"
        })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      setOrder({
        ...order,
        status_id: 5,
        status_name: 'Отменен'
      });
      toast.success('Заказ отменен');
    } catch (error) {
      toast.error('Не удалось отменить заказ');
      console.error('Cancel order error:', error);
    }
  }}
>
  Отменить заказ
</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}