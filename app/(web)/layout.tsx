import { ReactNode } from 'react'
import { notFound, redirect } from 'next/navigation'
import { RedirectType } from 'next/dist/client/components/redirect'
import { prisma } from '~/utilities/prisma'
import { CodeLanguage, SettingType } from '@prisma/client'

const getLayoutProps = async () => {
    const locales = await prisma.setting.findUnique({
        where: { type: SettingType.LANGUAGE_LOCALES },
    })

    const preferred = await prisma.setting.findUnique({
        where: { type: SettingType.LANGUAGE_PREFERRED },
    })

    return {
        locales: {
            list: locales?.value.split(', ') as CodeLanguage[],
            preferred: preferred?.value as CodeLanguage,
        },
    }
}

const Layout = async ({ content, lang }: { content: ReactNode; lang: CodeLanguage }) => {
    const { locales } = await getLayoutProps()

    if (!locales.list.includes(lang)) {
        notFound()
    } else if (locales.preferred === lang) {
        redirect('/', RedirectType.replace)
    }

    return (
        <>
            <p>Layout - En</p>
            {content}
        </>
    )
}

export default Layout
