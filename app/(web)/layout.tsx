import styles from './layout.module.scss'
import { prisma } from '~/utilities/prisma'
import { SettingType } from '@prisma/client'
import classNames from 'classnames'
import localFont from '@next/font/local'

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

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const settings = await getSettings()

    const maintenance = settings.find((e) => e.type === SettingType.MAINTENANCE_MODE)?.value === 'true'
    const position = settings.find((e) => e.type === SettingType.SIDEBAR_POSITION)?.value
    const brSize = settings.find((e) => e.type === SettingType.SIDEBAR_BREAKPOINT_SIZE)?.value

    if (maintenance) return <p>Maintenance</p>

    return (
        <>
            <header>Header</header>
            <div
                className={classNames(styles['content-wrap'], styles[brSize!], myFont.className, {
                    [styles['left']!]: position === 'left',
                    [styles['right']!]: position === 'right',
                })}
            >
                {children}
            </div>
            <footer>Footer</footer>
        </>
    )
}

export default Layout
