// components/home/MenuSection.tsx
import { Category, Product } from "@/lib/definitions"
import ProductCard from "./ProductCard"
import CategorySection from "./CategorySection"

interface MenuSectionProps {
  selectedCategory: Category | null
  onCategorySelect: (category: Category) => void
  onResetCategory: () => void
  onAddToCart: (product: Product) => void
  filteredProducts: Product[]
}

export default function MenuSection({ 
  selectedCategory, 
  onCategorySelect, 
  onResetCategory,
  onAddToCart,
  filteredProducts
}: MenuSectionProps) {
  return (
    <section className="bg-coffee-100 rounded-lg shadow-md p-12">
      <h2 className="text-4xl font-semibold text-center mb-12 text-coffee-700">
        {selectedCategory ? (
          <div className="flex items-center">
            <button onClick={onResetCategory} className="text-coffee-600 hover:underline">Меню</button> / {selectedCategory.name}
          </div>
        ) : "Наше меню"}
      </h2>

      {selectedCategory ? (
        <div className="grid md:grid-cols-2 gap-12">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product: Product) => ( 
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={onAddToCart}
              />
            ))
          ) : (
            <p className="text-center text-coffee-600">Нет товаров в этой категории.</p>
          )}
        </div>
      ) : (
        <CategorySection 
        title="Категории" 
        categories={[]}
        onSelect={onCategorySelect} 
/>
      )}
    </section>
  )
}