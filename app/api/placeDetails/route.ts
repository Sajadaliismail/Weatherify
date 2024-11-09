import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  const api = process.env.NEXT_PUBLIC_WEATHERMAP;
  try {
    const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${api}`;
    const response = await fetch(url);

    const placeData = await response.json();

    if (!response.ok) throw new Error("Error fetching place data");
    return NextResponse.json(placeData, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(error.message, { status: 404 });
    }
    return NextResponse.json("Error fetching place data", { status: 404 });
  }
}
