import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">התשלום בוצע בהצלחה!</h1>
          
          <p className="text-lg text-gray-700 mb-2">
            תודה על הרכישה
          </p>
          
          <p className="text-gray-600 mb-8">
            קיבלת אישור בדוא״ל עם פרטי ההזמנה.
            נציג יצור איתך קשר בקרוב לתיאום המשלוח.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors"
            >
              חזרה לדף הבית
            </Link>
            
            <Link
              href="/buy"
              className="bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-md transition-colors"
            >
              המשך קנייה
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


