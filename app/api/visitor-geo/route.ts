import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const rawCity = request.headers.get("x-vercel-ip-city");
  const country = request.headers.get("x-vercel-ip-country");

  const city = rawCity ? decodeURIComponent(rawCity) : "";
  const location =
    city && country ? `${city}, ${country}` : country ? country : "Philippines";

  return NextResponse.json({ location });
}
