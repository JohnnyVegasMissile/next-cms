import { SectionType } from '@prisma/client'
import styles from './Sidebar.module.scss'
import { prisma } from '~/utilities/prisma'
import { blocksViews } from '~/blocks/views'
import { BlockKey } from '~/blocks'

interface ContentProps {
    id: number
    type: 'page' | 'container' | 'content'
}

const getProps = async (id: number, type: 'page' | 'container' | 'content') => {
    const topLayout = await prisma.section.findMany({
        where: { pageId: id, type: SectionType.LAYOUT_SIDEBAR_TOP },
        orderBy: { position: 'asc' },
    })

    const bottomLayout = await prisma.section.findMany({
        where: { pageId: id, type: SectionType.LAYOUT_SIDEBAR_BOTTOM },
        orderBy: { position: 'asc' },
    })

    switch (type) {
        case 'page': {
            const content = await prisma.section.findMany({
                where: { pageId: id, type: SectionType.PAGE_SIDEBAR },
                orderBy: { position: 'asc' },
            })

            return { topLayout, content, bottomLayout }
        }

        case 'container': {
            return { topLayout, bottomLayout }
        }

        case 'content': {
            return { topLayout, bottomLayout }
        }
    }
}

const Content = async ({ id, type }: ContentProps) => {
    const { topLayout, content, bottomLayout } = await getProps(id, type)

    return (
        <aside className={styles['aside']}>
            {topLayout.map((section) => {
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
            {content?.map((section) => {
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
            {bottomLayout.map((section) => {
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
        </aside>
    )
}

export default Content
