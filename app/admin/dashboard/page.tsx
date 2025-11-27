"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalReservations: 0,
    upcomingReservations: 0,
    totalUsers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total rooms
        const { count: roomCount } = await supabase.from("rooms").select("id", { count: "exact", head: true })

        // Get total reservations
        const { count: resCount } = await supabase.from("reservations").select("id", { count: "exact", head: true })

        // Get upcoming reservations
        const { count: upcomingCount } = await supabase
          .from("reservations")
          .select("id", { count: "exact", head: true })
          .eq("status", "confirmed")
          .gte("start_time", new Date().toISOString())

        // Get total users
        const { count: userCount } = await supabase.from("profiles").select("id", { count: "exact", head: true })

        setStats({
          totalRooms: roomCount || 0,
          totalReservations: resCount || 0,
          upcomingReservations: upcomingCount || 0,
          totalUsers: userCount || 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  if (isLoading) {
    return <div className="text-center py-12">Loading dashboard...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalRooms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReservations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.upcomingReservations}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
