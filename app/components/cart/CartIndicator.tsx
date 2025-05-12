// components/CartIndicator.tsx
"use client"
import { useState, useRef, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { useAuth } from "@/lib/hooks/useAuth";
import { CartPreview } from "./CartPreview";

export const CartIndicator = () => {
  const { cart } = useCart();
  const { phone } = useAuth();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsPreviewOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsPreviewOpen(false);
    }, 200);
  };

  // Закрытие при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsPreviewOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div 
      className="relative" 
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center space-x-2 cursor-pointer">
        <div className="relative">
          <ShoppingCart className="h-5 w-5 text-coffee-600 hover:text-coffee-800 transition-colors" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-coffee-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        <span className="text-coffee-600 hidden md:inline hover:text-coffee-800 transition-colors">
          Корзина
        </span>
      </div>
      
      {isPreviewOpen && phone && (
        <div 
          className="absolute right-0 z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <CartPreview />
        </div>
      )}
    </div>
  );
};