import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RegisterModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/register', {
        phone,
        username,
        password,
      });

      console.log('Регистрация прошла успешно', response.data.message);
      toast.success('Вы успешно зарегистрированы!');
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || 'Ошибка регистрации');
      } else {
        setError('Произошла непредвиденная ошибка');
      }
      console.error('Ошибка регистрации:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-lg bg-white p-6 shadow-xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-center text-2xl font-bold text-gray-800">
            Создать аккаунт
          </DialogTitle>
          {error && (
            <DialogDescription className="text-center text-red-500">
              {error}
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">
                Имя пользователя
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Придумайте логин"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">
                Номер телефона
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="+7 (___) ___-__-__"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Создайте пароль"
                required
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 text-white transition-colors"
            >
              Зарегистрироваться
            </Button>

            <div className="text-center text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={onClose}
                className="text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
              >
                Войти
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;