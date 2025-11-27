import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

type RequestBody = {
  email?: string
  secret?: string
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json().catch(() => ({}))
    const { email, secret } = body

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 })
    }

    if (!email) {
      return NextResponse.json({ error: "Missing 'email' in request body" }, { status: 400 })
    }

    // Simple authorization: require a shared secret header/body value
    const expected = process.env.ADMIN_PROMOTION_SECRET
    if (!expected || secret !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Find profile by email
    const { data: profile, error: selectError } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("email", email)
      .single()

    if (selectError) {
      return NextResponse.json({ error: selectError.message }, { status: 500 })
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Update role to admin
    const { error: updateError } = await supabase.from("profiles").update({ role: "admin" }).eq("id", profile.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message: `Promoted ${email} to admin` })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
