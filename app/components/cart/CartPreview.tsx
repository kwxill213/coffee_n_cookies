// components/CartPreview.tsx
"use client"
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/hooks/useCart";
import { useAuth } from "@/lib/hooks/useAuth";

export const CartPreview = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { phone } = useAuth();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-coffee-200 z-50 p-4">
      {cart.length === 0 ? (
        <p className="text-coffee-500 text-center py-4">Корзина пуста</p>
      ) : (
        <>
          <div className="max-h-64 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex gap-3 py-3 border-b border-coffee-100 last:border-0">
                <div className="flex-shrink-0">
                  <Image
                    src={item.image_url || '/default-product.jpg'}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-coffee-800">{item.name}</h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-coffee-600">{item.price} ₽ × {item.quantity}</span>
                    <button 
                      onClick={() => phone && removeFromCart(phone, item.id)}
                      className="text-coffee-400 hover:text-coffee-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-coffee-200">
            <div className="flex justify-between font-bold text-coffee-800 mb-4">
              <span>Итого:</span>
              <span>{total} ₽</span>
            </div>
            <Link href="/cart" className="block w-full">
              <Button className="w-full bg-coffee-500 hover:bg-coffee-600">
                Оформить заказ
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};