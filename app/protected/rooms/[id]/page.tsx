"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { validateBookingTimes, calculateDurationHours, calculateTotalCost } from "@/lib/validation/booking"

export default function BookRoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string
  const [room, setRoom] = useState<any>(null)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<any[]>([])
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase.from("rooms").select("*").eq("id", roomId).single()

      if (error) {
        console.error("Error fetching room:", error)
      } else {
        setRoom(data)
      }
      setIsLoading(false)
    }

    fetchRoom()
  }, [roomId, supabase])

  useEffect(() => {
    if (startTime && endTime) {
      const errors = validateBookingTimes(startTime, endTime)
      setValidationErrors(errors)

      if (errors.length === 0 && room) {
        const start = new Date(startTime)
        const end = new Date(endTime)
        const durationHours = calculateDurationHours(start, end)
        const cost = calculateTotalCost(room.price_per_hour, durationHours)
        setEstimatedCost(cost)
      } else {
        setEstimatedCost(null)
      }
    }
  }, [startTime, endTime, room])

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsBooking(true)

    const validationErrs = validateBookingTimes(startTime, endTime)
    if (validationErrs.length > 0) {
      setValidationErrors(validationErrs)
      setIsBooking(false)
      return
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Check for overlapping reservations
      const { data: overlapping, error: overlapError } = await supabase
        .from("reservations")
        .select("id")
        .eq("room_id", roomId)
        .eq("status", "confirmed")
        .lt("end_time", new Date(endTime).toISOString())
        .gt("start_time", new Date(startTime).toISOString())

      if (overlapError) throw overlapError

      if (overlapping && overlapping.length > 0) {
        setError("This time slot is already booked. Please choose another time.")
        setIsBooking(false)
        return
      }

      const { error: bookError } = await supabase.from("reservations").insert({
        room_id: roomId,
        user_id: user.id,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        status: "confirmed",
      })

      if (bookError) throw bookError
      router.push("/protected/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Booking failed")
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading room...</div>
  }

  if (!room) {
    return <div className="text-center py-12">Room not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button onClick={() => router.back()} variant="ghost" className="mb-6">
        ← Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{room.name}</CardTitle>
          <CardDescription>{room.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Capacity</p>
              <p className="text-lg font-semibold">{room.capacity} people</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Price per hour</p>
              <p className="text-lg font-semibold">${room.price_per_hour}</p>
            </div>
          </div>

          {room.amenities && room.amenities.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity: string) => (
                  <span key={amenity} className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleBook} className="space-y-4 border-t pt-6">
            <h3 className="font-semibold">Book this room</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="start">Start time</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end">End time</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>

              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-3">
                  {validationErrors.map((err, idx) => (
                    <p key={idx} className="text-sm text-red-700">
                      {err.message}
                    </p>
                  ))}
                </div>
              )}

              {estimatedCost !== null && validationErrors.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-sm text-gray-600">Estimated Cost</p>
                  <p className="text-lg font-semibold text-blue-700">${estimatedCost.toFixed(2)}</p>
                </div>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" disabled={isBooking || validationErrors.length > 0} className="w-full">
                {isBooking ? "Booking..." : "Complete Booking"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
