import { PageType } from '@prisma/client'
import QuickEditButton from '~/components/QuickEditButton'
import { prisma } from '~/utilities/prisma'

const getProps = async () => {
    return await prisma.page.findFirst({
        where: { type: PageType.HOMEPAGE },
    })
}

const Home = async () => {
    const page = await getProps()

    return (
        <>
            <QuickEditButton />
            <div>pageh: {page?.name}</div>
        </>
    )
}

const Sidebar = async () => {
    const page = await getProps()

    return <div>Sidebar: {page?.name}</div>
}

Home.sidebar = Sidebar

export const revalidate = 'force-cache'
export default Home
