import blocks, { BlockKey } from '~/blocks'
import { ObjectId } from '~/types'
import SectionCreation from '~/types/sectionCreation'
import { SectionResponse } from './getSection'
import set from 'lodash.set'
import { CodeLanguage } from '@prisma/client'

export const validateSections = (values: {
    [key in string]: { [key in CodeLanguage]?: SectionCreation[] }
}) => {
    let errors: any = {}

    Object.keys(values).forEach((key) => {
        Object.keys(values[key]!).forEach((lang) => {
            values[key]![lang as CodeLanguage]?.forEach((section) => {
                const validate = blocks[section.block as BlockKey].validate

                if (!!validate) {
                    const sectionErrors = validate(section.value)

                    if (!!Object.keys(sectionErrors).length)
                        set(errors, `${key}.${lang}.${section.position}`, sectionErrors)
                }
            })
        })
    })

    return errors
}

export const sectionToSectionCreation = (values: {
    [key in string]: { [key in CodeLanguage]?: SectionResponse[] }
}) => {
    let cleanSections: any = {}

    Object.keys(values).forEach((key) => {
        cleanSections[key] = {}

        Object.keys(values[key]!).forEach((lang) => {
            cleanSections[key][lang as CodeLanguage] = values[key]![lang as CodeLanguage]?.map(
                (section: SectionResponse) => ({
                    id: section.id,
                    type: section.type,
                    block: section.block as BlockKey,
                    position: section.position,
                    value: section.value as any,

                    medias: new Map(
                        section.linkedData
                            ?.filter((media) => !!media.media)
                            .map((media) => [media.media?.id, media.media])
                    ),
                    forms: new Map(
                        section.linkedData
                            ?.filter((media) => !!media.form)
                            .map((media) => [media.form?.id, media.form])
                    ),
                    menus: new Map(
                        section.linkedData
                            ?.filter((media) => !!media.menu)
                            .map((media) => [media.menu?.id, media.menu])
                    ),
                })
            )
        })
    })

    return cleanSections
}

export const cleanSectionCreation = (values: {
    [key in string]: { [key in CodeLanguage]?: SectionCreation[] }
}) => {
    let cleanValues: any = {}

    Object.keys(values).forEach((key) => {
        cleanValues[key] = {}

        Object.keys(values[key]!).forEach((lang) => {
            cleanValues[key][lang as CodeLanguage] = values[key]![lang as CodeLanguage]?.map((section) => {
                const medias: ObjectId[] = []
                const forms: ObjectId[] = []
                const links: ObjectId[] = []
                const menus: ObjectId[] = []

                const stringifiedContent = JSON.stringify(section.value)

                section.medias.forEach((_, key) => {
                    if (stringifiedContent.includes(`"${key}"`)) medias.push(key)
                })

                section.forms.forEach((_, key) => {
                    if (stringifiedContent.includes(`"${key}"`)) forms.push(key)
                })

                section.links.forEach((_, key) => {
                    if (stringifiedContent.includes(`"${key}"`)) links.push(key)
                })

                section.menus.forEach((_, key) => {
                    if (stringifiedContent.includes(`"${key}"`)) menus.push(key)
                })

                return {
                    ...section,
                    medias,
                    forms,
                    links,
                    menus,
                    tempId: undefined,
                }
            })
        })
    })

    return cleanValues
}

// function that get a object and a string and test in every values of the object if the string is included, it also test in nested object and arrays. return the path of the value if it's included in the object else return null

function findInObject(obj: any, str: string): string | null {
    let path = ''
    let found = false

    function find(obj: any, str: string) {
        if (typeof obj === 'object') {
            for (const key in obj) {
                if (typeof obj[key] === 'object') {
                    path += `${key}.`
                    find(obj[key], str)
                } else if (typeof obj[key] === 'string' && obj[key].includes(str)) {
                    path += `${key}`
                    found = true
                }
            }
        }
    }

    find(obj, str)

    return found ? path : null
}
