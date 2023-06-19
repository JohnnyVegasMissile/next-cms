import { SectionType, SettingType } from '@prisma/client'
import { notFound } from 'next/navigation'
import { prisma } from '~/utilities/prisma'
import Form from './Form'

const getSections = async (pageId: string) => {
    const page = await prisma.page.findUnique({ where: { id: pageId } })
    if (!page) return null

    const content = await prisma.section.findMany({
        where: { pageId, type: SectionType.PAGE },
        orderBy: { position: 'asc' },
    })

    const sidebar = await prisma.section.findMany({
        where: { pageId, type: SectionType.PAGE_SIDEBAR },
        orderBy: { position: 'asc' },
    })

    return { content, sidebar }
}

const getSidebar = async () => {
    const sidebar = await prisma.setting.findMany({
        where: {
            type: {
                in: [
                    SettingType.SIDEBAR_IS_ACTIVE,
                    SettingType.SIDEBAR_WIDTH,
                    SettingType.SIDEBAR_UNIT,
                    SettingType.SIDEBAR_COLOR,
                    SettingType.SIDEBAR_POSITION,
                    SettingType.SIDEBAR_BREAKPOINT_SIZE,
                ],
            },
        },
    })

    const isActive = sidebar.find((e) => e.type === SettingType.SIDEBAR_IS_ACTIVE)?.value === 'true'
    const width = `${sidebar.find((e) => e.type === SettingType.SIDEBAR_WIDTH)?.value || '0'}${
        sidebar.find((e) => e.type === SettingType.SIDEBAR_UNIT)?.value || 'rem'
    }`

    const backgroundColor = sidebar.find((e) => e.type === SettingType.SIDEBAR_COLOR)?.value || '#ef476f'
    const breakpointClass =
        sidebar.find((e) => e.type === SettingType.SIDEBAR_BREAKPOINT_SIZE)?.value || 'medium'
    const position = sidebar.find((e) => e.type === SettingType.SIDEBAR_POSITION)?.value || 'left'

    return {
        isActive,
        width,
        backgroundColor,
        breakpointClass,
        position,
    }
}

const EditPageSections = async ({ params }: any) => {
    const layout = await getSections(params.pageId)
    const sidebar = await getSidebar()

    if (!layout) notFound()

    return <Form pageId={params.pageId} layout={layout} sidebar={sidebar} />
}

export const dynamic = 'force-dynamic'

export default EditPageSections
