import { NextResponse } from 'next/server'
import revalidateAllSlugs from '~/utilities/revalidateAllSlugs'

export const POST = async () => {
    await revalidateAllSlugs()

    return NextResponse.json({ revalidated: true })
}
