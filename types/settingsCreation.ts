import { SettingType } from '@prisma/client'

type SettingsCreation = {
    [SettingType.REVALIDATE_DELAY]?: number
    [SettingType.APP_NAME]?: string
    [SettingType.MAINTENANCE_MODE]?: boolean

    [SettingType.BACKGROUND_COLOR]?: `#${string}`
    [SettingType.PRIMARY_COLOR]?: `#${string}`
    [SettingType.SECONDARY_COLOR]?: `#${string}`

    [SettingType.PRIMARY_TEXT_COLOR]?: `#${string}`
    [SettingType.SECONDARY_TEXT_COLOR]?: `#${string}`

    [SettingType.DARK_COLOR]?: `#${string}`
    [SettingType.LIGHT_COLOR]?: `#${string}`
    [SettingType.EXTRA_COLOR]?: `#${string}`

    [SettingType.MAIL_HOST]?: string
    [SettingType.MAIL_PORT]?: number
    [SettingType.MAIL_USER]?: string
    [SettingType.MAIL_PASS]?: string

    [SettingType.SIDEBAR_IS_ACTIVE]?: boolean
    [SettingType.SIDEBAR_WIDTH]?: number
    [SettingType.SIDEBAR_UNIT]?: '%' | 'px' | 'em' | 'rem' | 'vw'
    [SettingType.SIDEBAR_POSITION]?: 'left' | 'right'
}

export default SettingsCreation
