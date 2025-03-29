"use client"
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const promotions = [
  {
    title: "Утренний заряд",
    description: "Кофе + печенье со скидкой 20% с 8:00 до 11:00",
    image: "/promo-1.jpg"
  },
  {
    title: "Вторник со скидкой",
    description: "Каждый вторник -15% на все напитки",
    image: "/promo-2.jpg"
  },
  {
    title: "Комплимент к кофе",
    description: "Бесплатное печенье к любому кофе",
    image: "/promo-3.jpg"
  }
];

const menuItems = [
  // Напитки
  { name: "Эспрессо", price: 120, mainCategory: "Напитки", category: "горячий кофе", description: "Крепкий и насыщенный" },
  { name: "Американо", price: 150, mainCategory: "Напитки", category: "горячий кофе", description: "Классический черный кофе" },
  { name: "Капучино", price: 180, mainCategory: "Напитки", category: "горячий кофе", description: "Нежный кофе с молочной пеной" },
  { name: "Латте", price: 200, mainCategory: "Напитки", category: "горячий кофе", description: "Мягкий кофейный напиток" },
  { name: "Iced coffee", price: 180, mainCategory: "Напитки", category: "холодный кофе", description: "Кофе со льдом" },
  { name: "Чай черный", price: 100, mainCategory: "Напитки", category: "горячий чай", description: "Ароматный черный чай" },
  { name: "Чай зеленый", price: 100, mainCategory: "Напитки", category: "горячий чай", description: "Полезный зеленый чай" },
  { name: "Лимонад", price: 120, mainCategory: "Напитки", category: "лимонад", description: "Освежающий напиток" },
  { name: "Горячий шоколад", price: 150, mainCategory: "Напитки", category: "горячий шоколад", description: "Сладкий горячий шоколад" },
  { name: "Бутылка воды", price: 90, mainCategory: "Напитки", category: "бутылированные напитки", description: "Обычная питьевая вода" },

  // Еда
  { name: "Яичница", price: 150, mainCategory: "Еда", category: "завтраки", description: "Сытная яичница" },
  { name: "Хлеб с маслом", price: 50, mainCategory: "Еда", category: "выпечка", description: "Свежий хлеб с маслом" },
  { name: "Шоколадное печенье", price: 80, mainCategory: "Еда", category: "печенье", description: "Сладкое с шоколадной крошкой" },
  { name: "Овсяное печенье", price: 90, mainCategory: "Еда", category: "печенье", description: "Полезное и вкусное" },
  { name: "Миндальное печенье", price: 100, mainCategory: "Еда", category: "печенье", description: "С нежным миндальным вкусом" },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { name: "Горячий кофе", mainCategory: "Напитки" },
    { name: "Холодный кофе", mainCategory: "Напитки" },
    { name: "Горячий чай", mainCategory: "Напитки" },
    { name: "Холодный чай", mainCategory: "Напитки" },
    { name: "Горячий шоколад, лимонад и другое", mainCategory: "Напитки" },
    { name: "Бутилированные напитки", mainCategory: "Напитки" },
    { name: "Завтраки", mainCategory: "Еда" },
    { name: "Выпечка", mainCategory: "Еда" },
    { name: "Печенье", mainCategory: "Еда" }
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleResetCategory = () => {
    setSelectedCategory(null);
  };

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category.toLowerCase() === selectedCategory.name.toLowerCase())
    : [];

  return (
    <div className="container mx-auto px-4 py-8 bg-coffee-50">
      {/* Slogan Section */}
      <section className="relative overflow-hidden bg-coffee-100 rounded-lg p-12 shadow-sm mb-16">
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-coffee-200 rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-cookie-200 rounded-full opacity-30 blur-2xl"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-center space-x-4">
            <div className="w-2 h-2 bg-coffee-500 rounded-full animate-pulse"></div>
            <h1 className="text-6xl font-bold text-coffee-700 font-display tracking-tight">
              Coffee n Cookies
            </h1>
            <div className="w-2 h-2 bg-coffee-500 rounded-full animate-pulse"></div>
          </div>
          <p className="text-2xl text-coffee-600 leading-relaxed mb-8">
            Уютное место, где каждый глоток и кусочек создают особую атмосферу комфорта и вкуса
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-coffee-500 text-white rounded-lg hover:bg-coffee-600 transition-colors">
              Забронировать стол
            </button>
            <button className="px-6 py-3 border border-coffee-500 text-coffee-700 rounded-lg hover:bg-coffee-100 transition-colors">
              Посмотреть меню
            </button>
          </div>
        </div>
      </section>

      {/* Promotions Carousel */}
      <section className="mb-16">
        <Carousel className="w-full">
          <CarouselContent>
            {promotions.map((promo, index) => (
              <CarouselItem key={index}>
                <Card className="bg-coffee-100 border-coffee-200 shadow-lg">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="w-1/2 pr-6">
                      <h2 className="text-3xl font-bold mb-4 text-coffee-700">{promo.title}</h2>
                      <p className="text-xl mb-6 text-coffee-600">{promo.description}</p>
                      <Button variant="default" className="bg-coffee-500 hover:bg-coffee-600 text-white">Подробнее</Button>
                    </div>
                    <div className="w-1/2">
                      <Image 
                        src={promo.image} 
                        alt={promo.title} 
                        width={500} 
                        height={300} 
                        className="rounded-lg object-cover shadow-md"
                      />
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-coffee-600" />
          <CarouselNext className="text-coffee-600" />
        </Carousel>
      </section>

      {/* Menu Section */}
      <section className="bg-coffee-100 rounded-lg shadow-md p-12">
        <h2 className="text-4xl font-semibold text-center mb-12 text-coffee-700">
          {selectedCategory ? (
            <div className="flex items-center">
              <button onClick={handleResetCategory} className="text-coffee-600 hover:underline">Меню</button> / {selectedCategory.name}
            </div>
          ) : "Наше меню"}
        </h2>

        {/* Поиск категорий и отображение меню */}
        {selectedCategory == null ? (
          <div>
            <h2 className="text-4xl font-semibold mb-12 text-coffee-700">Напитки</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {categories
                .filter(category => category.mainCategory === "Напитки")
                .map((category, index) => (
                  <div key={index} className="bg-coffee-50 p-8 rounded-lg text-center cursor-pointer hover:bg-coffee-200 transition-colors flex items-center gap-3" onClick={() => handleCategorySelect(category)}>
                    <img
                      src={`/static/images/category/${category.name.toLowerCase()}.jpg`}
                      alt={category.name}
                      className="w-28 h-28 rounded-full shadow-md"
                    />
                    <h3 className="text-3xl font-medium text-coffee-700">{category.name}</h3>
                  </div>
                ))}
            </div>

            <h2 className="text-4xl font-semibold mb-12 text-coffee-700 mt-10">Еда</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {categories
                .filter(category => category.mainCategory === "Еда")
                .map((category, index) => (
                  <div key={index} className="bg-coffee-50 p-8 rounded-lg text-center cursor-pointer hover:bg-coffee-200 transition-colors flex items-center gap-3" onClick={() => handleCategorySelect(category)}>
                    <img
                      src={`/static/images/category/${category.name.toLowerCase()}.jpg`}
                      alt={category.name}
                      className="w-28 h-28 rounded-full shadow-md"
                    />
                    <h3 className="text-3xl font-medium text-coffee-700">{category.name}</h3>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-coffee-200 pb-4 last:border-b-0 hover:bg-coffee-200 transition-colors rounded-lg px-4 py-2">
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold text-coffee-800">{item.name}</span>
                      <span className="text-xl font-bold text-coffee-600">{item.price} ₽</span>
                    </div>
                    <p className="text-coffee-500 mt-1">{item.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-coffee-600">Нет товаров в этой категории.</p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
