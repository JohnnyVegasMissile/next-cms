import { PageType, SectionType } from '@prisma/client'
import { BlockKey } from '~/blocks'
import { blocksViews } from '~/blocks/views'
import QuickEditButton from '~/components/QuickEditButton'
import { prisma } from '~/utilities/prisma'
import styles from './page.module.scss'
import Sidebar from '~/components/Sidebar'
import { Suspense } from 'react'

const getProps = async () => {
    const page = await prisma.page.findFirst({
        where: { type: PageType.HOMEPAGE },
    })

    const content = await prisma.section.findMany({
        where: { pageId: page?.id, type: SectionType.PAGE },
        orderBy: { position: 'asc' },
    })

    return { page, content }
}

const Home = async () => {
    const { page, content } = await getProps()

    return (
        <>
            <QuickEditButton />
            <Suspense>
                {/* @ts-expect-error Server Component */}
                <Sidebar id={page!.id} type="page" />
            </Suspense>
            <main className={styles['content']}>
                {content.map((section) => {
                    const View = blocksViews[section.block as BlockKey]

                    if (!View) return null

                    return (
                        <View
                            key={section.id}
                            content={section.content}
                            images={[]}
                            files={[]}
                            videos={[]}
                            forms={[]}
                        />
                    )
                })}
            </main>
        </>
    )
}

// export const revalidate = 'force-cache'
export default Home
