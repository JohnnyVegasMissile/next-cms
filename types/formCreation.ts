import { FormButtonType, FormFieldType, Prisma } from '@prisma/client'
import { ObjectId } from '.'
import { LinkValue } from '~/components/LinkSelect'

type FormCreation = {
    name: string

    redirectMail: boolean
    mailToRedirect?: string

    successMessage: string
    errorMessage: string

    extraData: { name: string; value: string }[]
    fields: FormFieldCreation[]
}

export type FormFieldCreation = {
    id?: ObjectId
    tempId?: string

    line: number
    position: number

    buttonType?: FormButtonType | undefined
    containerId?: ObjectId | undefined
    options?: { value: string; label: string }[]
    link?: LinkValue

    min?: number
    max?: number

    label: string
    placeholder?: string
    default?: string | number
    type: FormFieldType
    required: boolean
}

type FieldSimple = {
    id: ObjectId
    type: FormFieldType
    label: string
    placeholder: string
    container: {
        id: ObjectId
        name: string
        contents: { id: string; name: string }[]
    }

    position: true
    line: true

    options: true
    buttonType: true

    min: true
    max: true

    defaultText: true
    defaultNumber: true
    defaultMultiple: true

    required: true
}

export type FormSimple = {
    id: ObjectId
    name: string
    successMessage: string
    errorMessage: string
    extraData?: { value: string; label: string }[]
    fields: FieldSimple[]
}

export default FormCreation
