"use client"
import { User } from '@/lib/definitions';
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
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${phone}`);
        setUser(response.data.user);
        setEditedData({
          username: response.data.user.username,
          gender: response.data.user.gender
        });
        if (response.data.user.avatar) {
          setAvatarPreview(response.data.user.avatar);
        }
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

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('username', editedData.username);
      formData.append('gender', 
        editedData.gender === null ? 'null' : 
        editedData.gender ? 'true' : 'false'
      );
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
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

          <CardFooter className="flex justify-between bg-coffee-200 px-6 py-4">
            <div className="flex gap-2">
              {isAdmin && (
                <Button asChild variant="outline">
                  <Link href="/admin">Панель администратора</Link>
                </Button>
              )}
              {isEditing ? (
                <>
                  <Button onClick={handleSave}>Сохранить</Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
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