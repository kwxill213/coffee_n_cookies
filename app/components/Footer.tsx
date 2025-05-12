import Link from "next/link";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MapPin, 
  Phone, 
  Mail 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-coffee-100 text-coffee-900 py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Основные разделы */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* О компании */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-coffee-300 pb-2">Компания</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-coffee-700 transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="hover:text-coffee-700 transition-colors">
                  Связаться с нами
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Меню */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-coffee-300 pb-2">Меню</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Link href="/" className="block hover:text-coffee-700 transition-colors">
                  Кофе
                </Link>
                <Link href="/" className="block hover:text-coffee-700 transition-colors">
                  Печенье
                </Link>
                <Link href="/" className="block hover:text-coffee-700 transition-colors">
                  Завтраки
                </Link>
              </div>
              <div className="space-y-2">
                <Link href="/promotions" className="block hover:text-coffee-700 transition-colors">
                  Акции
                </Link>
              </div>
            </div>
          </div>
          
          {/* Контакты */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-coffee-300 pb-2">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 flex-shrink-0" size={18} />
                <span>Москва, ул. Кофейная, 42</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} />
                <span>+7 (495) 123-45-67</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} />
                <span>info@coffeencookies.ru</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Социальные сети
        <div className="flex justify-center gap-6 mb-8">
          <a href="#" className="text-coffee-700 hover:text-coffee-900">
            <Facebook size={20} />
          </a>
          <a href="#" className="text-coffee-700 hover:text-coffee-900">
            <Instagram size={20} />
          </a>
          <a href="#" className="text-coffee-700 hover:text-coffee-900">
            <Twitter size={20} />
          </a>
        </div> */}
        
        {/* Копирайт */}
        <div className="text-center text-sm border-t border-coffee-300 pt-6">
          <p>© {new Date().getFullYear()} Coffee n Cookies. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;