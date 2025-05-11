"use client"
import { Order, User } from '@/lib/definitions';
import { useAuth } from '@/lib/hooks/useAuth';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const statusColors: Record<number, string> = {
  1: "bg-blue-100 text-blue-800",
  2: "bg-yellow-100 text-yellow-800",
  3: "bg-green-100 text-green-800",
  4: "bg-red-100 text-red-800",
};

const ProfilePage = () => {
  const { logout, isAdmin, isAuthenticated, phone } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    username: '',
    gender: null as boolean | null,
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const [visibleOrders, setVisibleOrders] = useState(2);
const showMoreOrders = () => setVisibleOrders(prev => prev + 4);

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`/api/user/${phone}`, {
        params: { withOrders: true }
      });
      
      // Убедимся, что данные сохраняются полностью
      const userData = {
        ...response.data.user,
        orders: response.data.orders || [] // Добавляем заказы в объект пользователя
      };
      
      setUser(userData);
      setEditedData({
        username: userData.username,
        gender: userData.gender,
      });
      
      if (userData.image_url) {
        setAvatarPreview(userData.image_url);
      }
      
      console.log('Полученные данные:', userData); // Для отладки
    } catch (error) {
      console.error('Ошибка получения данных пользователя', error);
    }
  };
  
  if (phone) {
    fetchUserData();
  }
}, [phone]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data.imageUrl;
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('username', editedData.username);
      formData.append('gender', 
        editedData.gender === null ? 'null' : 
        editedData.gender ? 'true' : 'false'
      );
      
      // Если выбрано новое изображение, загружаем его
      if (avatarFile) {
        const imageUrl = await uploadImage(avatarFile);
        formData.append('image_url', imageUrl);
      }
  
      const response = await axios.put(`/api/user/${phone}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      setUser(response.data.user);
      setIsEditing(false);
      toast({
        title: "Успешно!",
        description: "Данные профиля обновлены",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить данные",
        variant: "destructive",
      });
      console.error('Ошибка обновления данных:', error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Доступ запрещен</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg">Вы не авторизованы!</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant="link">
              <Link href="/login">Войти в систему</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="overflow-hidden bg-coffee-100">
          <div className="bg-gradient-to-r from-amber-600 to-amber-800 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-white text-black">
                  <AvatarImage src={avatarPreview || '/default-avatar.jpg'} />
                  <AvatarFallback>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 cursor-pointer">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </label>
                )}
              </div>
              <div>
                {isEditing ? (
                  <Input
                    value={editedData.username}
                    onChange={(e) => setEditedData({...editedData, username: e.target.value})}
                    className="text-2xl font-bold bg-white/20 border-white/30 text-white"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{user?.username || 'Пользователь'}</h1>
                )}
                <p className="text-amber-100">{user?.email}</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Телефон</Label>
                  <p className="mt-1 text-lg">{user?.phone || 'Не указан'}</p>
                </div>
                <div>
                  <Label>Пол</Label>
                  {isEditing ? (
                    <Select
                      value={editedData.gender === null ? "null" : editedData.gender ? "true" : "false"}
                      onValueChange={(value) => setEditedData({
                        ...editedData,
                        gender: value === "null" ? null : value === "true"
                      })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Выберите пол" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">Не указан</SelectItem>
                        <SelectItem value="true">Мужской</SelectItem>
                        <SelectItem value="false">Женский</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1 text-lg capitalize">
                      {user?.gender === null ? 'Не указан' : user?.gender ? 'Мужской' : 'Женский'}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Дата регистрации</Label>
                  <p className="mt-1 text-lg">
                    {user?.created_at ? 
                      format(new Date(user.created_at), 'dd MMMM yyyy', { locale: ru }) : 
                      'Неизвестно'}
                  </p>
                </div>
                <div>
                  <Label>Статус</Label>
                  <p className="mt-1 text-lg">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isAdmin ? 'Администратор' : 'Пользователь'}
                    </span>
                  </p>
                </div>
              </div>
              
            </div>
          </CardContent>

                    <CardContent>
                      <div className="mt-8">
  <h2 className="text-xl font-semibold mb-4">История заказов</h2>
  {!user ? (
    <p>Загрузка данных...</p>
  ) : user.orders && Array.isArray(user.orders) && user.orders.length > 0 ? (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {user.orders.slice(0, visibleOrders).map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow flex flex-col h-full">
            <CardHeader className="p-4 pb-2 flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Заказ #{order.id}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm', { locale: ru })}
                  </p>
                </div>
                <Badge className={`text-xs ${statusColors[order.status_id] || "bg-gray-100 text-gray-800"}`}>
                  {order.status_name}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 py-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{order.total_amount} ₽</span>
                <div className="flex items-center gap-2">

                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                asChild 
                variant="outline" 
                size="sm" 
                className="w-full hover:bg-amber-50 border-amber-200"
              >
                <Link href={`/orders/${order.id}`}>Подробнее</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {user.orders.length > visibleOrders && (
        <div className="mt-6 text-center">
          <Button 
            variant="outline"
            size="sm"
            onClick={showMoreOrders}
            className="border-amber-300 text-amber-800 hover:bg-amber-50"
          >
            Показать еще ({user.orders.length - visibleOrders})
          </Button>
        </div>
      )}
    </>
  ) : (
    <p className="text-muted-foreground">У вас пока нет заказов</p>
  )}
</div>
                    </CardContent>
          <CardFooter className="flex justify-between bg-coffee-200 px-6 py-4">
            <div className="flex gap-2">
              {isAdmin && (
                <Button asChild variant="outline">
                  <Link href="/admin">Панель администратора</Link>
                </Button>
              )}
              {isEditing ? (
                <>
                  <Button onClick={handleSave} disabled={isUploading}>
                    {isUploading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    disabled={isUploading}
                  >
                    Отмена
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Редактировать профиль
                </Button>
              )}
            </div>
            <Button 
              onClick={logout}
              variant="destructive"
              disabled={isUploading}
            >
              Выйти из системы
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;