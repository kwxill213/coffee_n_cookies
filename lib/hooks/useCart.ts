import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Product } from '../definitions';

interface CartItem extends Product {
  quantity: number;
  selectedToppings?: any[];
}

interface CartState {
  cart: CartItem[];
  loadCart: (phone: string) => Promise<void>;
  addToCart: (item: CartItem, phone: string) => Promise<void>;
  removeFromCart: (phone: string, itemId: number) => Promise<void>;
  updateQuantity: (phone: string, itemId: number, quantity: number) => Promise<void>;
  clearCart: (phone: string | null) => Promise<void>;
}

export const useCart = create<CartState>((set) => ({
  cart: [],
  loadCart: async (phone) => {
    if (!phone) return;

    try {
      const response = await axios.get(`/api/cart/${phone}`);
      
      // Обновляем состояние корзины полученными данными
      set({ cart: response.data });
    } catch (error) {
      console.error('Ошибка при получении корзины:', error);
      toast.error('Не удалось получить корзину');
    }
  },
  addToCart: async (newItem, phone) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Пожалуйста, авторизуйтесь');
        return;
      }
  
      const cartData = {
        productId: newItem.id,
        quantity: newItem.quantity, 
        selectedToppings: newItem.selectedToppings || []
      };
  
      const response = await axios.post(`/api/cart/add/${phone}`, 
        cartData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      set((state) => {
        const existingItemIndex = state.cart.findIndex(
          item => item.id === newItem.id
        )
  
        if (existingItemIndex > -1) {
          const updatedCart = [...state.cart]
          updatedCart[existingItemIndex].quantity += newItem.quantity
          return { cart: updatedCart }
        }
  
        return { cart: [...state.cart, newItem] }
      });
  
      toast.success(`${newItem.name} добавлен в корзину`);
    } catch (error: any) {
      console.error('Ошибка при добавлении в корзину:', error);
      toast.error(error.response?.data?.error || 'Не удалось добавить товар в корзину');
    }
  },
  removeFromCart: async (phone, itemId) => {
    try {
      await axios.delete('/api/cart/product/delete', {
        data: { phone, productId: itemId }
      });

      set((state) => ({
        cart: state.cart.filter(item => item.id !== itemId)
      }));

      toast.success('Товар удален из корзины');
    } catch (error: any) {
      console.error('Ошибка при удалении из корзины:', error);
      toast.error(error.response?.data?.error || 'Не удалось удалить товар');
    }
  },
  updateQuantity: async (phone, itemId, quantity) => {
    try {
      await axios.patch('/api/cart/product/updateQuantity', 
        { phone, productId: itemId, quantity }
      );

      set((state) => ({
        cart: state.cart.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      }));
    } catch (error: any) {
      console.error('Ошибка при обновлении количества:', error);
      toast.error(error.response?.data?.error || 'Не удалось обновить количество');
    }
  },
  clearCart: async (phone) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Пожалуйста, авторизуйтесь');
        return;
      }

      await axios.delete('/api/cart/clear', {
        data: { phone },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      set({ cart: [] });
      toast.success('Корзина очищена');
    } catch (error: any) {
      console.error('Ошибка при очистке корзины:', error);
      toast.error(error.response?.data?.error || 'Не удалось очистить корзину');
    }
  }
}));