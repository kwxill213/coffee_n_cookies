// app/cart/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useCart } from '@/lib/hooks/useCart'
import { useAuth } from '@/lib/hooks/useAuth'
import { toast } from 'react-hot-toast'
import axios from 'axios'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const { phone, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery')
  const [address, setAddress] = useState('')
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [restaurants, setRestaurants] = useState([])
  const [restaurantsLoading, setRestaurantsLoading] = useState(false)

  // Загружаем адрес пользователя при монтировании
  useEffect(() => {
    if (isAuthenticated && phone) {
      const fetchUserAddress = async () => {
        try {
          const response = await axios.get(`/api/user/${phone}`)
          setAddress(response.data.address || '')
        } catch (error) {
          console.error('Ошибка при загрузке адреса:', error)
        }
      }
      fetchUserAddress()
    }
  }, [isAuthenticated, phone])

  const fetchRestaurants = async () => {
    try {
      setRestaurantsLoading(true)
      const response = await axios.get('/api/restaurants')
      setRestaurants(response.data)
    } catch (error) {
      toast.error('Не удалось загрузить рестораны')
    } finally {
      setRestaurantsLoading(false)
    }
  }

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleCheckout = async () => {
  if (!isAuthenticated) {
    toast.error('Пожалуйста, авторизуйтесь')
    return router.push('/login')
  }

  try {
    setIsLoading(true)

    // Всегда обновляем адрес пользователя, если он изменился
    if (address.trim()) {
      await axios.patch(`/api/user/${phone}`, { address }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
    }

    // Валидация в зависимости от способа получения
    if (deliveryMethod === 'delivery' && !address.trim()) {
      return toast.error('Укажите адрес доставки')
    }

    if (deliveryMethod === 'pickup' && !selectedRestaurant) {
      return toast.error('Выберите ресторан для самовывоза')
    }

    // Создаем заказ
    const orderData = {
      deliveryMethod,
      address: deliveryMethod === 'delivery' ? address : null,
      restaurantId: deliveryMethod === 'pickup' ? selectedRestaurant : null,
      phone: phone,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      }))
    }

    const response = await axios.post('/api/orders', orderData)

    clearCart(phone)
    const estimatedTime = deliveryMethod === 'delivery' ? '30-45 минут' : '15-20 минут'

    toast.success(
      <div>
        <p>Заказ успешно оформлен!</p>
        <p>Примерное время: {estimatedTime}</p>
      </div>,
      { duration: 5000 }
    )

    router.push(`/orders/${response.data.orderId}`)
  } catch (error) {
    console.error('Ошибка при оформлении заказа:', error)
    toast.error('Не удалось оформить заказ')
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        logout()
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      }
    }
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="container mx-auto px-4 py-8">
    <div className="flex space-x-10 justify-start">
      <h1 className="text-3xl font-bold text-coffee-800 mb-8">Корзина</h1>
      
</div>
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-coffee-600 mb-4">Ваша корзина пуста</p>
          <Button onClick={() => router.push('/')}>Вернуться в меню</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Список товаров */}
          <div className="lg:col-span-2">
          <Button className='' onClick={()=> {clearCart(phone)}}>Очистить корзину</Button>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-coffee-800 mb-4">Ваши товары</h2>
              
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-start border-b border-coffee-100 pb-4">
                    <div className="flex-shrink-0 w-20 h-20 bg-coffee-50 rounded-lg overflow-hidden mr-4">
                      {item.image_url && (
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-coffee-800">{item.name}</h3>
                      <p className="text-coffee-600">{item.price} ₽ × {item.quantity} = {item.price * item.quantity} ₽</p>
                      
                      <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center border border-coffee-200 rounded-md">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => updateQuantity(phone || '', item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="px-2">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => updateQuantity(phone || '', item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600"
                          onClick={() => removeFromCart(phone || '', item.id)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Оформление заказа */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-coffee-800 mb-4">Оформление заказа</h2>
              
              <div className="space-y-6">
                {/* Способ получения */}
                <div>
                  <h3 className="font-medium text-coffee-700 mb-2">Способ получения</h3>
                  <RadioGroup 
                    value={deliveryMethod} 
                    onValueChange={(value: 'delivery' | 'pickup') => setDeliveryMethod(value)}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery">Доставка</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup">Самовывоз</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Адрес доставки */}
                {deliveryMethod === 'delivery' && (
                  <div>
                    <Label htmlFor="address">Адрес доставки</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Укажите адрес доставки"
                      className="mt-1"
                    />
                  </div>
                )}

                {/* Выбор ресторана */}
                {deliveryMethod === 'pickup' && (
                  <div>
                    <Label>Выберите ресторан</Label>
                    <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                      {restaurantsLoading ? (
                        <p>Загрузка ресторанов...</p>
                      ) : restaurants.length > 0 ? (
                        restaurants.map(restaurant => (
                          <div 
                            key={restaurant.id}
                            className={`p-3 border rounded-md cursor-pointer ${selectedRestaurant === restaurant.id ? 'border-coffee-500 bg-coffee-50' : 'border-coffee-200'}`}
                            onClick={() => setSelectedRestaurant(restaurant.id)}
                          >
                            <h4 className="font-medium">{restaurant.name}</h4>
                            <p className="text-sm text-coffee-600">{restaurant.address}</p>
                            <p className="text-sm text-coffee-500">{restaurant.opening_time} - {restaurant.closing_time}</p>
                          </div>
                        ))
                      ) : (
                        <Button variant="outline" onClick={fetchRestaurants}>
                          Загрузить рестораны
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Итоговая сумма */}
                <div className="border-t border-coffee-200 pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Итого:</span>
                    <span>{totalAmount} ₽</span>
                  </div>
                </div>

                {/* Кнопка оформления */}
                <Button 
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isLoading || (deliveryMethod === 'pickup' && !selectedRestaurant)}
                >
                  {isLoading ? 'Оформляем...' : 'Оформить заказ'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}