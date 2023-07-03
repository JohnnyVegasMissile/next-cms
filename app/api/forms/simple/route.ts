// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '~/utilities/prisma'

export const GET = async (request: NextRequest) => {
    const { searchParams } = request.nextUrl
    const q = searchParams.get('q')
    const showFull = searchParams.get('showFull')

    const where: any = { discontinued: false }
    if (!!q) where.name = { contains: q }

    let select: any = { id: true, name: true }
    if (!!showFull)
        select = {
            id: true,
            name: true,

            successMessage: true,
            errorMessage: true,
            extraData: true,

            fields: {
                select: {
                    id: true,
                    type: true,
                    label: true,
                    placeholder: true,

                    container: {
                        select: {
                            id: true,
                            name: true,
                            contents: { select: { id: true, name: true } },
                        },
                    },

                    position: true,
                    line: true,

                    options: true,
                    buttonType: true,

                    min: true,
                    max: true,

                    defaultText: true,
                    defaultNumber: true,
                    defaultMultiple: true,

                    required: true,
                },
                orderBy: [{ position: 'asc' }, { line: 'asc' }],
            },
        }

    const forms = await prisma.form.findMany({
        where,
        take: 15,
        select,
        orderBy: { name: 'asc' },
    })

    return NextResponse.json(forms)
}
