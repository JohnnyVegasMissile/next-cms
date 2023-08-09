import { ReactNode } from 'react'
import Script from 'next/script'
import { SettingType } from '@prisma/client'

import { prisma } from '~/utilities/prisma'
import WebVitals from '~/components/WebVitals'
import { SettingScriptsValue } from '~/types/settingsCreation'

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

// SCRIPTS

const getScripts = async () => {
    const settingValue = await prisma.setting.findUnique({
        where: { type: SettingType.SCRIPTS },
    })

    const stringValue = JSON.parse(settingValue?.value || '[]')

    return stringValue as SettingScriptsValue
}

const Layout = async ({ children }: { children: ReactNode }) => {
    const scripts = await getScripts()

    return (
        <>
            {scripts.map((script, index) => (
                <Script
                    key={index}
                    id={`${index}`}
                    strategy={script.strategy}
                    src={script.type === 'link' ? script.value : undefined}
                    dangerouslySetInnerHTML={script.type === 'script' ? { __html: script.value } : undefined}
                />
            ))}
            <WebVitals />
            {children}
        </>
    )
}

export default Layout
