"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (error || !profile || profile.role !== "admin") {
        router.push("/protected/dashboard")
        return
      }

      setUser(user)
      setIsAdmin(true)
      setIsLoading(false)
    }

    checkAdmin()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              RoomBook
            </Link>
            <div className="flex gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/admin/rooms">
                <Button variant="ghost">Manage Rooms</Button>
              </Link>
              <Link href="/admin/reservations">
                <Button variant="ghost">All Reservations</Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">{user?.email} (Admin)</span>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
