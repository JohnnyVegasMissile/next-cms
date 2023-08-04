import { SettingType } from '@prisma/client'
import { ReactNode } from 'react'
import WebVitals from '~/components/WebVitals'
import { prisma } from '~/utilities/prisma'

export const generateMetadata = async () => {
    const appName = await prisma.setting.findUnique({
        where: { type: SettingType.APP_NAME },
    })

    return {
        title: {
            template: `%s | ${appName?.value}`,
            default: appName?.value,
        },
    }
}

const Layout = ({ children }: { children: ReactNode }) => (
    <>
        <WebVitals />
        {children}
    </>
)

export default Layout
