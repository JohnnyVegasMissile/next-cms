import styles from './layout.module.scss'
import { prisma } from '~/utilities/prisma'
import { SettingType } from '@prisma/client'
import classNames from 'classnames'

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
        where: { type: { in: [SettingType.MAINTENANCE_MODE, SettingType.SIDEBAR_POSITION] } },
    })
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const settings = await getSettings()

    const maintenance = settings.find((e) => e.type === SettingType.MAINTENANCE_MODE)?.value === 'true'
    const position = settings.find((e) => e.type === SettingType.SIDEBAR_POSITION)?.value

    if (maintenance) return <p>Maintenance</p>

    return (
        <>
            {/* <div style={{ height: 50, backgroundColor: 'orange' }}></div>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '25% 1fr',
                    gridTemplateRows: undefined,
                    gridColumnGap: 0,
                    gridRowGap: 0,
                }}
            >
                <div
                    style={{
                        height: 100,
                        backgroundColor: 'orange',
                        gridColumn: 1,
                        border: 'solid 1px #000',
                    }}
                ></div>
                <div
                    style={{ height: 50, backgroundColor: 'orange', gridColumn: 2, border: 'solid 1px #000' }}
                ></div>

                <div
                    style={{ height: 50, backgroundColor: 'blue', gridColumn: 1, border: 'solid 1px #000' }}
                ></div>
                <div
                    style={{ height: 90, backgroundColor: 'blue', gridColumn: 2, border: 'solid 1px #000' }}
                ></div>

                <div
                    style={{ height: 50, backgroundColor: 'green', gridColumn: 1, border: 'solid 1px #000' }}
                ></div>
                <div
                    style={{ height: 60, backgroundColor: 'green', gridColumn: 2, border: 'solid 1px #000' }}
                ></div>

                <div
                    style={{ height: 50, backgroundColor: 'blue', gridColumn: 2, border: 'solid 1px #000' }}
                ></div>

                <div
                    style={{ height: 50, backgroundColor: 'orange', gridColumn: 1, border: 'solid 1px #000' }}
                ></div>
                <div
                    style={{ height: 75, backgroundColor: 'orange', gridColumn: 2, border: 'solid 1px #000' }}
                ></div>
            </div>
            <div style={{ height: 50, backgroundColor: 'orange' }}></div> */}

            <header>Header</header>
            <div
                className={classNames(styles['content-wrap'], {
                    [styles['left']!]: position === 'left',
                    [styles['right']!]: position === 'right',
                })}
            >
                <aside className={styles['aside']}></aside>
                <div className={styles['content']}>{children}</div>
            </div>
            <footer>Footer</footer>
        </>
    )
}

export default Layout
