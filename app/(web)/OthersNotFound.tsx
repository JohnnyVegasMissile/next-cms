import { Suspense } from 'react'
import { CodeLanguage, PageType, SettingType, SectionType } from '@prisma/client'
import DefaultSection from '~/components/DefaultSection'
import DisplaySection from '~/components/DisplaySection'
import getSection from '~/utilities/getSection'
import { prisma } from '~/utilities/prisma'

const getProps = async (lang?: CodeLanguage) => {
    let language = lang

    if (!language) {
        const preferred = await prisma.setting.findFirst({
            where: { type: SettingType.LANGUAGE_PREFERRED },
        })

        language = preferred?.value as CodeLanguage
    }

    const sections = await getSection({
        page: { type: PageType.NOTFOUND },
        type: SectionType.PAGE,
        language,
    })

    return { sections, language }
}

const OthersNotFound = async ({ lang }: { lang?: CodeLanguage }) => {
    const { sections, language } = await getProps(lang)

    if (!sections.length) return <DefaultSection.NotFound lang={language} />

    return (
        <>
            {sections.map((section) => (
                <Suspense key={section.id}>
                    <DisplaySection section={section} />
                </Suspense>
            ))}
        </>
    )
}

export default OthersNotFound
