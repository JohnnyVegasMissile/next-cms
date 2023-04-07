import styles from './layout.module.scss'
import { prisma } from '~/utilities/prisma'
import { SectionType, SettingType } from '@prisma/client'
import classNames from 'classnames'
import localFont from 'next/font/local'
import blocksViews from '~/blocks/views'
import { BlockKey } from '~/blocks'

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

const getHeaders = async () =>
    await prisma.section.findMany({
        where: { type: SectionType.LAYOUT_HEADER },
    })

const getFooters = async () =>
    await prisma.section.findMany({
        where: { type: SectionType.LAYOUT_FOOTER },
    })

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const settings = await getSettings()
    const headers = await getHeaders()
    const footers = await getFooters()

    const maintenance = settings.find((e) => e.type === SettingType.MAINTENANCE_MODE)?.value === 'true'
    const position = settings.find((e) => e.type === SettingType.SIDEBAR_POSITION)?.value
    const brSize = settings.find((e) => e.type === SettingType.SIDEBAR_BREAKPOINT_SIZE)?.value

    if (maintenance) return <p>Maintenance</p>

    return (
        <>
            <header>
                {headers.map((section) => {
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
            </header>
            <div
                className={classNames(styles['content-wrap'], styles[brSize!], myFont.className, {
                    [styles['left']!]: position === 'left',
                    [styles['right']!]: position === 'right',
                })}
            >
                {children}
            </div>
            <footer>
                {footers.map((section) => {
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
            </footer>
        </>
    )
}

export default Layout
