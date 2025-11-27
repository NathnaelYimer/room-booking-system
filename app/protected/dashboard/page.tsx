"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DashboardPage() {
  const [reservations, setReservations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchReservations = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("reservations")
        .select(`
          id,
          start_time,
          end_time,
          status,
          notes,
          rooms (
            id,
            name,
            description,
            price_per_hour
          )
        `)
        .eq("user_id", user.id)
        .eq("status", "confirmed")
        .order("start_time", { ascending: true })

      if (error) {
        console.error("Error fetching reservations:", error)
      } else {
        setReservations(data || [])
      }
      setIsLoading(false)
    }

    fetchReservations()
  }, [supabase])

  const handleCancel = async (reservationId: string) => {
    const { error } = await supabase.from("reservations").update({ status: "cancelled" }).eq("id", reservationId)

    if (error) {
      console.error("Error cancelling reservation:", error)
    } else {
      setReservations(reservations.filter((r) => r.id !== reservationId))
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading your bookings...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Link href="/protected/rooms">
          <Button>Book a Room</Button>
        </Link>
      </div>

      {reservations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">You have no upcoming bookings</p>
            <Link href="/protected/rooms">
              <Button>Browse Available Rooms</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{reservation.rooms?.name}</CardTitle>
                    <CardDescription>{reservation.rooms?.description}</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Price per hour</p>
                    <p className="text-lg font-semibold">${reservation.rooms?.price_per_hour}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Start</p>
                    <p className="font-semibold">{new Date(reservation.start_time).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End</p>
                    <p className="font-semibold">{new Date(reservation.end_time).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-semibold capitalize">{reservation.status}</p>
                  </div>
                </div>
                <Button variant="destructive" onClick={() => handleCancel(reservation.id)}>
                  Cancel Booking
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
