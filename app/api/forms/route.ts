// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server'

export async function GET(_: Request) {
    //   const res = await fetch("https://data.mongodb-api.com/...", {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "API-Key": process.env.DATA_API_KEY,
    //     },
    //   });
    //   const data = await res.json();

    // NextResponse extends the Web Response API
    return NextResponse.json({ res: 'ok' })
}

export async function POST(_: Request) {}
