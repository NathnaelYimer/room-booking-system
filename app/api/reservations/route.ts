import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
      .order("start_time", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { room_id, start_time, end_time, notes } = body

    // Check for overlapping reservations
    const { data: overlapping, error: overlapError } = await supabase
      .from("reservations")
      .select("id")
      .eq("room_id", room_id)
      .eq("status", "confirmed")
      .lt("end_time", new Date(end_time).toISOString())
      .gt("start_time", new Date(start_time).toISOString())

    if (overlapError) {
      return NextResponse.json({ error: overlapError.message }, { status: 500 })
    }

    if (overlapping && overlapping.length > 0) {
      return NextResponse.json({ error: "Time slot is already booked" }, { status: 409 })
    }

    const { data, error } = await supabase
      .from("reservations")
      .insert({
        room_id,
        user_id: user.id,
        start_time: new Date(start_time).toISOString(),
        end_time: new Date(end_time).toISOString(),
        status: "confirmed",
        notes,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
