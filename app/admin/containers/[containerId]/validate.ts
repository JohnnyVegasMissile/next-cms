import { ContainerFieldType } from '@prisma/client'
import dayjs, { Dayjs } from 'dayjs'
import set from 'lodash.set'
import ContainerCreation, { ContainerFieldCreation } from '~/types/containerCreation'
import { FullContainer } from './Form'

const validate = (values: ContainerCreation<Dayjs>) => {
    let errors: any = {}

    if (!values.name) {
        errors.name = 'Required'
    }

    for (let i = 0; i < values.slug.length; i++) {
        if (!values.slug[i]) set(errors, `slug.${i}`, 'Required')
    }

    for (let i = 0; i < values.metadatas?.length; i++) {
        if (!values.metadatas[i]?.content) set(errors, `metadatas.${i}`, 'Required')
    }

    for (let i = 0; i < values.contentsMetadatas?.length; i++) {
        if (!values.contentsMetadatas[i]?.content) set(errors, `contentsMetadatas.${i}`, 'Required')
    }

    for (let i = 0; i < values.fields.length; i++) {
        const field = values.fields[i]
        if (!field?.name) set(errors, `fields.${i}.name`, 'Required')

        switch (values.fields[i]?.type) {
            case ContainerFieldType.STRING: {
                break
            }

            case ContainerFieldType.NUMBER: {
                if (field?.multiple) {
                    for (let j = 0; j < (field.defaultMultipleNumberValue?.length || 0); j++) {
                        if (
                            field?.valueMin !== undefined &&
                            (field?.defaultMultipleNumberValue?.[j] || 0) < field?.valueMin
                        ) {
                            set(errors, `fields.${i}.defaultMultipleNumberValue.${j}`, 'Out of limit')
                        } else if (
                            field?.valueMax !== undefined &&
                            (field?.defaultMultipleNumberValue?.[j] || 0) > field?.valueMax
                        ) {
                            set(errors, `fields.${i}.defaultMultipleNumberValue.${j}`, 'Out of limit')
                        }
                    }
                } else if (field?.defaultNumberValue !== undefined) {
                    if (field?.valueMin !== undefined && (field?.defaultNumberValue || 0) < field?.valueMin) {
                        set(errors, `fields.${i}.defaultNumberValue`, 'Out of limit')
                    } else if (
                        field?.valueMax !== undefined &&
                        (field?.defaultNumberValue || 0) > field?.valueMax
                    ) {
                        set(errors, `fields.${i}.defaultNumberValue`, 'Out of limit')
                    }
                }
                break
            }

            case ContainerFieldType.DATE: {
                if (field?.multiple) {
                    console.log('kkkk multi')
                    for (let j = 0; j < (field.defaultMultipleDateValue?.length || 0); j++) {
                        if (
                            !!field?.startDate &&
                            field?.defaultMultipleDateValue?.[j]! < field?.startDate.startOf('day')
                        ) {
                            set(errors, `fields.${i}.defaultMultipleDateValue.${j}`, 'Out of limit')
                        } else if (
                            !!field?.endDate &&
                            field?.defaultMultipleDateValue?.[j]! > field?.endDate.endOf('day')
                        ) {
                            set(errors, `fields.${i}.defaultMultipleDateValue.${j}`, 'Out of limit')
                        }
                    }
                } else {
                    if (!!field?.startDate && field?.defaultDateValue! < field?.startDate.startOf('day')) {
                        set(errors, `fields.${i}.defaultDateValue`, 'Out of limit')
                    } else if (!!field?.endDate && field?.defaultDateValue! > field?.endDate.endOf('day')) {
                        set(errors, `fields.${i}.defaultDateValue`, 'Out of limit')
                    }
                }
                break
            }

            default:
                break
        }
    }

    return errors
}

export default validate

export const cleanBeforeSend = (values: ContainerCreation<Dayjs>) => {
    let cleanValues = { ...values }
    const fields: ContainerFieldCreation<string>[] = []

    for (const field of cleanValues.fields) {
        let defaultValue: any = {}

        switch (field.type) {
            case ContainerFieldType.RICHTEXT:
            case ContainerFieldType.COLOR:
            case ContainerFieldType.CONTENT:
            case ContainerFieldType.VIDEO:
            case ContainerFieldType.FILE:
            case ContainerFieldType.IMAGE:
            case ContainerFieldType.PARAGRAPH:
            case ContainerFieldType.STRING: {
                if (field.multiple) {
                    defaultValue.defaultMultipleTextValue = field.defaultMultipleTextValue
                } else {
                    defaultValue.defaultTextValue = field.defaultTextValue
                }
                break
            }

            case ContainerFieldType.NUMBER: {
                if (field.multiple) {
                    defaultValue.defaultMultipleNumberValue = field.defaultMultipleNumberValue
                } else {
                    defaultValue.defaultNumberValue = field.defaultNumberValue
                }
                break
            }

            case ContainerFieldType.DATE: {
                if (field.multiple) {
                    defaultValue.defaultMultipleDateValue = field.defaultMultipleDateValue?.map((date) =>
                        date?.toISOString()
                    )
                } else {
                    defaultValue.defaultDateValue = field.defaultDateValue?.toISOString() || undefined
                    defaultValue.startDate = field.startDate?.toISOString() || undefined
                    defaultValue.endDate = field.endDate?.toISOString() || undefined
                }
                break
            }

            case ContainerFieldType.LOCATION:
            case ContainerFieldType.OPTION:
            case ContainerFieldType.LINK: {
                if (field.multiple) {
                    defaultValue.defaultMultipleJson = field.defaultMultipleJsonValue
                } else {
                    defaultValue.defaultJsonValue = field.defaultJsonValue
                }
                break
            }
        }

        fields.push({
            id: field.id,
            name: field.name,
            required: !!field.required,
            type: field.type,
            multiple: !!field.multiple,
            position: field.position,
            metadatas: field.metadatas,
            ...defaultValue,
        })
    }

    return { ...cleanValues, fields }
}

export const containerToContainerCreation = (container: FullContainer): ContainerCreation<Dayjs> => ({
    ...container,
    fields:
        container?.fields?.map((field) => ({
            ...field,

            min: field.min || undefined,
            max: field.min || undefined,

            startDate: field.startDate ? dayjs(field.startDate) : undefined,
            endDate: field.endDate ? dayjs(field.endDate) : undefined,
            valueMin: field.valueMin || undefined,
            valueMax: field.valueMax || undefined,

            defaultTextValue: field.defaultTextValue || undefined,
            defaultMultipleTextValue: field.defaultMultipleTextValue || undefined,
            defaultNumberValue: field.defaultNumberValue || undefined,
            defaultMultipleNumberValue: field.defaultMultipleNumberValue || undefined,
            defaultDateValue: field.defaultDateValue ? dayjs(field.defaultDateValue) : undefined,
            defaultMultipleDateValue: field.defaultMultipleDateValue.map((date) => dayjs(date)) || [],
            defaultJsonValue: field.defaultJsonValue || undefined,
            defaultMultipleJsonValue: field.defaultMultipleJsonValue || undefined,
        })) || [],
    slug: container?.slug?.basic.split('/') || [''],
})
