"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase.from("rooms").select("*")
      if (error) {
        console.error("Error fetching rooms:", error)
      } else {
        setRooms(data || [])
      }
      setIsLoading(false)
    }

    fetchRooms()
  }, [supabase])

  if (isLoading) {
    return <div className="text-center py-12">Loading rooms...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Available Rooms</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
              <CardDescription>{room.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="text-lg font-semibold">{room.capacity} people</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price per hour</p>
                  <p className="text-lg font-semibold">${room.price_per_hour}</p>
                </div>
                {room.amenities && room.amenities.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.map((amenity: string) => (
                        <span key={amenity} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <Link href={`/protected/rooms/${room.id}`}>
                  <Button className="w-full">Book Room</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
