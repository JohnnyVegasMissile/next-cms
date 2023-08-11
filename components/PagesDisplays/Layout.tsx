import { CodeLanguage, PageType, SectionType, SettingType } from '@prisma/client'
import { notFound } from 'next/navigation'
import { ReactNode, Suspense } from 'react'
import DisplaySection from '~/components/DisplaySection'
import getSection, { SectionResponse } from '~/utilities/getSection'
import { prisma } from '~/utilities/prisma'
import styles from './layout.module.scss'
import localFont from 'next/font/local'
import classNames from 'classnames'

const myFont = localFont({ src: '../../public/Garute-VF.ttf', variable: '--my-font' })

const getProps = async (
    lang?: CodeLanguage
): Promise<
    | {
          langEnabled: false
          maintenance: false
          maintenanceSections?: undefined
          layoutHeader?: undefined
          layoutFooter?: undefined
          layoutContentHeader?: undefined
          layoutContentFooter?: undefined
          layoutSidebarHeader?: undefined
          layoutSidebarFooter?: undefined
          sidebar?: undefined
      }
    | {
          langEnabled: true
          maintenance: true
          maintenanceSections: SectionResponse[]
          layoutHeader?: undefined
          layoutFooter?: undefined
          layoutContentHeader?: undefined
          layoutContentFooter?: undefined
          layoutSidebarHeader?: undefined
          layoutSidebarFooter?: undefined
          sidebar?: undefined
      }
    | {
          langEnabled: true
          maintenance: false
          maintenanceSections?: undefined
          layoutHeader: SectionResponse[]
          layoutFooter: SectionResponse[]
          layoutContentHeader: SectionResponse[]
          layoutContentFooter: SectionResponse[]
          layoutSidebarHeader: SectionResponse[]
          layoutSidebarFooter: SectionResponse[]
          sidebar: { position: string; breakPoint: string; isActive: boolean }
      }
> => {
    const locales = await prisma.setting.findFirst({
        where: { type: SettingType.LANGUAGE_LOCALES },
    })

    if (!!lang && !locales?.value.split(', ').includes(lang)) {
        return { langEnabled: false, maintenance: false }
    }

    const maintenance = await prisma.setting.findUnique({
        where: { type: SettingType.MAINTENANCE_MODE },
    })

    if (maintenance?.value === 'true') {
        const maintenanceSections = await getSection({ page: { type: PageType.MAINTENANCE } })

        return { langEnabled: true, maintenance: true, maintenanceSections }
    }

    let language = lang as CodeLanguage

    if (!language) {
        const preferred = await prisma.setting.findFirst({
            where: { type: SettingType.LANGUAGE_PREFERRED },
        })

        language = preferred?.value as CodeLanguage
    }

    const layoutHeader = await getSection({ type: SectionType.LAYOUT_HEADER, language })
    const layoutFooter = await getSection({ type: SectionType.LAYOUT_FOOTER, language })
    const layoutSidebarHeader = await getSection({ type: SectionType.LAYOUT_SIDEBAR_TOP, language })
    const layoutSidebarFooter = await getSection({ type: SectionType.LAYOUT_SIDEBAR_BOTTOM, language })
    const layoutContentHeader = await getSection({ type: SectionType.LAYOUT_CONTENT_TOP, language })
    const layoutContentFooter = await getSection({ type: SectionType.LAYOUT_CONTENT_BOTTOM, language })

    const position = await prisma.setting.findUnique({
        where: { type: SettingType.SIDEBAR_POSITION },
    })

    const breakPoint = await prisma.setting.findUnique({
        where: { type: SettingType.SIDEBAR_BREAKPOINT_SIZE },
    })

    const isActive = await prisma.setting.findUnique({
        where: { type: SettingType.SIDEBAR_IS_ACTIVE },
    })

    return {
        langEnabled: true,
        maintenance: false,
        layoutHeader,
        layoutFooter,
        layoutContentHeader,
        layoutContentFooter,
        layoutSidebarHeader,
        layoutSidebarFooter,
        sidebar: {
            position: position?.value!,
            breakPoint: breakPoint?.value!,
            isActive: isActive?.value === 'true',
        },
    }
}

const OthersPageLayout = async ({
    content,
    sideContent,
    lang,
}: {
    content: ReactNode
    sideContent?: ReactNode
    lang?: CodeLanguage
}) => {
    const {
        langEnabled,
        maintenance,
        maintenanceSections,
        sidebar,
        layoutHeader,
        layoutFooter,
        layoutContentHeader,
        layoutContentFooter,
        layoutSidebarHeader,
        layoutSidebarFooter,
    } = await getProps(lang)

    if (!langEnabled) notFound()

    if (maintenance) {
        return (
            <>
                {maintenanceSections.map((section) => (
                    <Suspense key={section.id}>
                        <DisplaySection section={section} />
                    </Suspense>
                ))}
            </>
        )
    }

    return (
        <>
            <header>
                {layoutHeader.map((section) => (
                    <DisplaySection key={section.id} section={section} />
                ))}
            </header>

            <div
                className={classNames(styles['content-wrap'], styles[sidebar.breakPoint!], myFont.className, {
                    [styles['left']!]: sidebar.position === 'left',
                    [styles['right']!]: sidebar.position === 'right',
                })}
            >
                {sidebar.isActive && (
                    <div className={classNames(styles['aside'], styles[sidebar.breakPoint!])}>
                        {layoutSidebarHeader.map((section) => (
                            <DisplaySection key={section.id} section={section} />
                        ))}
                        {sideContent}
                        {layoutSidebarFooter.map((section) => (
                            <DisplaySection key={section.id} section={section} />
                        ))}
                    </div>
                )}
                <main className={styles['content']}>
                    {layoutContentHeader.map((section) => (
                        <DisplaySection key={section.id} section={section} />
                    ))}
                    {content}
                    {layoutContentFooter.map((section) => (
                        <DisplaySection key={section.id} section={section} />
                    ))}
                </main>
            </div>

            <footer>
                {layoutFooter.map((section) => (
                    <DisplaySection key={section.id} section={section} />
                ))}
            </footer>
        </>
    )
}

export default OthersPageLayout
