import AdminMenu from '~/components/AdminMenu'
import styles from './layout.module.scss'
import { prisma } from '~/utilities/prisma'
import './global.scss'
import { SettingType } from '@prisma/client'
import QueryClientWrapper from '~/components/QueryClientWrapper'
import getSidebar from '~/utilities/getSidebar'

// const getLang = async () => {
//     const locales = await prisma.setting.findUnique({
//         where: {
//             type: SettingType.LANGUAGE_LOCALES,
//         },
//     })

//     if (!locales) return

//     const accept = locales.value
//         .split(', ')
//         .map((e) => e.toLocaleLowerCase())
//         .join(';')

// const headersList = headers()
// headersList.set('Accept-Language', 'en-US,en;q=0.5')
// headersList.set('Accept-Language', accept)
// }

const getTheme = async () => {
    return await prisma.setting.findMany({
        where: {
            type: {
                in: [
                    SettingType.BACKGROUND_COLOR,
                    SettingType.PRIMARY_COLOR,
                    SettingType.SECONDARY_COLOR,
                    SettingType.PRIMARY_TEXT_COLOR,
                    SettingType.SECONDARY_TEXT_COLOR,
                    SettingType.DARK_COLOR,
                    SettingType.LIGHT_COLOR,
                    SettingType.EXTRA_COLOR,
                ],
            },
        },
    })
}

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const themeSettings = await getTheme()
    const sidebar = await getSidebar()

    const backgroundColor =
        themeSettings.find((e) => e.type === SettingType.BACKGROUND_COLOR)?.value || '#e9ecef'
    const primaryColor = themeSettings.find((e) => e.type === SettingType.PRIMARY_COLOR)?.value || '#ffc300'
    const secondaryColor =
        themeSettings.find((e) => e.type === SettingType.SECONDARY_COLOR)?.value || '#003566'
    const primaryTextColor =
        themeSettings.find((e) => e.type === SettingType.PRIMARY_TEXT_COLOR)?.value || '#000814'
    const secondaryTextColor =
        themeSettings.find((e) => e.type === SettingType.SECONDARY_TEXT_COLOR)?.value || '#001d3d'
    const darkColor = themeSettings.find((e) => e.type === SettingType.DARK_COLOR)?.value || '#000814'
    const lightColor = themeSettings.find((e) => e.type === SettingType.LIGHT_COLOR)?.value || '#e9ecef'
    const extraColor = themeSettings.find((e) => e.type === SettingType.EXTRA_COLOR)?.value || '#ef476f'

    return (
        <html>
            {/* eslint-disable-next-line @next/next/no-head-element */}
            <head>
                <link rel="icon" href="/storage/favicon.ico" sizes="any" />

                <style
                    dangerouslySetInnerHTML={{
                        __html: `
:root {
    --background-color: ${backgroundColor};
    --primary-color: ${primaryColor};
    --secondary-color: ${secondaryColor};

    --primary-text-color: ${primaryTextColor};
    --secondary-text-color: ${secondaryTextColor};
    --dark-color: ${darkColor};
    --light-color: ${lightColor};
    --extra-color: ${extraColor};

    --sidebar-display: ${sidebar.isActive ? 'block' : 'none'};
    --sidebar-width: ${sidebar.width};

    --sidebar-background-color: ${sidebar.backgroundColor};
}
                    `,
                    }}
                />
            </head>
            <QueryClientWrapper>
                <body className={styles['body']}>
                    <AdminMenu />
                    {children}
                </body>
            </QueryClientWrapper>
        </html>
    )
}

export const revalidate = 'force-cache'

export default Layout
