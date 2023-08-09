import { SettingType } from '@prisma/client'
import Form from './Form'
import { prisma } from '~/utilities/prisma'
import SettingsCreation, { SettingScriptsValue } from '~/types/settingsCreation'

export const metadata = {
    title: 'Settings | Admin',
}

const getSettings = async () => {
    const settings = await prisma.setting.findMany({
        where: { visible: true },
    })

    const cleanSettings: SettingsCreation = {}

    for (const setting of settings) {
        switch (setting.type) {
            case SettingType.MAIL_PORT:
            case SettingType.SIDEBAR_WIDTH:
                cleanSettings[setting.type] = parseInt(setting.value)
                break

            case SettingType.INDEXED:
            case SettingType.SIDEBAR_IS_ACTIVE:
            case SettingType.MAINTENANCE_MODE:
                cleanSettings[setting.type] = setting.value === 'true'
                break

            case SettingType.BACKGROUND_COLOR:
            case SettingType.PRIMARY_COLOR:
            case SettingType.SECONDARY_COLOR:

            case SettingType.PRIMARY_TEXT_COLOR:
            case SettingType.SECONDARY_TEXT_COLOR:
            case SettingType.DARK_COLOR:
            case SettingType.LIGHT_COLOR:
            case SettingType.EXTRA_COLOR:

            case SettingType.SIDEBAR_COLOR:
                cleanSettings[setting.type] = setting.value as `#${string}`
                break

            case SettingType.SIDEBAR_POSITION:
                cleanSettings[setting.type] = setting.value as 'left' | 'right'
                break

            case SettingType.LANGUAGE_LOCALES:
                cleanSettings[setting.type] = setting.value.split(', ')
                break

            case SettingType.SIDEBAR_BREAKPOINT_SIZE:
                cleanSettings[setting.type] = setting.value as
                    | 'extra-small'
                    | 'small'
                    | 'medium'
                    | 'large'
                    | 'extra-large'
                break

            case SettingType.SIDEBAR_UNIT:
                cleanSettings[setting.type] = setting.value as '%' | 'px' | 'em' | 'rem' | 'vw'
                break

            case SettingType.SCRIPTS:
                cleanSettings[setting.type] = JSON.parse(setting.value) as SettingScriptsValue
                break

            default:
                cleanSettings[setting.type] = setting.value
                break
        }
    }

    return cleanSettings
}

const Settings = async () => {
    const settings = await getSettings()

    return <Form settings={settings} />
}

export default Settings
