import { FormFieldType } from '@prisma/client'
import { ObjectId } from '.'
import { LinkValue } from '~/components/LinkSelect'

type FormCreation = {
    name: string

    sendMail: boolean
    mail?: string

    successMessage: string
    errorMessage: string

    extraData?: { name: string; value: string }[]
    fields: FormFieldCreation[]
}

export type FormFieldCreation = {
    id?: ObjectId
    tempId?: string

    line: number
    position: number

    buttonType?: 'submit' | 'link'
    containerId?: ObjectId | undefined
    options?: { value: string; label: string }[]
    link?: LinkValue

    min?: number
    max?: number

    label: string
    placeholder?: string
    default?: string
    type: FormFieldType
    required: boolean
}

export default FormCreation
