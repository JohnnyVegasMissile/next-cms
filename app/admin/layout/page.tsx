import { Section, SectionType, SettingType } from '@prisma/client'
import { prisma } from '~/utilities/prisma'
import Form from './Form'

const sectionNames: {
    key: 'header' | 'topSidebar' | 'bottomSidebar' | 'topContent' | 'bottomContent' | 'footer'
    type: SectionType
}[] = [
    { key: 'header', type: SectionType.LAYOUT_HEADER },
    { key: 'topSidebar', type: SectionType.LAYOUT_SIDEBAR_TOP },
    { key: 'bottomSidebar', type: SectionType.LAYOUT_SIDEBAR_BOTTOM },
    { key: 'topContent', type: SectionType.LAYOUT_CONTENT_TOP },
    { key: 'bottomContent', type: SectionType.LAYOUT_CONTENT_BOTTOM },
    { key: 'footer', type: SectionType.LAYOUT_FOOTER },
]

const getLayout = async () => {
    let layout: {
        header: Section[]
        topSidebar: Section[]
        bottomSidebar: Section[]
        topContent: Section[]
        bottomContent: Section[]
        footer: Section[]
    } = {
        header: [],
        topSidebar: [],
        bottomSidebar: [],
        topContent: [],
        bottomContent: [],
        footer: [],
    }

    for (const { key, type } of sectionNames) {
        layout[key] = await prisma.section.findMany({
            where: { type },
            orderBy: { position: 'asc' },
        })
    }

    // NextResponse extends the Web Response API
    return layout
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

const UpdateLayout = async () => {
    const layout = await getLayout()
    const sidebar = await getSidebar()

    return <Form layout={layout} sidebar={sidebar} />
}

export default UpdateLayout
