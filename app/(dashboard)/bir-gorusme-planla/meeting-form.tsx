'use client';

import { Button } from '@/components/ui/button';
import { Calendar, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';

type FormState = {
  success: boolean;
  message?: string;
  error?: string;
} | null;

export function MeetingForm() {
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<FormState>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setState(null);

    const form = e.currentTarget; // Store form reference before async operations
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
      message: formData.get('message'),
      date: formData.get('date'),
      time: formData.get('time'),
    };

    try {
      const response = await fetch('/api/meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', response.headers);
      
      const result = await response.json();
      console.log('API Result:', result);
      
      setState(result);

      if (result.success) {
        form.reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setState({
        success: false,
        error: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        İletişim Bilgileriniz
      </h2>

      {state && (
        <div className={`mb-6 p-4 rounded-lg ${state.success ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {state.success ? state.message : state.error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Ad Soyad <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Adınız ve soyadınız"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            E-posta Adresi <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="ornek@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Telefon Numarası <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="+90 (5XX) XXX XX XX"
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Şirket Adı (Opsiyonel)
          </label>
          <input
            type="text"
            id="company"
            name="company"
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="Şirket adınız"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Mesajınız (Opsiyonel)
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="Hangi hizmetlerimizle ilgileniyorsunuz? Özel ihtiyaçlarınız neler?"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Tercih Ettiğiniz Tarih <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="date"
              name="date"
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
            Tercih Ettiğiniz Saat Aralığı <span className="text-red-500">*</span>
          </label>
          <select
            id="time"
            name="time"
            required
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="">Saat aralığı seçin</option>
            <option value="09:00-11:00">09:00 - 11:00</option>
            <option value="11:00-13:00">11:00 - 13:00</option>
            <option value="13:00-15:00">13:00 - 15:00</option>
            <option value="15:00-17:00">15:00 - 17:00</option>
            <option value="17:00-19:00">17:00 - 19:00</option>
          </select>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="w-full text-lg rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Gönderiliyor...' : 'Görüşme Talebini Gönder'}
          <Calendar className="ml-2 h-5 w-5" />
        </Button>

        <p className="text-sm text-gray-500 text-center">
          Formunuzu gönderdikten sonra 24 saat içinde sizinle iletişime geçeceğiz.
        </p>
      </form>
    </div>
  );
}
