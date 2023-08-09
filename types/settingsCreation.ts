import { SettingType } from '@prisma/client'

export type SettingScriptsValue = {
    type: 'link' | 'script'
    strategy: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload' | 'worker'
    value: string
}[]

type SettingsCreation = {
    [SettingType.SITE_URL]?: string
    [SettingType.INDEXED]?: boolean
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

    [SettingType.LANGUAGE_LOCALES]?: string[]
    [SettingType.LANGUAGE_PREFERRED]?: string

    [SettingType.MAIL_HOST]?: string
    [SettingType.MAIL_PORT]?: number
    [SettingType.MAIL_USER]?: string
    [SettingType.MAIL_PASS]?: string

    [SettingType.SIDEBAR_IS_ACTIVE]?: boolean
    [SettingType.SIDEBAR_WIDTH]?: number
    [SettingType.SIDEBAR_UNIT]?: '%' | 'px' | 'em' | 'rem' | 'vw'
    [SettingType.SIDEBAR_POSITION]?: 'left' | 'right'

    [SettingType.SIDEBAR_COLOR]?: `#${string}`
    [SettingType.SIDEBAR_BREAKPOINT_SIZE]?: 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'

    [SettingType.SCRIPTS]?: SettingScriptsValue
}

export default SettingsCreation
