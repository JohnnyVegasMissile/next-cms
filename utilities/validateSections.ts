import blocks, { BlockKey } from '~/blocks'
import { ObjectId } from '~/types'
import SectionCreation from '~/types/sectionCreation'
import { SectionResponse } from './getSection'
import set from 'lodash.set'

export const validateSections = (values: { [key in string]: SectionCreation[] }) => {
    let errors: any = {}

    Object.keys(values).forEach((key) => {
        values[key]?.forEach((section) => {
            const validate = blocks[section.block].validate

            if (!!validate) {
                const sectionErrors = validate(section.content)

                if (!!Object.keys(sectionErrors).length)
                    set(errors, `${key}.${section.position}`, sectionErrors)
            }
        })
    })

    return errors
}

export const sectionToSectionCreation = (values: { [key in string]: SectionResponse[] }) => {
    let cleanSections: any = {}

    Object.keys(values).forEach((key) => {
        cleanSections[key] = values[key]?.map((section) => ({
            id: section.id,
            type: section.type,
            block: section.block as BlockKey,
            position: section.position,
            content: section.content as any,

            medias: new Map(
                section.medias
                    ?.filter((media) => !!media.media)
                    .map((media) => [media.media?.id, media.media])
            ),

            forms: new Map(
                section.medias?.filter((media) => !!media.form).map((media) => [media.form?.id, media.form])
            ),

            menus: new Map(
                section.medias?.filter((media) => !!media.menu).map((media) => [media.menu?.id, media.menu])
            ),
        }))
    })
    console.log('cleanSections', cleanSections)
    return cleanSections
}

export const cleanSectionCreation = (values: { [key in string]: SectionCreation[] }) => {
    let cleanValues: any = {}

    Object.keys(values).forEach((key) => {
        cleanValues[key] = values[key]?.map((section) => {
            const medias: ObjectId[] = []
            const forms: ObjectId[] = []

            const stringifiedContent = JSON.stringify(section.content)

            section.medias.forEach((_, key) => {
                if (stringifiedContent.includes(`"${key}"`)) medias.push(key)

                // if (!!findInObject(section.content, key)) {
                //     medias.push(key)
                // }
            })

            section.forms.forEach((_, key) => {
                if (stringifiedContent.includes(`"${key}"`)) forms.push(key)

                // if (!!findInObject(section.content, key)) {
                //     forms.push(key)
                // }
            })

            return {
                ...section,
                medias,
                forms,
                tempId: undefined,
            }
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
