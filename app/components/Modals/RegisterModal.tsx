import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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

            // Если API возвращает успешный ответ
            console.log('Регистрация прошла успешно', response.data.message);
            onClose(); // Закрываем модал после успешной регистрации
            toast.success('Вы успешно зарегистрированы!');
        } catch (error) {
            // Обработка ошибок
            if (axios.isAxiosError(error) && error.response) {
                // Отображаем более подробную ошибку
                setError(error.response.data.message || 'Что-то пошло не так');
            } else {
                setError('Что-то пошло не так');
            }
            console.error(error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className='text-center'>Регистрация</DialogTitle>
                    <DialogDescription className='justify-center'>
                        {error && <div className="text-red-500">{error}</div>} {/* Отображение ошибок */}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleRegister} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Логин
                        </Label>
                        <Input
                            id="username"
                            className="col-span-3"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Телефон
                        </Label>
                        <Input
                            id="phone"
                            type="phone"
                            className="col-span-3"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Пароль
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            className="col-span-3"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <DialogFooter className='justify-center'>
                        <div className="flex flex-col items-center">
                            <Button type="submit" className='w-full bg-blue-500 text-white hover:bg-blue-600'>Зарегистрироваться</Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RegisterModal;
