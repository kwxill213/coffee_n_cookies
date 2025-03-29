import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail 
} from 'lucide-react';

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Twitter, href: "#" }
];

const Footer = () => {
  return (
    <footer className="bg-coffee-200 text-coffee-800 py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-coffee-700">О компании</h3>
            <ul className="space-y-3">
              {[
                { name: "О нас", href: "/about" },
                { name: "Новости", href: "/news" },
                { name: "Вакансии", href: "/careers" },
                { name: "Партнеры", href: "/partners" }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-coffee-600 hover:text-coffee-800 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Меню */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-coffee-700">Меню</h3>
            <ul className="space-y-3">
              {[
                { name: "Кофе", href: "/menu/coffee" },
                { name: "Печенье", href: "/menu/cookies" },
                { name: "Завтраки", href: "/menu/breakfast" },
                { name: "Акции", href: "/promotions" }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-coffee-600 hover:text-coffee-800 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-coffee-700">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MapPin className="text-coffee-600" size={20} />
                <span className="text-coffee-600">Москва, ул. Кофейная, 12</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-coffee-600" size={20} />
                <span className="text-coffee-600">+7 (495) 123-45-67</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-coffee-600" size={20} />
                <span className="text-coffee-600">info@coffeencookies.ru</span>
              </li>
            </ul>
          </div>

          {/* Подписка и социальные сети */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-coffee-700">Будьте с нами</h3>
            <div className="space-y-6">
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <Link 
                    key={index} 
                    href={social.href} 
                    className="text-coffee-600 hover:text-coffee-800 transition-colors"
                  >
                    <social.icon size={24} />
                  </Link>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Ваш email" 
                  className="px-3 py-2 rounded-l bg-coffee-100 text-coffee-800 w-full focus:outline-none focus:ring-2 focus:ring-coffee-400"
                />
                <Button 
                  variant="default" 
                  className="bg-coffee-500 text-white hover:bg-coffee-600 rounded-r"
                >
                  Подписаться
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="mt-12 pt-8 border-t border-coffee-300 text-center">
          <p className="text-coffee-600">
            {new Date().getFullYear()} Coffee n Cookies. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;