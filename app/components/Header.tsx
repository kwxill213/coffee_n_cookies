"use client"
import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { 
  Search, 
  MapPin, 
  User, 
  ShoppingCart 
} from 'lucide-react';
import { useAuth } from "@/lib/hooks/useAuth";
import Loading from "./Loading";
import LoginModal from "./Modals/LoginModal";

const menuItems = [
  { 
    title: "Меню", 
    items: [
      { name: "Кофе", href: "/menu/coffee" },
      { name: "Печенье", href: "/menu/cookies" },
      { name: "Завтраки", href: "/menu/breakfast" }
    ]
  },
  { 
    title: "О нас", 
    items: [
      { name: "История", href: "/about/history" },
      { name: "Команда", href: "/about/team" },
      { name: "Наши принципы", href: "/about/principles" }
    ]
  }
];

const Header = () => {
  const { isAuthenticated, phone } = useAuth();
  const [isLoading, setIsLoading] = useState(true);



  return (
    <>
      <header className="bg-coffee-100 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6 gap-8">
          {/* Лого и название */}
          <Link className="flex items-center space-x-4" href="/">
            <img 
              src="/static/images/logo.png" 
              alt="Логотип Coffee n Cookies" 
              className="h-12 w-12 rounded-full shadow-md" 
            />
            <h1 className="text-2xl font-bold text-coffee-700">
              Coffee n Cookies
            </h1>
          </Link>

          {/* Город */}
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-coffee-600" />
            <span className="text-coffee-600">Москва</span>
          </div>

          {/* Поиск товаров */}
          <div className="flex-1 mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск товаров..."
                className="w-full px-4 py-2 pl-10 border border-coffee-200 rounded-lg bg-white text-coffee-800 focus:outline-none focus:ring-2 focus:ring-coffee-400"
              />
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-600" 
                size={20} 
              />
            </div>
          </div>

          {/* Адрес */}
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-coffee-600" />
            <span className="text-coffee-600">ул. Кофейная, 12</span>
          </div>

          {/* Профиль */}
         
          {phone ? ( 
            <Link href="/profile" className="flex items-center space-x-2">
            <User className="h-5 w-5 text-coffee-600" />
            {/* <span className="text-coffee-600">Профиль</span> */}
          </Link>
        ) : (
          <LoginModal title="Войти" />
        )}

          {/* Корзина */}
          <Link href="/cart" className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-coffee-600" />
            {/* <span className="text-coffee-600">Корзина</span> */}
          </Link>

          {/* Бронирование */}
          {/* <Button 
            variant="default" 
            className="bg-coffee-500 text-white hover:bg-coffee-600"
          >
            Забронировать
          </Button> */}
        </div>

        {/* Второй уровень */}
        <nav className="bg-coffee-50 py-3 border-t border-coffee-200">
          <div className="container mx-auto flex items-center justify-center space-x-8">
            {[
              { name: "Меню доставки", href: "/" },
              { name: "Рестораны", href: "/restaurants" },
              { name: "Акции", href: "/promotions" },
              { name: "О компании", href: "/about" },
              { name: "Вакансии", href: "/careers" },
              { name: "Контакты", href: "/contacts" }
            ].map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-coffee-600 hover:text-coffee-800 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;