import { ReactNode } from 'react'
import { SectionType, SettingType } from '@prisma/client'
import styles from './Sidebar.module.scss'
import { prisma } from '~/utilities/prisma'
import { blocksViews } from '~/blocks/views'
import { BlockKey } from '~/blocks'
import { ObjectId } from '~/types'
import classNames from 'classnames'

interface SidebarProps {
    id: ObjectId
    type: 'page' | 'container' | 'content'
    fallback?: ReactNode
}

const getProps = async (id: ObjectId, type: 'page' | 'container' | 'content') => {
    const topLayout = await prisma.section.findMany({
        where: { type: SectionType.LAYOUT_SIDEBAR_TOP },
        orderBy: { position: 'asc' },
    })

    const bottomLayout = await prisma.section.findMany({
        where: { type: SectionType.LAYOUT_SIDEBAR_BOTTOM },
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

const getBP = async () =>
    await prisma.setting.findUnique({
        where: {
            type: SettingType.SIDEBAR_BREAKPOINT_SIZE,
        },
    })

const Sidebar = async ({ id, type, fallback }: SidebarProps) => {
    const { topLayout, content, bottomLayout } = await getProps(id, type)
    const breakPoint = await getBP()

    return (
        <aside className={classNames(styles['aside'], styles[breakPoint?.value!])}>
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
            {!content?.length && fallback}
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

export default Sidebar
