import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");

  const apiKey = process.env.NEXT_PUBLIC_WEATHERMAP;
  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const weatherResponse = await fetch(url);

    const weatherData = await weatherResponse.json();

    if (weatherResponse.ok) {
      return NextResponse.json(weatherData, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching data", error },
      { status: 404 }
    );
  }
}
