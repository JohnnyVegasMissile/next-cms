import { SectionType } from '@prisma/client'
import styles from './Content.module.scss'
import { prisma } from '~/utilities/prisma'
import { blocksViews } from '~/blocks/views'
import { BlockKey } from '~/blocks'
import { ObjectId } from '~/types'

interface ContentProps {
    id: ObjectId
    type: 'page' | 'container' | 'content'
}

const getProps = async (id: ObjectId, type: 'page' | 'container' | 'content') => {
    const topLayout = await prisma.section.findMany({
        where: { type: SectionType.LAYOUT_CONTENT_TOP },
        orderBy: { position: 'asc' },
    })

    const bottomLayout = await prisma.section.findMany({
        where: { type: SectionType.LAYOUT_CONTENT_BOTTOM },
        orderBy: { position: 'asc' },
    })

    switch (type) {
        case 'page': {
            const content = await prisma.section.findMany({
                where: { pageId: id, type: SectionType.PAGE },
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
        <main className={styles['content']}>
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
        </main>
    )
}

export default Content
