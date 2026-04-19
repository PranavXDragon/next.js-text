import ContactForm from '@/components/ContactForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Get in Touch</h1>
        <p className="text-gray-600 mb-6">We&apos;d love to hear from you. Send us a message!</p>
        <ContactForm />
      </div>
    </main>
  )
}
