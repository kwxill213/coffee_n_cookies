"use client"
import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Mail, Search, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  created_at: string
  is_processed: boolean
}

const SupportPage = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'processed' | 'unprocessed'>('all')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/contact-messages')
      setMessages(response.data)
    } catch (error) {
      console.error('Error fetching messages:', error)
      toast.error('Не удалось загрузить сообщения')
    } finally {
      setLoading(false)
    }
  }

  const toggleMessageStatus = async (id: number) => {
    try {
      const message = messages.find(m => m.id === id)
      if (!message) return

      const updatedStatus = !message.is_processed
      await axios.patch(`/api/admin/contact-messages/${id}`, {
        is_processed: updatedStatus
      })

      setMessages(messages.map(m => 
        m.id === id ? { ...m, is_processed: updatedStatus } : m
      ))
      
      toast.success(`Сообщение помечено как ${updatedStatus ? 'отвеченное' : 'неотвеченное'}`)
    } catch (error) {
      console.error('Error updating message status:', error)
      toast.error('Не удалось изменить статус сообщения')
    }
  }

  const filteredMessages = messages
    .filter(message => {
      const matchesSearch = 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = 
        filter === 'all' || 
        (filter === 'processed' && message.is_processed) ||
        (filter === 'unprocessed' && !message.is_processed)
      
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-coffee-800 mb-6">Центр поддержки</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-coffee-400" />
            <input
              type="text"
              placeholder="Поиск по сообщениям..."
              className="pl-10 pr-4 py-2 w-full border border-coffee-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              onClick={() => setFilter('all')}
            >
              Все
            </Button>
            <Button 
              variant={filter === 'unprocessed' ? 'default' : 'outline'} 
              onClick={() => setFilter('unprocessed')}
              className="flex items-center gap-2"
            >
              <Circle className="h-4 w-4" />
              Неотвеченные
            </Button>
            <Button 
              variant={filter === 'processed' ? 'default' : 'outline'} 
              onClick={() => setFilter('processed')}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Отвеченные
            </Button>
            <Button 
              variant="outline" 
              onClick={fetchMessages}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-coffee-600"></div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-12 text-coffee-600">
            <Mail className="mx-auto h-12 w-12 mb-4 text-coffee-400" />
            <p className="text-lg">Сообщения не найдены</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map(message => (
              <div 
                key={message.id} 
                className={`p-4 border rounded-lg transition-colors ${
                  message.is_processed 
                    ? 'bg-coffee-50 border-coffee-200' 
                    : 'bg-white border-coffee-300 shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-coffee-800">{message.name}</h3>
                    <p className="text-sm text-coffee-600">{message.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-coffee-500">
                      {formatDate(message.created_at)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleMessageStatus(message.id)}
                      className="p-1"
                    >
                      {message.is_processed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-coffee-400" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="mt-2 p-3 bg-white rounded border border-coffee-100">
                  <p className="text-coffee-700 whitespace-pre-line">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SupportPage