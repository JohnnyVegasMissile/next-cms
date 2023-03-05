import { PageType } from '@prisma/client'
import QuickEditButton from '~/components/QuickEditButton'
import { prisma } from '~/utilities/prisma'

const getProps = async () => {
    return await prisma.page.findFirst({
        where: { type: PageType.SIGNIN },
    })
}

const SignIn = async () => {
    const page = await getProps()

    return (
        <>
            <QuickEditButton />
            <div>pagee: {page?.name}</div>
        </>
    )
}

export const revalidate = 'force-cache'
export default SignIn
