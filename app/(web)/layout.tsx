import { ReactNode } from 'react'
import classNames from 'classnames'
import localFont from 'next/font/local'
import { PageType, SectionType, SettingType } from '@prisma/client'

import styles from './layout.module.scss'
import { prisma } from '~/utilities/prisma'
import DisplaySection from '~/components/DisplaySection'
import Link from 'next/link'

const myFont = localFont({ src: '../../public/Garute-VF.ttf', variable: '--my-font' })

const getAppname = async () => {
    return await prisma.setting.findUnique({
        where: { type: SettingType.APP_NAME },
    })
}

export async function generateMetadata() {
    const appName = await getAppname()

    return {
        title: {
            default: appName?.value,
            template: `%s | ${appName?.value}`,
        },
    }
}

const getSettings = async () => {
    return await prisma.setting.findMany({
        where: {
            type: {
                in: [
                    SettingType.MAINTENANCE_MODE,
                    SettingType.SIDEBAR_POSITION,
                    SettingType.SIDEBAR_BREAKPOINT_SIZE,
                ],
            },
        },
    })
}

const getSections = async () => {
    const layoutHeader = await prisma.section.findMany({
        where: { type: SectionType.LAYOUT_HEADER },
        orderBy: { position: 'asc' },
    })

    const layoutFooter = await prisma.section.findMany({
        where: { type: SectionType.LAYOUT_FOOTER },
        orderBy: { position: 'asc' },
    })

    const layoutSidebarHeader = await prisma.section.findMany({
        where: { type: SectionType.LAYOUT_SIDEBAR_TOP },
        orderBy: { position: 'asc' },
    })

    const layoutSidebarFooter = await prisma.section.findMany({
        where: { type: SectionType.LAYOUT_SIDEBAR_BOTTOM },
        orderBy: { position: 'asc' },
    })

    const layoutContentHeader = await prisma.section.findMany({
        where: { type: SectionType.LAYOUT_CONTENT_TOP },
        orderBy: { position: 'asc' },
    })

    const layoutContentFooter = await prisma.section.findMany({
        where: { type: SectionType.LAYOUT_CONTENT_BOTTOM },
        orderBy: { position: 'asc' },
    })

    const maintenanceSections = await prisma.section.findMany({
        where: { page: { type: PageType.MAINTENANCE } },
        orderBy: { position: 'asc' },
    })

    return {
        layoutHeader,
        layoutFooter,
        layoutContentHeader,
        layoutContentFooter,
        layoutSidebarHeader,
        layoutSidebarFooter,
        maintenanceSections,
    }
}

const Layout = async ({
    children,
    sidebar,
}: {
    children: ReactNode
    content: ReactNode
    sidebar: ReactNode
}) => {
    const settings = await getSettings()
    const {
        layoutHeader,
        layoutFooter,
        layoutContentHeader,
        layoutContentFooter,
        layoutSidebarHeader,
        layoutSidebarFooter,
        maintenanceSections,
    } = await getSections()

    const maintenance = settings.find((e) => e.type === SettingType.MAINTENANCE_MODE)?.value === 'true'

    const position = settings.find((e) => e.type === SettingType.SIDEBAR_POSITION)?.value
    const brSize = settings.find((e) => e.type === SettingType.SIDEBAR_BREAKPOINT_SIZE)?.value

    if (maintenance)
        return (
            <>
                {maintenanceSections.map((section) => (
                    <DisplaySection key={section.id} section={section} />
                ))}
            </>
        )

    return (
        <>
            <header>
                <Link href="/">Home</Link>
                <Link href="/my-test-2">Test</Link>
                <Link href="/my-test-3">Not found</Link>
                {layoutHeader.map((section) => (
                    <DisplaySection key={section.id} section={section} />
                ))}
            </header>

            <div
                className={classNames(styles['content-wrap'], styles[brSize!], myFont.className, {
                    [styles['left']!]: position === 'left',
                    [styles['right']!]: position === 'right',
                })}
            >
                <aside className={classNames(styles['aside'], styles[brSize!])}>
                    {layoutSidebarHeader.map((section) => (
                        <DisplaySection key={section.id} section={section} />
                    ))}
                    {sidebar}
                    {layoutSidebarFooter.map((section) => (
                        <DisplaySection key={section.id} section={section} />
                    ))}
                </aside>
                <main className={styles['content']}>
                    {layoutContentHeader.map((section) => (
                        <DisplaySection key={section.id} section={section} />
                    ))}
                    {children}
                    {layoutContentFooter.map((section) => (
                        <DisplaySection key={section.id} section={section} />
                    ))}
                </main>
            </div>

            <footer>
                {layoutFooter.map((section) => (
                    <DisplaySection key={section.id} section={section} />
                ))}
            </footer>
        </>
    )
}

export default Layout
