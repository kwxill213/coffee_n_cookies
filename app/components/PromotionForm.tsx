"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PromotionFormProps, Promotion } from "@/lib/definitions"



export function PromotionForm({ promotion, onSubmit }: PromotionFormProps) {
  const [formData, setFormData] = useState<Promotion>(promotion || {
    title: "",
    description: "",
    image_url: "",
    is_active: true,
    discount_percent: 0,
    start_date: null,
    end_date: null
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      is_active: checked
    }))
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'start_date' | 'end_date') => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value ? new Date(e.target.value) : null
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Название акции</Label>
        <Input 
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <Label>Описание</Label>
        <Textarea 
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />
      </div>
      
      <div>
        <Label>Изображение (URL)</Label>
        <Input 
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="active-status" 
          checked={formData.is_active} 
          onCheckedChange={handleSwitchChange}
        />
        <Label htmlFor="active-status">Активна</Label>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Дата начала</Label>
          <Input
            type="datetime-local"
            onChange={(e) => handleDateChange(e, 'start_date')}
            value={formData.start_date?.toISOString().slice(0, 16) || ""}
          />
        </div>
        <div>
          <Label>Дата окончания</Label>
          <Input
            type="datetime-local"
            onChange={(e) => handleDateChange(e, 'end_date')}
            value={formData.end_date?.toISOString().slice(0, 16) || ""}
          />
        </div>
      </div>
      
      <div>
        <Label>Процент скидки</Label>
        <Input 
          type="number" 
          name="discount_percent"
          value={formData.discount_percent}
          onChange={handleChange}
          min={0}
          max={100}
        />
      </div>
      
      <Button type="submit">Сохранить</Button>
    </form>
  )
}