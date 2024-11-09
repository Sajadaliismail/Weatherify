import { NextResponse } from "next/server";

const WEATHERAPI = process.env.NEXT_PUBLIC_WEATHERMAP;
export async function GET(request: Request) {
  const url = new URL(request.url);
  const keyword = url.searchParams.get("keyword");
  if (!keyword) throw new Error("No entry");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${keyword}&limit=5&appid=${WEATHERAPI}`
    );
    if (!response.ok) throw new Error("Error fetching details");

    const searchResults = await response.json();
    return NextResponse.json(searchResults, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(error.message, { status: 404 });
    }
    return NextResponse.json("Error fetching details", { status: 404 });
  }
}
