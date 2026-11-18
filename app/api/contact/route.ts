import { NextRequest, NextResponse } from "next/server";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/+$/, ""), key };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : "";
    const email = typeof body?.email === "string" ? body.email.trim().slice(0, 120) : "";
    const inquiryType = typeof body?.inquiryType === "string" ? body.inquiryType.trim().slice(0, 60) : "Project Inquiry";
    const message = typeof body?.message === "string" ? body.message.trim().slice(0, 1500) : "";

    if (!name || !email || !message) {
      return NextResponse.json({ ok: false, error: "Please fill out name, email, and message." }, { status: 400 });
    }

    let saved = false;
    const cfg = getSupabaseConfig();

    if (cfg) {
      try {
        const res = await fetch(`${cfg.url}/rest/v1/contact_inquiries`, {
          method: "POST",
          headers: {
            apikey: cfg.key,
            Authorization: `Bearer ${cfg.key}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal"
          },
          body: JSON.stringify({ name, email, inquiry_type: inquiryType, message })
        });
        saved = res.ok;
      } catch {
        saved = false;
      }
    }

    return NextResponse.json({ ok: true, saved });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
