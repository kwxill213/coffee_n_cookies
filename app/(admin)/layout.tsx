"use client"
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect, usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Table, MessageSquare, Headphones, ListOrdered, LogOut, BadgePercent } from 'lucide-react';
import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout, phone, isAdmin, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Перенаправляем если пользователь не админ
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  const menuItems = [
    {
      name: 'Таблицы',
      href: '/admin/tables',
      icon: <Table className="h-5 w-5" />,
      active: pathname.startsWith('/admin/tables')
    },
    // {
    //   name: 'Отзывы',
    //   href: '/admin/reviews',
    //   icon: <MessageSquare className="h-5 w-5" />,
    //   active: pathname.startsWith('/admin/reviews')
    // },
    {
      name: 'Поддержка',
      href: '/admin/support',
      icon: <Headphones className="h-5 w-5" />,
      active: pathname.startsWith('/admin/support')
    },
    {
      name: 'Заказы',
      href: '/admin/orders',
      icon: <ListOrdered className="h-5 w-5" />,
      active: pathname.startsWith('/admin/orders')
    },
    {
      name: 'Акции',
      href: '/admin/promotions',
      icon: <BadgePercent  className="h-5 w-5" />,
      active: pathname.startsWith('/admin/promotions')
    }
  ];

  // Если не админ - показываем сообщение о запрете доступа
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Доступ запрещен</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg">У вас недостаточно прав для просмотра этой страницы</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant="link">
              <Link href="/">Вернуться на главную</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Боковое меню */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-amber-600" />
            Админ панель
          </h1>
          <p className="text-sm text-gray-500 mt-1">{phone}</p>
        </div>

        <nav className="p-2">
          {menuItems.map((item) => (
            <Link href={item.href} key={item.name}>
              <Button
                variant={item.active ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-2 ${item.active ? 'bg-amber-50 text-amber-600' : ''}`}
              >
                {item.icon}
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t absolute bottom-0 w-64">
          <Button
          onClick={() => {
            if (confirm('Вы уверены что хотите выйти?')) {
          redirect("/")
        }
      }}
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="h-5 w-5" />
            Выход
          </Button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;