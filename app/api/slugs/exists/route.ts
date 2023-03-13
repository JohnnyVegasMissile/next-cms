// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_: NextRequest) {
    // const { userId } = context.params

    // const page = await prisma.page.findUnique({
    //     where: { id: userId as number },
    // })

    // NextResponse extends the Web Response API
    return NextResponse.json({})
}
