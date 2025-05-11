import Link from 'next/link';
import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">О нас</h1>
      <p className="text-lg mb-4">
        Добро пожаловать в "<span className="font-bold">Coffee & Cookies</span>"! 
        Мы - небольшая команда, объединенная страстью к кофе и печеньям, желающая дарить вам наслаждение от каждого глотка и укуса.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Наша философия</h2>
      <p className="text-lg mb-4">
        Мы верим, что отличный кофе и печенье начинаются с качественных ингредиентов. 
        Поэтому мы используем только свежие, натуральные продукты, чтобы создать вкусные и полезные угощения.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Наша команда</h2>
      <p className="text-lg mb-4">
        За каждой чашкой кофе и печеньем стоит команда талантливых бариста и пекарей, 
        которые работают, чтобы ваше угощение всегда было на высшем уровне.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Мы любим наших клиентов</h2>
      <p className="text-lg mb-4">
        Ваше мнение важно для нас. Мы всегда рады получить отзывы и предложения, которые помогут нам 
        стать лучше и удовлетворить ваши потребности.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-4">Приходите к нам!</h2>
      <p className="text-lg mb-4">
        Приглашаем вас посетить наше кафе, чтобы насладиться атмосферой дружелюбия 
        и попробовать наши угощения, приготовленные с душой. Мы находимся по адресу: 
        <strong> ул. Кофейная, 10, г. Москва</strong>.
      </p>
      {/* <div className="text-center mt-8">
        <Link href="/" className=" px-6 py-2 text-white rounded ">
          Заказать сейчас
        </Link>
      </div> */}
    </div>
  );
};

export default AboutPage;