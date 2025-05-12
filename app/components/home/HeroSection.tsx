// components/home/HeroSection.tsx
import { Button } from "@/components/ui/button"

export default function HeroSection() {
const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section')
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  return (
    <section className="relative overflow-hidden bg-coffee-100 rounded-lg p-12 shadow-sm mb-16">
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-coffee-200 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-cookie-200 rounded-full opacity-30 blur-2xl"></div>
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-center space-x-4">
          <div className="w-2 h-2 bg-coffee-500 rounded-full animate-pulse"></div>
          <h1 className="text-6xl font-bold text-coffee-700 font-display tracking-tight">
            Coffee n Cookies
          </h1>
          <div className="w-2 h-2 bg-coffee-500 rounded-full animate-pulse"></div>
        </div>
        <p className="text-2xl text-coffee-600 leading-relaxed mb-8">
          Уютное место, где каждый глоток и кусочек создают особую атмосферу комфорта и вкуса
        </p>
        <div className="flex justify-center space-x-4">
          <Button 
          variant="outline" 
          className="px-6 py-3 border-coffee-500 text-coffee-700 hover:bg-coffee-100"
          onClick={scrollToMenu}
        >
          Посмотреть меню
        </Button>
        </div>
      </div>
    </section>
  )
}