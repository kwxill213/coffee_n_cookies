// components/RestaurantMap.tsx
"use client"

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { Restaurant } from '@/lib/definitions';

// Фикс для иконок маркеров
const defaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const selectedIcon = L.icon({
  iconUrl: '/marker-icon-selected.png',
  iconRetinaUrl: '/marker-icon-selected-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [35, 51],
  iconAnchor: [17, 51],
  popupAnchor: [1, -44],
  shadowSize: [51, 51]
});

// Компонент для изменения центра карты
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface RestaurantMapProps {
  restaurants: Restaurant[];
  center: [number, number];
  selectedRestaurant: Restaurant | null;
  onSelect: (restaurant: Restaurant) => void;
}

export default function RestaurantMap({ 
  restaurants, 
  center, 
  selectedRestaurant,
  onSelect 
}: RestaurantMapProps) {
  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <ChangeView center={center} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {restaurants.map(restaurant => (
        <Marker
          key={restaurant.id}
          position={restaurant.coordinates}
          icon={selectedRestaurant?.id === restaurant.id ? selectedIcon : defaultIcon}
          eventHandlers={{
            click: () => onSelect(restaurant)
          }}
        >
          <Popup>
            <div className="font-bold text-coffee-800">{restaurant.name}</div>
            <div className="text-sm text-coffee-600">{restaurant.address}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}