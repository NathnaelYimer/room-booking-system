"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export default function Home() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }
    getUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">RoomBook</div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-700">{user.email}</span>
                <Link href="/protected/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} variant="destructive">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Book Your Perfect Meeting Space</h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Find and reserve conference rooms, meeting spaces, and private offices in seconds. Manage your bookings
          effortlessly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          {user ? (
            <>
              <Link href="/protected/rooms">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Browse Rooms
                </Button>
              </Link>
              <Link href="/protected/dashboard">
                <Button size="lg" variant="outline">
                  My Bookings
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Easy Scheduling</h3>
            <p className="text-gray-600">View real-time availability and book rooms instantly</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Perfect Fit</h3>
            <p className="text-gray-600">Choose from rooms tailored to your meeting needs</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Quick Management</h3>
            <p className="text-gray-600">Manage all your bookings from one dashboard</p>
          </div>
        </div>
      </main>
    </div>
  )
}
