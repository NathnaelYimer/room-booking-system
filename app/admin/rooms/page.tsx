"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function ManageRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    price_per_hour: "",
    amenities: "",
  })
  const supabase = createClient()

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    const { data, error } = await supabase.from("rooms").select("*")
    if (!error) {
      setRooms(data || [])
    }
    setIsLoading(false)
  }

  const handleOpenDialog = (room: any = null) => {
    if (room) {
      setEditingRoom(room)
      setFormData({
        name: room.name,
        description: room.description,
        capacity: room.capacity,
        price_per_hour: room.price_per_hour,
        amenities: room.amenities?.join(", ") || "",
      })
    } else {
      setEditingRoom(null)
      setFormData({
        name: "",
        description: "",
        capacity: "",
        price_per_hour: "",
        amenities: "",
      })
    }
    setIsOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    const amenitiesArray = formData.amenities
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a)

    try {
      if (editingRoom) {
        const { error } = await supabase
          .from("rooms")
          .update({
            name: formData.name,
            description: formData.description,
            capacity: Number.parseInt(formData.capacity),
            price_per_hour: Number.parseFloat(formData.price_per_hour),
            amenities: amenitiesArray,
          })
          .eq("id", editingRoom.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("rooms").insert({
          name: formData.name,
          description: formData.description,
          capacity: Number.parseInt(formData.capacity),
          price_per_hour: Number.parseFloat(formData.price_per_hour),
          amenities: amenitiesArray,
        })

        if (error) throw error
      }

      setIsOpen(false)
      fetchRooms()
    } catch (error) {
      console.error("Error saving room:", error)
    }
  }

  const handleDelete = async (roomId: string) => {
    if (confirm("Are you sure you want to delete this room?")) {
      const { error } = await supabase.from("rooms").delete().eq("id", roomId)
      if (!error) {
        fetchRooms()
      }
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading rooms...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Rooms</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>Add New Room</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity (people)</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price per Hour ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price_per_hour}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price_per_hour: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="WiFi, Projector, Whiteboard"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingRoom ? "Update Room" : "Create Room"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{room.name}</CardTitle>
                  <p className="text-sm text-gray-600">{room.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="font-semibold">{room.capacity} people</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price/Hour</p>
                  <p className="font-semibold">${room.price_per_hour}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amenities</p>
                  <p className="font-semibold">{room.amenities?.length || 0} items</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleOpenDialog(room)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(room.id)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
