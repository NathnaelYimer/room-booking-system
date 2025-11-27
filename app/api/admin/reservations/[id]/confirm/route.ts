import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // verify caller is admin
    const { data: profile, error: profileErr } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    if (profileErr || !profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const reservationId = params.id

    const { data: resRow, error: resErr } = await supabase
      .from("reservations")
      .select("room_id, start_time, end_time, status")
      .eq("id", reservationId)
      .single()

    if (resErr || !resRow) return NextResponse.json({ error: resErr?.message || "Not found" }, { status: 404 })

    if (resRow.status === "confirmed") {
      return NextResponse.json({ ok: true, message: "Already confirmed" })
    }

    const newStart = new Date(resRow.start_time).toISOString()
    const newEnd = new Date(resRow.end_time).toISOString()

    // check for overlapping confirmed reservations for the same room
    const { data: overlapping, error: ovErr } = await supabase
      .from("reservations")
      .select("id")
      .eq("room_id", resRow.room_id)
      .eq("status", "confirmed")
      .lt("start_time", newEnd)
      .gt("end_time", newStart)

    if (ovErr) return NextResponse.json({ error: ovErr.message }, { status: 500 })
    if (overlapping && overlapping.length > 0) {
      return NextResponse.json({ error: "Conflict with an existing confirmed booking" }, { status: 409 })
    }

    const { error: upErr } = await supabase.from("reservations").update({ status: "confirmed" }).eq("id", reservationId)
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
