"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Order, Status } from '@/lib/definitions';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminOrdersPage() {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'id' | 'phone' | 'name'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем заказы и статусы
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [ordersRes, statusesRes] = await Promise.all([
          axios.get('/api/admin/orders'),
          axios.get('/api/status')
        ]);
        setOrders(ordersRes.data);
        setStatuses(statusesRes.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        toast.error('Не удалось загрузить данные');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Поиск заказов
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
        params.append('searchType', searchType);
      }
      if (selectedStatus !== 'all') params.append('statusId', selectedStatus);
      
      const response = await axios.get(`/api/admin/orders?${params.toString()}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Ошибка при поиске заказов:', error);
      toast.error('Не удалось выполнить поиск');
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление статуса заказа
  const updateOrderStatus = async (orderId: number, statusId: number) => {
    try {
      await axios.patch('/api/admin/orders', { orderId, statusId });
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status_id: statusId } : order
      ));
      toast.success('Статус обновлен');
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
      toast.error('Не удалось обновить статус');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Доступ запрещен</CardTitle>
          </CardHeader>
          <CardContent>
            <p>У вас нет прав для просмотра этой страницы</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Управление заказами</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Панель поиска */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Введите для поиска..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? 'Поиск...' : 'Найти'}
              </Button>
            </div>
            
            <Tabs 
              value={searchType} 
              onValueChange={(value) => setSearchType(value as 'all' | 'id' | 'phone' | 'name')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="all">Все</TabsTrigger>
                <TabsTrigger value="id">По ID заказа</TabsTrigger>
                <TabsTrigger value="phone">По телефону</TabsTrigger>
                <TabsTrigger value="name">По имени</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Таблица заказов */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Товаров</TableHead>
                  {/* <TableHead>Действия</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Загрузка...
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Заказы не найдены
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.username}</TableCell>
                      <TableCell>{order.phone}</TableCell>
                      <TableCell>{order.total_amount} ₽</TableCell>
                      <TableCell>
                        <Select
                          value={order.status_id.toString()}
                          onValueChange={(value) => 
                            updateOrderStatus(order.id, parseInt(value))
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={order.status_name} />
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.map(status => (
                              <SelectItem 
                                key={status.id} 
                                value={status.id.toString()}
                              >
                                {status.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), 'dd.MM.yyyy HH:mm', { locale: ru })}
                      </TableCell>
                      <TableCell>{order.items_count}</TableCell>
                      {/* <TableCell>
                        <Button variant="outline" size="sm">
                          Подробнее
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}