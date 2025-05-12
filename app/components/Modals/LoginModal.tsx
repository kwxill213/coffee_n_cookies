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
import RegisterModal from './RegisterModal';
import { DialogClose } from '@radix-ui/react-dialog';
import axios from 'axios';
import toast from 'react-hot-toast';

const LoginModal = ({ title }: { title: string }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEnterOpen, setIsEnterOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', {
        phone,
        password,
      });

      console.log('Авторизация прошла успешно', response.data.message);
      toast.success("Вы успешно авторизованы!");
      setIsEnterOpen(false);
      localStorage.setItem('token', response.data.token);
      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message || 'Ошибка авторизации');
      } else {
        setError('Произошла непредвиденная ошибка');
      }
      console.error('Ошибка авторизации:', error);
    }
  };

  const openRegisterModal = () => {
    setIsEnterOpen(false);
    setIsRegisterOpen(true);
  };

  return (
    <>
      <Dialog open={isEnterOpen} onOpenChange={setIsEnterOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="default" 
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-full shadow-md transition-colors"
          >
            {title}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-md rounded-lg bg-white p-6 shadow-xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-center text-2xl font-bold text-gray-800">
              Вход в аккаунт
            </DialogTitle>
            {error && (
              <DialogDescription className="text-center text-red-500">
                {error}
              </DialogDescription>
            )}
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">
                  Номер телефона
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500"
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
                  className="w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  placeholder="Введите пароль"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 py-2 text-white transition-colors"
              >
                Войти
              </Button>

              <div className="text-center text-sm text-gray-600">
                <DialogClose asChild>
                  <button
                    type="button"
                    onClick={openRegisterModal}
                    className="text-amber-600 hover:text-amber-700 hover:underline focus:outline-none"
                  >
                    Впервые у нас? Зарегистрироваться
                  </button>
                </DialogClose>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
      />
    </>
  );
};

export default LoginModal;