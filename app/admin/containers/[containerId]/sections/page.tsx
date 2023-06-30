import { SectionType, SettingType } from '@prisma/client'
import { notFound } from 'next/navigation'
import getSection from '~/utilities/getSection'
import { prisma } from '~/utilities/prisma'
import Form from './Form'

const getSections = async (containerId: string) => {
    const exist = await prisma.container.findUnique({ where: { id: containerId } })
    if (!exist) return null

    const content = await getSection({ containerId, type: SectionType.CONTAINER })
    const sidebar = await getSection({ containerId, type: SectionType.CONTAINER_SIDEBAR })

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

const ContentSections = async ({ params }: any) => {
    const layout = await getSections(params.containerId)
    const sidebar = await getSidebar()

    if (!layout) notFound()

    return <Form containerId={params.containerId} layout={layout} sidebar={sidebar} />
}

export const dynamic = 'force-dynamic'

export default ContentSections
