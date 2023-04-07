import { SettingType } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { getSidebar } from '~/network/api'

const useSidebarSettings = (onIsActive?: () => void) => {
    const sidebarSettings = useQuery(['sidebar'], () => getSidebar(), {
        onSuccess: (data) => {
            const sidebarIsActive =
                data?.find((e) => e.type === SettingType.SIDEBAR_IS_ACTIVE)?.value === 'true'

            console.log('!!onIsActive && sidebarIsActive', !!onIsActive, sidebarIsActive)
            if (!!onIsActive && sidebarIsActive) onIsActive()
        },
    })

    const isActive =
        sidebarSettings.data?.find((e) => e.type === SettingType.SIDEBAR_IS_ACTIVE)?.value === 'true'
    const width = `${sidebarSettings.data?.find((e) => e.type === SettingType.SIDEBAR_WIDTH)?.value || '0'}${
        sidebarSettings.data?.find((e) => e.type === SettingType.SIDEBAR_UNIT)?.value || 'rem'
    }`

    const backgroundColor =
        sidebarSettings.data?.find((e) => e.type === SettingType.SIDEBAR_COLOR)?.value || '#ef476f'
    const breakpointClass =
        sidebarSettings.data?.find((e) => e.type === SettingType.SIDEBAR_BREAKPOINT_SIZE)?.value || 'medium'
    const position =
        sidebarSettings.data?.find((e) => e.type === SettingType.SIDEBAR_POSITION)?.value || 'left'

    return {
        isActive,
        width,
        backgroundColor,
        breakpointClass,
        position,
        isLoading: sidebarSettings.isLoading,
    }
}

export default useSidebarSettings
