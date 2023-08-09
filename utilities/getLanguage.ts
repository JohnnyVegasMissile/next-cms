import { CodeLanguage, SettingType } from '@prisma/client'
import { prisma } from '~/utilities/prisma'

const getLanguage = async () => {
    const locales = await prisma.setting.findFirst({
        where: { type: SettingType.LANGUAGE_LOCALES },
    })

    const preferred = await prisma.setting.findFirst({
        where: { type: SettingType.LANGUAGE_PREFERRED },
    })

    return {
        locales: (locales?.value.split(', ') || [CodeLanguage.EN]) as CodeLanguage[],
        preferred: (preferred?.value || CodeLanguage.EN) as CodeLanguage,
    }
}

export default getLanguage
