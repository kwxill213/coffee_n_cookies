import db from "@/db";
import { restaurantsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    const restaurants = await db
      .select({
        id: restaurantsTable.id,
        name: restaurantsTable.name,
        address: restaurantsTable.address,
        phone: restaurantsTable.phone,
        coordinateX: restaurantsTable.coordinateX,
        coordinateY: restaurantsTable.coordinateY,
        opening_time: restaurantsTable.opening_time,
        closing_time: restaurantsTable.closing_time,
        image_url: restaurantsTable.image_url,
        description: restaurantsTable.description,
        is_active: restaurantsTable.is_active
      })
      .from(restaurantsTable)
      .where(eq(restaurantsTable.is_active, true));

    // Преобразуем координаты в массив [number, number]
    const formattedRestaurants = restaurants.map(restaurant => ({
      ...restaurant,
      coordinates: [Number(restaurant.coordinateX), Number(restaurant.coordinateY)] as [number, number],
      openingHours: `${restaurant.opening_time} - ${restaurant.closing_time}`
    }));

    return NextResponse.json(formattedRestaurants);
  } catch (error) {
    console.error('Ошибка при получении ресторанов:', error);
    return NextResponse.json(
      { error: 'Не удалось получить список ресторанов' },
      { status: 500 }
    );
  }
}