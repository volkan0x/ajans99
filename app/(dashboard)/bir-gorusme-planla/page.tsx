import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';
import { MeetingForm } from './meeting-form';

export default function BirGorusmePlanlaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ana Sayfaya Dön
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ücretsiz Demo Görüşmesi Planlayın
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ekibimizden biriyle 20 dakikalık bir görüşme ayarlayın. Hizmetlerimiz hakkında detaylı bilgi alın ve tüm sorularınıza yanıt bulun.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-100 text-cyan-600 mb-4">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Esnek Randevu Saatleri
            </h3>
            <p className="text-gray-600">
              Size uygun gün ve saatte görüşme planlayın
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-100 text-cyan-600 mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              20 Dakika
            </h3>
            <p className="text-gray-600">
              Kısa ve verimli bir görüşme ile hızlı bilgi alın
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-100 text-cyan-600 mb-4">
              <User className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Uzman Destek
            </h3>
            <p className="text-gray-600">
              Alanında uzman ekibimizle bire bir görüşün
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <MeetingForm />
      </div>
    </main>
  );
}
