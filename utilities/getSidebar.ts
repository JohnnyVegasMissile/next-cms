import { SettingType } from '@prisma/client'
import { prisma } from './prisma'

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

export default getSidebar
