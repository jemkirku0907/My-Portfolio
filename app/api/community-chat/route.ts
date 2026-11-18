import { NextRequest, NextResponse } from "next/server";

const DAY_MS = 24 * 60 * 60 * 1000;

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/+$/, ""), key };
}

export async function GET() {
  const cfg = getSupabaseConfig();
  if (!cfg) {
    return NextResponse.json({ messages: [], persisted: false });
  }

  try {
    const sinceIso = encodeURIComponent(new Date(Date.now() - DAY_MS).toISOString());
    const endpoint = `${cfg.url}/rest/v1/community_messages?select=id,sender,body,created_at&created_at=gte.${sinceIso}&order=created_at.asc&limit=80`;
    const res = await fetch(endpoint, {
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`
      },
      cache: "no-store"
    });

    if (!res.ok) {
      return NextResponse.json({ messages: [], persisted: false });
    }

    const data = await res.json();
    const messages = Array.isArray(data)
      ? data.map((row) => ({
          id: String(row.id),
          sender: String(row.sender ?? "Visitor"),
          body: String(row.body ?? ""),
          createdAt: String(row.created_at ?? new Date().toISOString())
        }))
      : [];

    return NextResponse.json({ messages, persisted: true });
  } catch {
    return NextResponse.json({ messages: [], persisted: false });
  }
}

export async function POST(request: NextRequest) {
  const cfg = getSupabaseConfig();
  if (!cfg) {
    return NextResponse.json({ ok: false });
  }

  try {
    const payload = await request.json();
    const id = typeof payload?.id === "string" ? payload.id.slice(0, 64) : "";
    const sender = typeof payload?.sender === "string" ? payload.sender.trim().slice(0, 24) : "";
    const body = typeof payload?.body === "string" ? payload.body.trim().slice(0, 280) : "";

    if (!id || !sender || !body) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const res = await fetch(`${cfg.url}/rest/v1/community_messages`, {
      method: "POST",
      headers: {
        apikey: cfg.key,
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({ id, sender, body })
    });

    return NextResponse.json({ ok: res.ok });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
