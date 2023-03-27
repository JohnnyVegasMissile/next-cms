import { ContainerFieldType } from '@prisma/client'
import { Dayjs } from 'dayjs'
import set from 'lodash.set'
import ContainerCreation from '~/types/containerCreation'

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
                } else {
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
