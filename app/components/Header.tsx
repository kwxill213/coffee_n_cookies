"use client"
import Link from "next/link";
import React, { useEffect, useState, useCallback } from 'react';
import { 
  Search, 
  MapPin, 
  User, 
  ShoppingCart,
  X,
  Plus
} from 'lucide-react';
import { useAuth } from "@/lib/hooks/useAuth";
import LoginModal from "./Modals/LoginModal";
import axios from "axios";
import { Category, Product } from "@/lib/definitions";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useCart } from "@/lib/hooks/useCart";
import { CartIndicator } from "./cart/CartIndicator";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import ProductModal from "./Modals/ProductModal";
import { redirect } from "next/dist/server/api-utils";

const Header = () => {
  const { isAuthenticated, phone } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { cart, loadCart, addToCart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (phone) {
      loadCart(phone);
    }
  }, [phone, loadCart]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/admin/tables/Category');
        setCategories(response.data.data);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!phone) return;

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${phone}`);
        const user = response.data.user;
        setAvatar(user.image_url || '');
        setUsername(user.username || '');
        setAddress(user.adress || '');
      } catch (error) {
        console.error("Ошибка загрузки данных пользователя:", error);
        setAvatar('');
        setUsername('');
        setAddress('');
      }
    };
    
    fetchUserData();
  }, [phone, isAuthenticated]);

  const searchProducts = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get('/api/admin/tables/Products');
      const allProducts = response.data.data;

      const filtered = allProducts.filter((product: Product) => {
        const matchesName = product.name.toLowerCase().includes(query.toLowerCase());
        const matchesDescription = product.description.toLowerCase().includes(query.toLowerCase());
        
        const productCategory = categories.find(c => c.id === product.category);
        const matchesCategory = productCategory?.name.toLowerCase().includes(query.toLowerCase());

        return matchesName || matchesDescription || matchesCategory;
      });

      setSearchResults(filtered);
    } catch (error) {
      console.error("Ошибка поиска товаров:", error);
      setSearchResults([]);
    }
  }, [categories]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchProducts(query);
    setShowResults(query.length > 0);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const handleAddToCartFromSearch = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!phone) {
      toast.error("Пожалуйста, авторизуйтесь чтобы добавить товар в корзину");
      return;
    }

    try {
      await addToCart({
        ...product,
        quantity: 1,
        selectedToppings: []
      }, phone);
      
      toast.success(`${product.name} добавлен в корзину`);
    } catch (error) {
      toast.error("Не удалось добавить товар в корзину");
    }
  };

  const handleProductClick = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedProduct(product);
    setShowResults(false);
  };

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
          <div className="flex-1 mx-8 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск товаров..."
                className="w-full px-4 py-2 pl-10 border border-coffee-200 rounded-lg bg-white text-coffee-800 focus:outline-none focus:ring-2 focus:ring-coffee-400"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length > 0 && setShowResults(true)}
              />
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-600" 
                size={20} 
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-coffee-600 hover:text-coffee-800"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Результаты поиска */}
            {showResults && (
              <div className="absolute z-50 mt-2 w-full bg-white border border-coffee-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <ul className="divide-y divide-coffee-100">
                    {searchResults.map((product) => {
                      const category = categories.find(c => c.id === product.category);
                      return (
                        <li 
                          key={product.id} 
                          className="hover:bg-coffee-50 relative"
                        >
                          <div 
                            className="flex items-center p-3 cursor-pointer"
                            onClick={(e) => handleProductClick(product, e)}
                          >
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-12 h-12 rounded-md object-cover mr-3"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-md bg-coffee-100 flex items-center justify-center mr-3">
                                <span className="text-xs text-coffee-400">No Image</span>
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium text-coffee-800">{product.name}</span>
                                <span className="text-coffee-600">{product.price} ₽</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-coffee-500 truncate">{product.description}</span>
                                {category && (
                                  <span className="ml-2 px-2 py-0.5 bg-coffee-100 text-coffee-700 rounded-full text-xs">
                                    {category.name}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              className="ml-2 p-1 rounded-full bg-coffee-100 text-coffee-700 hover:bg-coffee-200 transition-colors"
                              onClick={(e) => handleAddToCartFromSearch(product, e)}
                              title="Добавить в корзину"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-coffee-500">
                    {searchQuery.length > 0 ? "Ничего не найдено" : "Введите поисковый запрос"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Адрес */}
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-coffee-600" />
            <span className="text-coffee-600">{address}</span>
          </div>

          {/* Профиль */}
          {phone ? ( 
            <Link href="/profile" className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-coffee-200">
                <Avatar>
                  <AvatarImage 
                    src={avatar || '/default-avatar.jpg'} 
                    className="h-full w-full object-cover"
                  />
                  <AvatarFallback className="h-full w-full flex items-center justify-center bg-coffee-100 text-coffee-700">
                    {username?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </Link>
          ) : (
            <LoginModal title="Войти" />
          )}

          {/* Корзина */}
          <div className="cursor-pointer" onClick={() => { window.location.href = "/cart" }}>
            <CartIndicator />
            </div>
        </div>

        {/* Второй уровень */}
        <nav className="bg-coffee-50 py-3 border-t border-coffee-200">
          <div className="container mx-auto flex items-center justify-center space-x-8">
            {[
              { name: "Меню доставки", href: "/" },
              { name: "Кофейни", href: "/restaurants" },
              { name: "Акции", href: "/promotions" },
              { name: "О компании", href: "/about" },
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

      {/* Модальное окно продукта */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
          onAddToCart={async (quantity, toppings) => {
            if (!phone) {
              toast.error("Пожалуйста, авторизуйтесь чтобы добавить товар в корзину");
              return;
            }
            
            try {
              await addToCart({
                ...selectedProduct,
                quantity,
                selectedToppings: toppings || []
              }, phone);
              
              toast.success(`${selectedProduct.name} добавлен в корзину`);
              setSelectedProduct(null);
            } catch (error) {
              toast.error("Не удалось добавить товар в корзину");
            }
          }}
        />
      )}
    </>
  );
};

export default Header;