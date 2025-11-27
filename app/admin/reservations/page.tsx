"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AllReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from("reservations")
      .select(`
        id,
        start_time,
        end_time,
        status,
        notes,
        user_id,
        rooms (
          id,
          name,
          price_per_hour
        ),
        profiles:user_id (
          email,
          full_name
        )
      `)
      .eq("status", "confirmed")
      .order("start_time", { ascending: true })

    if (!error) {
      setReservations(data || [])
    }
    setIsLoading(false)
  }

  const handleCancel = async (reservationId: string) => {
    if (confirm("Cancel this reservation?")) {
      const { error } = await supabase.from("reservations").update({ status: "cancelled" }).eq("id", reservationId)

      if (!error) {
        fetchReservations()
      }
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading reservations...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">All Reservations</h1>

      {reservations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No reservations</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation: any) => (
            <Card key={reservation.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{reservation.rooms?.name}</CardTitle>
                    <p className="text-sm text-gray-600">
                      {reservation.profiles?.[0]?.full_name} ({reservation.profiles?.[0]?.email})
                    </p>
                  </div>
                  <p className="text-sm font-semibold">${reservation.rooms?.price_per_hour}/hr</p>
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
                  Cancel Reservation
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
