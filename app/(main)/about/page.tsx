import Link from 'next/link';
import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-amber-800 mb-4">Наша история</h1>
        <div className="w-24 h-1 bg-amber-600 mx-auto"></div>
      </div>

      <div className="space-y-8">
        <section className="bg-amber-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-3xl font-semibold text-amber-700 mb-4">Как всё начиналось</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            В 2015 году двое друзей - профессиональный бариста Алексей и кондитер Мария - решили объединить свои страсти 
            и создать место, где идеальная чашка кофе встречается с домашним печеньем. Так родился "<span className="font-bold text-amber-800">Coffee n Cookies</span>" - 
            уютное пространство, где каждый может ощутить гармонию вкусов.
          </p>
        </section>

        <section className="bg-amber-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-3xl font-semibold text-amber-700 mb-4">Наши принципы</h2>
          <ul className="space-y-4 text-lg text-gray-700">
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              <span>Только свежие ингредиенты от проверенных поставщиков</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              <span>Ручная обжарка кофейных зерен небольшими партиями</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              <span>Домашние рецепты печенья, передаваемые в семье Марии</span>
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              <span>Экологичная упаковка и ответственное потребление</span>
            </li>
          </ul>
        </section>

        <section className="bg-amber-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-3xl font-semibold text-amber-700 mb-4">Наше пространство</h2>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            Наше кафе - это не просто место для перекуса. Мы создали атмосферу тепла и уюта, где:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-medium text-amber-700 mb-2">Для работы</h3>
              <p>Удобные рабочие места с розетками и быстрым Wi-Fi</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-medium text-amber-700 mb-2">Для отдыха</h3>
              <p>Мягкие диваны и библиотека с книгами о кофе и кулинарии</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-medium text-amber-700 mb-2">Для детей</h3>
              <p>Детский уголок с безопасными игрушками и специальным меню</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-medium text-amber-700 mb-2">Для гурманов</h3>
              <p>Дегустационные наборы и мастер-классы от наших бариста</p>
            </div>
          </div>
        </section>

        <section className="bg-amber-50 p-6 rounded-lg shadow-sm">
          <h2 className="text-3xl font-semibold text-amber-700 mb-4">Приходите в гости</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Мы находимся в самом сердце Москвы, в уютном дворике на <span className="font-bold">ул. Кофейная, 42</span>. 
            Наши двери открыты ежедневно с 8:00 до 22:00.
          </p>
          <div className="text-center">
            <Link 
              href="/restaurants" 
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
            >
              Как нас найти
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;