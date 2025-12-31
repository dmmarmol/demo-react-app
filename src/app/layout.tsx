import Navbar from '@/app/components/Navbar'
import '@/app/styles/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="grid min-h-screen w-screen grid-cols-12">
          <div className="col-span-3 min-h-screen border-r border-gray-200 bg-white">
            <Navbar />
          </div>
          <main className="col-span-9 flex min-h-screen flex-col bg-gray-50 p-10">
            <div className="flex-1">{children}</div>
            <div className="border-t border-gray-200 pt-4 text-sm text-gray-500">The Footer</div>
          </main>
        </div>
      </body>
    </html>
  )
}
