import { Section } from '@prisma/client'
import blocks, { BlockKey } from '~/blocks'
import { ObjectId } from '~/types'
import SectionCreation from '~/types/sectionCreation'

export const validateSections = (values: { [key in string]: SectionCreation[] }) => {
    let errors: any = {}

    Object.keys(values).forEach((key) => {
        values[key]?.forEach((section) => {
            const validate = blocks[section.block].validate

            if (!!validate) {
                const sectionErrors = validate(section)

                if (!!Object.keys(sectionErrors).length) {
                    if (!!errors[key]) errors[key] = new Array()

                    errors[key][section.position] = sectionErrors
                }
            }
        })
    })

    return errors
}

export const sectionToSectionCreation = (values: { [key in string]: Section[] }) => {
    let cleanSections: any = {}

    Object.keys(values).forEach((key) => {
        cleanSections[key] = values[key]?.map((section) => ({
            id: section.id,
            type: section.type,
            block: section.block as BlockKey,
            position: section.position,
            content: section.content as any,

            medias: new Map(),
            forms: new Map(),
        }))
    })

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
            })

            section.forms.forEach((_, key) => {
                if (stringifiedContent.includes(`"${key}"`)) forms.push(key)
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
