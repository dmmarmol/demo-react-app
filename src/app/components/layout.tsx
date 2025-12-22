// import Navbar from './navbar'
// import Footer from './footer'
import '@styles/globals.css'
 
export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
          <div>The Navbar</div>
          <main>{children}</main>
          <div>The Footer</div>
        </main>
      </body>
    </html>
  )
}