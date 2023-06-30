import { ReactNode, Suspense } from 'react'
import classNames from 'classnames'
import localFont from 'next/font/local'
import { PageType, SectionType, SettingType } from '@prisma/client'

import styles from './layout.module.scss'
import { prisma } from '~/utilities/prisma'
import DisplaySection from '~/components/DisplaySection'
import getSection from '~/utilities/getSection'

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
            default: appName?.value || '',
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
    const layoutHeader = await getSection({ type: SectionType.LAYOUT_HEADER })
    const layoutFooter = await getSection({ type: SectionType.LAYOUT_FOOTER })
    const layoutSidebarHeader = await getSection({ type: SectionType.LAYOUT_SIDEBAR_TOP })
    const layoutSidebarFooter = await getSection({ type: SectionType.LAYOUT_SIDEBAR_BOTTOM })
    const layoutContentHeader = await getSection({ type: SectionType.LAYOUT_CONTENT_TOP })
    const layoutContentFooter = await getSection({ type: SectionType.LAYOUT_CONTENT_BOTTOM })
    const maintenanceSections = await getSection({ page: { type: PageType.MAINTENANCE } })

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
                    <Suspense key={section.id}>
                        <DisplaySection section={section} />
                    </Suspense>
                ))}
            </>
        )

    return (
        <>
            <header>
                {layoutHeader.map((section) => (
                    <Suspense key={section.id}>
                        <DisplaySection section={section} />
                    </Suspense>
                ))}
            </header>

            <div
                className={classNames(styles['content-wrap'], styles[brSize!], myFont.className, {
                    [styles['left']!]: position === 'left',
                    [styles['right']!]: position === 'right',
                })}
            >
                <div className={classNames(styles['aside'], styles[brSize!])}>
                    {layoutSidebarHeader.map((section) => (
                        <Suspense key={section.id}>
                            <DisplaySection section={section} />
                        </Suspense>
                    ))}
                    {sidebar}
                    {layoutSidebarFooter.map((section) => (
                        <Suspense key={section.id}>
                            <DisplaySection section={section} />
                        </Suspense>
                    ))}
                </div>
                <main className={styles['content']}>
                    {layoutContentHeader.map((section) => (
                        <Suspense key={section.id}>
                            <DisplaySection section={section} />
                        </Suspense>
                    ))}
                    {children}
                    {layoutContentFooter.map((section) => (
                        <Suspense key={section.id}>
                            <DisplaySection section={section} />
                        </Suspense>
                    ))}
                </main>
            </div>

            <footer>
                {layoutFooter.map((section) => (
                    <Suspense key={section.id}>
                        <DisplaySection section={section} />
                    </Suspense>
                ))}
            </footer>
        </>
    )
}

export default Layout
