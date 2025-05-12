"use client"
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useState } from 'react'

const ContactPage = () => {
  const cafes = [
    {
      id: 1,
      name: 'Центральный филиал',
      address: 'Москва, ул. Кофейная, 42',
      phone: '+7 (495) 123-45-67',
      hours: 'Ежедневно с 8:00 до 22:00',
      image: '/static/images/cafe1.jpg',
      coordinates: [55.7558, 37.6176]
    },
    {
      id: 2,
      name: 'Анадырский',
      address: 'Москва, Анадырский проезд, 79с2',
      phone: '+7 (495) 765-43-21',
      hours: 'Ежедневно с 9:00 до 21:00',
      image: '/static/images/cafe2.jpg',
      coordinates: [55.8844080, 37.7137820]
    },
    {
      id: 3,
      name: 'Бульвар Энтузиастов',
      address: 'Москва, бульвар Энтузиастов, 2',
      phone: '+7 (495) 987-65-43',
      hours: 'Ежедневно с 10:00 до 23:00',
      image: '/static/images/cafe3.jpg',
      coordinates: [55.7464810, 37.6826190]
    }
  ]

  const [activeCafe, setActiveCafe] = useState(cafes[0])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<null | 'success' | 'error'>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleCafeChange = (cafe: typeof cafes[0]) => {
    setActiveCafe(cafe)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage('')

    try {
      // Валидация
      if (!formData.name.trim()) {
        throw new Error('Пожалуйста, введите ваше имя')
      }

      if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        throw new Error('Пожалуйста, введите корректный email')
      }

      if (!formData.message.trim()) {
        throw new Error('Пожалуйста, введите ваше сообщение')
      }

      // Отправка данных
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при отправке формы')
      }

      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('Ошибка отправки формы:', error)
      setSubmitStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Произошла неизвестная ошибка')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-coffee-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-coffee-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Свяжитесь с нами</h1>
          <p className="text-xl text-coffee-200 max-w-2xl mx-auto">
            Мы всегда рады вашим вопросам и предложениям. Посетите наши кофейни или напишите нам.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Contact Info */}
          <div className="lg:w-1/2 space-y-8">
            {/* Cafe Selector */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-coffee-900 mb-6">Наши кофейни</h2>
              <div className="space-y-4">
                {cafes.map(cafe => (
                  <div 
                    key={cafe.id}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${activeCafe.id === cafe.id ? 'bg-coffee-100 border-2 border-coffee-300' : 'bg-white hover:bg-coffee-50'}`}
                    onClick={() => handleCafeChange(cafe)}
                  >
                    <h3 className="font-bold text-coffee-800">{cafe.name}</h3>
                    <p className="text-coffee-600">{cafe.address}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Cafe Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-coffee-100 p-3 rounded-full">
                  <MapPin className="text-coffee-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-coffee-900">{activeCafe.name}</h2>
                  <p className="text-coffee-600">{activeCafe.address}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Phone className="text-coffee-600" size={20} />
                  <div>
                    <h3 className="font-semibold text-coffee-700">Телефон</h3>
                    <a href={`tel:${activeCafe.phone.replace(/\D/g, '')}`} className="text-coffee-600 hover:underline">
                      {activeCafe.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Clock className="text-coffee-600" size={20} />
                  <div>
                    <h3 className="font-semibold text-coffee-700">Часы работы</h3>
                    <p className="text-coffee-600">{activeCafe.hours}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Mail className="text-coffee-600" size={20} />
                  <div>
                    <h3 className="font-semibold text-coffee-700">Email</h3>
                    <div className="space-y-1">
                      <a href="mailto:info@coffeencookies.ru" className="text-coffee-600 hover:underline block">
                        info@coffeencookies.ru
                      </a>
                      <a href="mailto:reserve@coffeencookies.ru" className="text-coffee-600 hover:underline block">
                        reserve@coffeencookies.ru
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-coffee-900 mb-6">Мы в соцсетях</h2>
              <div className="flex gap-4">
                {[
                  { icon: Instagram, href: "#" },
                  { icon: Facebook, href: "#" },
                  { icon: Twitter, href: "#" }
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="bg-coffee-100 hover:bg-coffee-200 text-coffee-700 p-3 rounded-full transition-colors"
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div> */}
          </div>

          {/* Right Column - Map and Form */}
          <div className="lg:w-1/2 space-y-8">
            {/* Map */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-96">
              <iframe
                src={`https://yandex.ru/map-widget/v1/?ll=${activeCafe.coordinates[1]},${activeCafe.coordinates[0]}&z=15&pt=${activeCafe.coordinates[1]},${activeCafe.coordinates[0]},comma`}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                className="border-0"
              ></iframe>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-coffee-900 mb-6">Форма обратной связи</h2>
              
              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  Ваше сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {errorMessage || 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.'}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-coffee-700 mb-2">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-coffee-300 focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-coffee-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-coffee-300 focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-coffee-700 mb-2">
                    Ваше сообщение *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-coffee-300 focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                    required
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-coffee-600 hover:bg-coffee-700 py-3 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Cafe Gallery */}
      <div className="bg-coffee-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-coffee-900 mb-12">Наши кофейни</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cafes.map(cafe => (
              <div key={cafe.id} className="group relative overflow-hidden rounded-xl shadow-lg h-64">
                <Image
                  src={cafe.image}
                  alt={cafe.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/80 via-coffee-900/20 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-white font-bold text-xl">{cafe.name}</h3>
                    <p className="text-coffee-200">{cafe.address}</p>
                    {/* <Button 
                      variant="outline" 
                      className="mt-3 text-white border-white hover:bg-white/10"
                      onClick={() => handleCafeChange(cafe)}
                    >
                      Подробнее
                    </Button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage