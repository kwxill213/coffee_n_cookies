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
            toast.success("Вы успешно авторизованы!")
            setIsEnterOpen(false);
            localStorage.setItem('token', response.data.token);
            window.location.reload();
        } catch (error) {
             if (axios.isAxiosError(error) && error.response) {
                setError(error.response.data.message || 'Что-то пошло не так');
            } else {
                setError('Что-то пошло не так');
            }
            console.error(error);
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
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600">{title}</button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className='text-center'>Войти</DialogTitle>
                        <DialogDescription className='justify-center'>
                        {error && <div className="text-red-500">{error}</div>} {/* Отображение ошибок */}
                    </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Номер телефона</Label>
                            <Input id="phone" className="col-span-3" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">Пароль</Label>
                            <Input id="password" type="password" className="col-span-3" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <DialogFooter className='justify-center align-middle'>
                            <div className="flex flex-col items-center">
                                <Button type="submit" className='w-full bg-orange-500 text-white hover:bg-orange-600'>Войти</Button>
                                <div className="mt-2">
                                    <DialogClose asChild>
                                        <Label className='text-center flex cursor-pointer' onClick={openRegisterModal}>
                                            Впервые? Зарегистрироваться
                                        </Label>
                                    </DialogClose>
                                </div>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
        </>
    )
}

export default LoginModal;
