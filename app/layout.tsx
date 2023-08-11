import { CodeLanguage, SettingType } from '@prisma/client'
import QueryClientWrapper from '~/components/QueryClientWrapper'
import defaultColor from '~/utilities/defaultColors.json'
import getSidebar from '~/utilities/getSidebar'
import AdminMenu from '~/components/AdminMenu'
import { prisma } from '~/utilities/prisma'
import styles from './layout.module.scss'
import './global.scss'
import languages from '~/utilities/languages'

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

const getPreferred = async () => {
    const preferred = await prisma.setting.findUnique({
        where: { type: SettingType.LANGUAGE_PREFERRED },
    })

    return preferred?.value as CodeLanguage
}

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
    const preferred = await getPreferred()

    const backgroundColor =
        themeSettings.find((e) => e.type === SettingType.BACKGROUND_COLOR)?.value ||
        defaultColor.backgroundColor
    const primaryColor =
        themeSettings.find((e) => e.type === SettingType.PRIMARY_COLOR)?.value || defaultColor.primaryColor
    const secondaryColor =
        themeSettings.find((e) => e.type === SettingType.SECONDARY_COLOR)?.value ||
        defaultColor.secondaryColor
    const primaryTextColor =
        themeSettings.find((e) => e.type === SettingType.PRIMARY_TEXT_COLOR)?.value ||
        defaultColor.primaryTextColor
    const secondaryTextColor =
        themeSettings.find((e) => e.type === SettingType.SECONDARY_TEXT_COLOR)?.value ||
        defaultColor.secondaryTextColor
    const darkColor =
        themeSettings.find((e) => e.type === SettingType.DARK_COLOR)?.value || defaultColor.darkColor
    const lightColor =
        themeSettings.find((e) => e.type === SettingType.LIGHT_COLOR)?.value || defaultColor.lightColor
    const extraColor =
        themeSettings.find((e) => e.type === SettingType.EXTRA_COLOR)?.value || defaultColor.extraColor

    return (
        <html lang={languages[preferred].code}>
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

export const revalidate = Infinity

export default Layout
