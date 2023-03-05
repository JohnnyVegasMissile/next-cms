import { NextResponse } from "next/server";

export async function GET(request: Request) {
  //   const res = await fetch("https://data.mongodb-api.com/...", {
  //     headers: {
  //       "Content-Type": "application/json",
  //       "API-Key": process.env.DATA_API_KEY,
  //     },
  //   });
  //   const data = await res.json();

  // NextResponse extends the Web Response API
  return NextResponse.json({ res: "ok" });
}

export async function POST(request: Request) {}
