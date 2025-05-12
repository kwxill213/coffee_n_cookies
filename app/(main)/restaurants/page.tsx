"use client"

import { useState, useEffect } from 'react';
import { Restaurant } from '@/lib/definitions';
import { MapPin, Phone, Clock } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/restaurants');
        setRestaurants(response.data);
        
        if (response.data.length > 0) {
          setSelectedRestaurant(response.data[0]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке ресторанов:', error);
        toast.error('Не удалось загрузить рестораны');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-coffee-800 mb-8">Наши кофейни</h1>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-coffee-800 mb-8">Наши кофейни</h1>
      
      {restaurants.length === 0 ? (
        <p className="text-coffee-600">Нет доступной кофейни</p>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Список ресторанов */}
            <div className="lg:w-1/3">
              <div className="space-y-4">
                {restaurants.map(restaurant => (
                  <div 
                    key={restaurant.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedRestaurant?.id === restaurant.id 
                        ? 'bg-coffee-100 border-2 border-coffee-300' 
                        : 'bg-white hover:bg-coffee-50 border border-coffee-200'
                    }`}
                    onClick={() => handleRestaurantSelect(restaurant)}
                  >
                    <h3 className="font-bold text-lg text-coffee-700">{restaurant.name}</h3>
                    <p className="text-coffee-600">{restaurant.address}</p>
                    <p className="text-coffee-500 text-sm mt-2">{restaurant.openingHours}</p>
                    <p className="text-coffee-500 text-sm">{restaurant.phone}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Яндекс Карта */}
            <div className="lg:w-2/3 h-[500px] rounded-lg overflow-hidden shadow-lg bg-coffee-100">
              {selectedRestaurant && (
                <iframe 
                  src={`https://yandex.ru/map-widget/v1/?ll=${selectedRestaurant.coordinates[1]},${selectedRestaurant.coordinates[0]}&z=15&pt=${selectedRestaurant.coordinates[1]},${selectedRestaurant.coordinates[0]},comma`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  className="border-0"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>

          {/* Детали выбранного ресторана */}
          {selectedRestaurant && (
            <div className="mt-8 p-6 bg-coffee-50 rounded-lg">
              <div className="flex flex-col md:flex-row gap-6">
                {selectedRestaurant.image_url && (
                  <div className="md:w-1/3">
                    <img 
                      src={selectedRestaurant.image_url} 
                      alt={selectedRestaurant.name} 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className={selectedRestaurant.image_url ? "md:w-2/3" : "w-full"}>
                  <h2 className="text-2xl font-bold text-coffee-800">{selectedRestaurant.name}</h2>
                  <div className="mt-4 space-y-2">
                    <p className="flex items-center text-coffee-700">
                      <MapPin className="mr-2 h-5 w-5" />
                      {selectedRestaurant.address}
                    </p>
                    <p className="flex items-center text-coffee-700">
                      <Phone className="mr-2 h-5 w-5" />
                      {selectedRestaurant.phone}
                    </p>
                    <p className="flex items-center text-coffee-700">
                      <Clock className="mr-2 h-5 w-5" />
                      Часы работы: {selectedRestaurant.openingHours}
                    </p>
                    {selectedRestaurant.description && (
                      <p className="text-coffee-600 mt-4">{selectedRestaurant.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}