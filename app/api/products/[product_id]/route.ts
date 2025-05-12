import db from "@/db"
import { productsTable } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"


export async function GET(req: Request, context: { params: Promise<{product_id: string}>}){
    try {
        const productId = parseInt((await context.params).product_id)

        if (isNaN(productId)) {
              return NextResponse.json({ error: 'Неверный айди продукта!' }, { status: 400 })
            }

        const product = await db
        .select().from(productsTable).where(eq(productsTable.id, productId)).limit(1)
        if (!product[0]) {
      return NextResponse.json({ error: 'Продукт не найден!' }, { status: 404 })
    }

    return NextResponse.json(product[0])
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка при попытке получения продукта на сервере!' },
      { status: 500 }
    )
  }
}