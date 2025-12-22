export default function RootPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome</h1>
      <p className="mt-4">This is the root route /</p>
      <a href="/home" className="mt-4 text-blue-600 hover:underline">
        Go to Home →
      </a>
    </main>
  )
}
